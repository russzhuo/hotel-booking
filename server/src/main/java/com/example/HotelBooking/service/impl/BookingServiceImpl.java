package com.example.HotelBooking.service.impl;

import com.example.HotelBooking.dto.BookingResponse;
import com.example.HotelBooking.dto.CreateBookingRequest;
import com.example.HotelBooking.dto.PlaceResponse;
import com.example.HotelBooking.dto.UpdateBookingRequest;
import com.example.HotelBooking.entity.Booking;
import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.exception.ResourceNotFoundException;
import com.example.HotelBooking.infrastructure.cache.BookingRedisCache;
import com.example.HotelBooking.repository.BookingRepository;
import com.example.HotelBooking.repository.PlaceRepository;
import com.example.HotelBooking.service.BookingService;
import com.example.HotelBooking.utils.UpdateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    private final PlaceRepository placeRepository;

    private final BookingRedisCache bookingCache;

    @Override
    public List<BookingResponse> getOwnedBookings(User user) {
        List<BookingResponse> cached = bookingCache.getUserBookings(user.getId());
        if (cached != null) {
            if (cached.isEmpty()) {
                log.info("User bookings CACHE HIT (empty list) – userId={}", user.getId());
            } else {
                log.info("User bookings CACHE HIT ({} items) – userId={}", cached.size(), user.getId());
            }

            return cached;
        }

        log.info("User bookings CACHE MISS – loading from DB – userId={}", user.getId());

        List<Booking> bookingEntities = bookingRepository.findAllByUserId(user.getId());

        if (bookingEntities != null && !bookingEntities.isEmpty()) {
            List<BookingResponse> respList = bookingEntities.stream().map((booking) -> BookingResponse.from(booking)).toList();

            bookingCache.putUserBookings(user.getId(), respList);
            return respList;
        }

        return null;
    }

    @Override
    public BookingResponse createBooking(CreateBookingRequest createBookingRequest, User user) {
        Place place = placeRepository.findById(createBookingRequest.placeId())
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id: " + createBookingRequest.placeId()));

        Booking booking = Booking.builder()
                .price(createBookingRequest.price())
                .checkIn(createBookingRequest.checkIn())
                .checkOut(createBookingRequest.checkOut())
                .place(place)
                .guests(createBookingRequest.numberOfGuests())
                .user(user)
                .build();

        // Persist booking
        bookingRepository.save(booking);

        BookingResponse resp = BookingResponse.from(booking);

        bookingCache.putBooking(booking.getId(), resp);
        bookingCache.evictUserBookings(user.getId());
        bookingCache.evictAllBookings();

        return resp;
    }


    @Override
    public BookingResponse updateBooking(UpdateBookingRequest updateBookingRequest, User user) {
        Booking booking = bookingRepository.findById(updateBookingRequest.id())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + updateBookingRequest.id()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to update this booking");
        }

        UpdateUtils.updateIfPresent(updateBookingRequest.checkIn(), booking::setCheckIn);
        UpdateUtils.updateIfPresent(updateBookingRequest.checkOut(), booking::setCheckOut);

        BookingResponse resp = BookingResponse.from(booking);

        bookingCache.putBooking(booking.getId(), resp);
        bookingCache.evictUserBookings(user.getId());
        bookingCache.evictAllBookings();

        log.info("Booking updated and caches refreshed – placeId={}, userId={}", booking.getId(), user.getId());

        return resp;
    }

    @Override
    public BookingResponse getBookingById(UUID id) {
        BookingResponse cached = bookingCache.getBooking(id);
        if (cached != null) {
            log.info("Booking CACHE HIT – bookingId={}", id);
            return cached;
        }

        log.info("Booking CACHE MISS – bookingId={}", id);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id" + id));
        return BookingResponse.from(booking);
    }

    @Override
    public void deleteBooking(UUID id, User user) {
        log.info("Delete booking request – bookingId={}, userId={}", id, user.getId());

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!booking.getUser().getId().equals(user.getId())) {
            log.warn("Access denied: user {} tried to delete booking {} owned by {}",
                    user.getId(), id, booking.getUser().getId());
            throw new AccessDeniedException("You can only delete your own bookings");
        }

        bookingRepository.delete(booking);

        bookingCache.evictBooking(id);
        bookingCache.evictUserBookings(user.getId());
        bookingCache.evictAllBookings();
    }

}
