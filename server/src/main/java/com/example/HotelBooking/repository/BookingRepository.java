package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByUserId(UUID userId);
    List<Booking> findAllByPlaceId(UUID placeId);

    // Useful for checking availability
    List<Booking> findAllByPlaceIdAndCheckOutAfterAndCheckInBefore(
            UUID placeId, LocalDate checkIn, LocalDate checkOut);
}