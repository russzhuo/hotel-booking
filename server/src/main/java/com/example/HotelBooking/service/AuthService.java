package com.example.HotelBooking.service;

import com.example.HotelBooking.dto.LoginRequest;
import com.example.HotelBooking.dto.LoginResponse;
import com.example.HotelBooking.dto.RegisterRequest;
import com.example.HotelBooking.dto.UserResponse;
import com.example.HotelBooking.entity.User;

public interface AuthService {
    UserResponse registerUser(RegisterRequest registerRequest);
    LoginResponse loginUser(LoginRequest loginRequest);
}
