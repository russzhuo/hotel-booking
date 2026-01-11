package com.example.HotelBooking.service;

import com.stripe.model.Event;
import org.springframework.stereotype.Service;

public interface WebhookService {
    public void processStripeEventAsync(Event event);
}
