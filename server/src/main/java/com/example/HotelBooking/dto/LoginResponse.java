package com.example.HotelBooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Date;

public record LoginResponse (
        String token,
        Date expiresAt,
        UserResponse user
) {
}
