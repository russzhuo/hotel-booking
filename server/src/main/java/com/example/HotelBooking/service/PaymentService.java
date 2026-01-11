package com.example.HotelBooking.service;

import com.example.HotelBooking.dto.CreateCheckSessionRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

public interface PaymentService {
    public Session createCheckoutSession(CreateCheckSessionRequest request) throws StripeException;
}
