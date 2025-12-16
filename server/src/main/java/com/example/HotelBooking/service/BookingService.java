package com.example.HotelBooking.service;

import com.example.HotelBooking.dto.BookingResponse;
import com.example.HotelBooking.dto.CreateBookingRequest;
import com.example.HotelBooking.dto.UpdateBookingRequest;
import com.example.HotelBooking.entity.Booking;
import com.example.HotelBooking.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingService {
    public List<BookingResponse> getOwnedBookings (User user);
    public BookingResponse createBooking(CreateBookingRequest createBookingRequest, User user);
    public BookingResponse updateBooking(UpdateBookingRequest updateBookingRequest, User user);
    public BookingResponse getBookingById(UUID id);
    public void deleteBooking(UUID id, User user);
}