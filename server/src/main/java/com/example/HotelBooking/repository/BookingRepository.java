package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.Booking;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByUserId(UUID userId);

    List<Booking> findAllByPlaceId(UUID placeId);

    Optional<Booking> findByStripeCheckoutSessionId(String stripeCheckoutSessionId);

    List<Booking> findAllByPlaceIdAndCheckOutAfterAndCheckInBefore(
            UUID placeId, LocalDate checkIn, LocalDate checkOut);

    @Query("""
    select b from Booking b
    where b.place.id = :placeId
    and b.checkOut > :endOfToday
    order by b.checkIn asc
""")
    List<Booking> findActiveBookingsByPlaceId(@Param("placeId") UUID placeId, @Param("endOfToday") LocalDateTime endOfToday);

}