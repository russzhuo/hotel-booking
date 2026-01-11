package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.CreateCheckSessionRequest;
import com.example.HotelBooking.service.PaymentService;
import com.stripe.model.Price;
import com.stripe.model.billingportal.Session;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.stripe.Stripe;

import java.math.BigDecimal;

@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@RestController
public class PaymentController {
    private final PaymentService paymentService;
}
