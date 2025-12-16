// src/main/java/com/example/HotelBooking/cache/BookingRedisCache.java

package com.example.HotelBooking.infrastructure.cache;

import com.example.HotelBooking.dto.BookingResponse;
import com.example.HotelBooking.infrastructure.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.UUID;


@Slf4j
@Component
@RequiredArgsConstructor
public class BookingRedisCache {
    private final RedisTemplate<String, Object> redisTemplate;

    private Duration TTL = Duration.ofMinutes(30);

    public void putBooking(UUID bookingId, BookingResponse response) {
        try {
            redisTemplate.opsForValue()
                    .set(CacheKey.Booking.byId(bookingId), response, TTL);
        } catch (Exception e) {
            log.warn("Redis put booking failed: {}", bookingId, e);
        }
    }

    public BookingResponse getBooking(UUID bookingId) {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.Booking.byId(bookingId));
            return o instanceof BookingResponse b ? b : null;
        } catch (Exception e) {
            log.warn("Redis get booking failed: {}", bookingId, e);
            return null;
        }
    }

    // === User bookings list ===
    public void putUserBookings(UUID userId, List<BookingResponse> list) {
        try {
            redisTemplate.opsForValue()
                    .set(CacheKey.UserBookings.byUserId(userId), list, TTL);
        } catch (Exception e) {
            log.warn("Redis put user bookings failed: {}", userId, e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<BookingResponse> getUserBookings(UUID userId) {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.UserBookings.byUserId(userId));
            return o == null ? null : (List<BookingResponse>) o;
        } catch (Exception e) {
            log.warn("Redis get user bookings failed: {}", userId, e);
            return null;
        }
    }

    // === All bookings (admin) ===
    public void putAllBookings(List<BookingResponse> all) {
        try {
            redisTemplate.opsForValue().set(CacheKey.AllBookings.KEY, all, TTL);
        } catch (Exception e) {
            log.warn("Redis put all bookings failed", e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<BookingResponse> getAllBookings() {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.AllBookings.KEY);
            return o == null ? null : (List<BookingResponse>) o;
        } catch (Exception e) {
            log.warn("Redis get all bookings failed", e);
            return null;
        }
    }

    // === Eviction ===
    public void evictBooking(UUID bookingId) {
        redisTemplate.delete(CacheKey.Booking.byId(bookingId));
    }

    public void evictUserBookings(UUID userId) {
        redisTemplate.delete(CacheKey.UserBookings.byUserId(userId));
    }

    public void evictAllBookings() {
        redisTemplate.delete(CacheKey.AllBookings.KEY);
    }
}