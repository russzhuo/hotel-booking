package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.*;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("REGISTER REQUEST RECEIVED");
        log.info("├─ Username : {}", registerRequest.name());
        log.info("├─ Email    : {}", registerRequest.email());
        log.info("├─ Password    : {}", registerRequest.password());

        UserResponse userResp = authService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(userResp, "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("LOGIN REQUEST RECEIVED");
        log.info("├─ Email    : {}", loginRequest.email());
        log.info("├─ Password    : {}", loginRequest.password());

        LoginResponse loginResponse = authService.loginUser(loginRequest);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(loginResponse, "Login successful!"));
    }
}
