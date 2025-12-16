package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.*;
import com.example.HotelBooking.entity.Booking;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.yaml.snakeyaml.util.ArrayUtils;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@RequestBody CreateBookingRequest createBookingRequest, @AuthenticationPrincipal User user) {
        log.info("User '{}' (ID: {}) is attempting to create a booking for place ID: {}",
                user.getName(),
                user.getId(),
                createBookingRequest.placeId());

        BookingResponse bookingResponse = bookingService.createBooking(createBookingRequest, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(bookingResponse, "Booking created successfully"));
    }

    @GetMapping("/user-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getOwnedBookings(@AuthenticationPrincipal User user) {
        log.info("Fetching all bookings for user: '{}' (ID: {})", user.getUsername(), user.getId());

        List<BookingResponse> bookingResponseList = bookingService.getOwnedBookings(user);

        log.info("Found {} booking(s) for user: {}", bookingResponseList == null || bookingResponseList.isEmpty() ? 0 : bookingResponseList.size(), user.getUsername());

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(bookingResponseList, "Bookings retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getPlaceById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        log.info("Fetching booking with ID: {}", id);

        BookingResponse bookingResponse = bookingService.getBookingById(id);

        return ResponseEntity.ok(ApiResponse.success(bookingResponse, "Booking retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<BookingResponse>> updatePlace(@Valid @RequestBody UpdateBookingRequest updateBookingRequest, @AuthenticationPrincipal User user) {
        log.info("User {} is creating a new place", user.getName());

        BookingResponse bookingResponse = bookingService.updateBooking(updateBookingRequest, user);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(bookingResponse, "Booking updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> deleteBooking(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        log.info("User '{}' (ID: {}) is attempting to cancel booking ID: {}",
                user.getName(), user.getId(), id);

        bookingService.deleteBooking(id, user);

        log.info("Booking ID: {} successfully cancelled by user ID: {}", id, user.getId());

        return ResponseEntity.ok(
                ApiResponse.success(null, "Your reservation has been successfully cancelled.")
        );
    }
}
