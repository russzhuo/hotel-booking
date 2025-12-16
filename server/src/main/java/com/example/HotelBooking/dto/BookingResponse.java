package com.example.HotelBooking.dto;

import com.example.HotelBooking.entity.Booking;
import com.example.HotelBooking.entity.PlacePhoto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public record BookingResponse (
        UUID id,
        String placeTitle,
        String placeAddress,
        LocalDateTime checkIn,
        LocalDateTime checkOut,
        BigDecimal price,
        String username,
        LocalDateTime createdAt,
        String placeCover
) {
    public static BookingResponse from(Booking booking) {
        String placeCover = booking.getPlace().getPhotos().stream().filter(Objects::nonNull).min(Comparator.comparingInt(PlacePhoto::getSortOrder)).map(PlacePhoto::getUrl).orElse("cover-not-found.jpg");

        return new BookingResponse(
                booking.getId(),
                booking.getPlace().getTitle(),
                booking.getPlace().getAddress(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getPrice(),
                booking.getUser().getName(),
                booking.getCreatedAt(),
                placeCover
        );
    }
}
