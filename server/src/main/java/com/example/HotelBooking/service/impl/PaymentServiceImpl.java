package com.example.HotelBooking.service.impl;

import com.example.HotelBooking.dto.CreateCheckSessionRequest;
import com.example.HotelBooking.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.InvoiceItemCreateParams;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    @Override
    public Session createCheckoutSession(CreateCheckSessionRequest request) throws StripeException {
        Long unitAmountCents = request.amount()
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData.builder().setName(request.name()).build();

        SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency(request.currency().toLowerCase())
                .setUnitAmount(unitAmountCents)
                .setProductData(productData)
                .build();

        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(priceData)
                .build();

        SessionCreateParams sessionCreateParams = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.successUrl())
                .setCancelUrl(request.cancelUrl())
                .addLineItem(lineItem)

                .build();

        Session session = Session.create(sessionCreateParams);

        return session;
    }

}

