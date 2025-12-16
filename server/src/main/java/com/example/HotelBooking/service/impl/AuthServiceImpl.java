package com.example.HotelBooking.service.impl;

import com.example.HotelBooking.dto.LoginRequest;
import com.example.HotelBooking.dto.LoginResponse;
import com.example.HotelBooking.dto.RegisterRequest;
import com.example.HotelBooking.dto.UserResponse;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.exception.EmailAlreadyExistsException;
import com.example.HotelBooking.repository.UserRepository;
import com.example.HotelBooking.security.jwt.JwtService;
import com.example.HotelBooking.service.AuthService;
import com.example.HotelBooking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {
    private final UserService userService;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    @Override
    public UserResponse registerUser(RegisterRequest registerRequest) {
        String emailIgnoreCase = registerRequest.email().toLowerCase();

        if (userService.existsByEmail(emailIgnoreCase)) {
            throw new EmailAlreadyExistsException(emailIgnoreCase);
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.password());

        User user = User.builder()
                .name(registerRequest.name())
                .password(encodedPassword)
                .email(emailIgnoreCase)
                .build();

        User savedUser = userService.save(user);

        return UserResponse.from(savedUser);
    }

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) {
        String email = loginRequest.email();
        String password = loginRequest.password();

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = (User) auth.getPrincipal();

        String token = jwtService.generateToken(user.getId());

        Date expiresAt = jwtService.extractExpiresAt(token);

        return new LoginResponse(
                token,
                expiresAt,
                UserResponse.from(user)
        );

    }
}
