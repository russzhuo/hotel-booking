package com.example.HotelBooking.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record CreatePlaceRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255)
        String title,

        @NotBlank(message = "Address is required")
        String address,

        String description,

        String extraInfo,

        @NotNull(message = "Check-in time is required")
        LocalTime checkIn,

        @NotNull(message = "Check-out time is required")
        LocalTime checkOut,

        @NotNull(message = "Max guests is required")
        @Min(1)
        @Max(50)
        Integer maxGuests,

        @NotNull(message = "Price is required")
        @Positive
        BigDecimal price, // in your currency (e.g., USD, EUR)

        // Perks (e.g., wifi, parking, pool)
        @NotEmpty(message = "At least one perk is recommended")
        List<String> perks,

        // Photo URLs (uploaded separately or via base64/cloud)
        List<String> photoUrls
) {
}

