package com.example.HotelBooking.dto;

import com.example.HotelBooking.entity.Booking;
import com.stripe.model.checkout.Session;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateBookingResponse(
        UUID bookingId,
        Booking.PaymentStatus paymentStatus,
        String stripeCheckoutUrl
) {
    public static CreateBookingResponse from(Booking booking, Session session) {
        return new CreateBookingResponse(
                booking.getId(),
                booking.getStripePaymentStatus(),
                session.getUrl()
        );
    }
}
