package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.ApiResponse;
import com.example.HotelBooking.dto.UserResponse;
import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getUserInfo(@AuthenticationPrincipal User user) {
        log.info("User profile accessed: {}, {}, {}", user.getId(), user.getEmail(), user.getName());
        return ResponseEntity.ok().body(ApiResponse.success(UserResponse.from(user), "User information retrieved successfully"));
    }
}
