package com.example.HotelBooking.dto;

import java.math.BigDecimal;

public record CreateCheckSessionRequest(
        String currency,
        BigDecimal amount,
        String successUrl,
        String cancelUrl,
        String name
) {
}
