package com.example.HotelBooking.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CreateBookingRequest(

        @NotNull(message = "Place ID is required")
        UUID placeId,

        @NotNull(message = "Check-in date is required")
        @FutureOrPresent(message = "Check-in date cannot be in the past")
        LocalDateTime checkIn,

        @NotNull(message = "Check-out date is required")
        @Future(message = "Check-out date must be in the future")
        LocalDateTime checkOut,

        @NotNull(message = "Number of guests is required")
        @Min(value = 1, message = "At least 1 guest is required")
        @Max(value = 50, message = "Maximum 50 guests allowed")
        Integer numberOfGuests,

        @NotNull(message = "Total price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price   // client tells you what they expect to pay
) {}