package com.example.HotelBooking.service.impl;

import com.example.HotelBooking.entity.Booking;
import com.example.HotelBooking.repository.BookingRepository;
import com.example.HotelBooking.service.BookingService;
import com.example.HotelBooking.service.WebhookService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WebhookServiceImpl implements WebhookService {
    private final BookingRepository bookingRepository;

    @Async
    @Override
    public void processStripeEventAsync(Event event) {
        log.info("Processing Stripe event: {}", event.getType());

        switch (event.getType()) {
            case "checkout.session.completed" -> onCheckoutCompleted(event);
            case "checkout.session.expired" -> onCheckoutExpired(event);
            // Optional: rare cases with delayed payment methods
            case "checkout.session.async_payment_succeeded" -> onAsyncPaymentSucceeded(event);
            default -> log.debug("Ignored event type: {}", event.getType());
        }
    }

    private void onCheckoutExpired(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

        if (session == null) {
            log.warn("Received null CheckoutSession in completed event");
            return;
        }

        String sessionId = session.getId();
        Optional<Booking> bookingOpt = bookingRepository.findByStripeCheckoutSessionId(sessionId);

        if (!bookingOpt.isPresent()) {
            log.warn("No booking found for checkout session: {}", sessionId);
            return; // or throw if you consider it critical
        }

        Booking booking = bookingOpt.get();
        booking.setStripePaymentStatus(Booking.PaymentStatus.CANCELLED);
    }

    private void onAsyncPaymentSucceeded(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

        if (session == null) {
            log.warn("Received null CheckoutSession in completed event");
            return;
        }

        String sessionId = session.getId();
        Optional<Booking> bookingOpt = bookingRepository.findByStripeCheckoutSessionId(sessionId);

        if (!bookingOpt.isPresent()) {
            log.warn("No booking found for checkout session: {}", sessionId);
            return; // or throw if you consider it critical
        }

        Booking booking = bookingOpt.get();
        booking.setStripePaymentStatus(Booking.PaymentStatus.PAID);
    }

    private void onCheckoutCompleted(Event event) {
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

        if (session == null) {
            log.warn("Received null CheckoutSession in completed event");
            return;
        }

        String sessionId = session.getId();
        Optional<Booking> bookingOpt = bookingRepository.findByStripeCheckoutSessionId(sessionId);

        if (!bookingOpt.isPresent()) {
            log.warn("No booking found for checkout session: {}", sessionId);
            return; // or throw if you consider it critical
        }

        Booking booking = bookingOpt.get();
        booking.setStripePaymentStatus(Booking.PaymentStatus.PAID);
    }
}
