package com.example.HotelBooking.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record UpdateBookingRequest(
        @NotNull(message = "Booking ID is required")
        UUID id,

        @FutureOrPresent(message = "Check-in date must be today or in the future")
        LocalDateTime checkIn,

        @FutureOrPresent(message = "Check-out date must be after check-in")
        LocalDateTime checkOut
) {
    public UpdateBookingRequest {
        if (checkIn != null && checkOut != null && !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Check-out must be after check-in");
        }
    }
}
