package com.example.HotelBooking.infrastructure.cache;

import com.example.HotelBooking.dto.PlaceResponse;
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
public class PlaceRedisCache {
    private final RedisTemplate<String, Object> redisTemplate;

    private Duration TTL = Duration.ofMinutes(30);

    public void putPlace(UUID placeId, PlaceResponse response) {
        try {
            redisTemplate.opsForValue()
                    .set(CacheKey.Place.byId(placeId), response, TTL);
        } catch (Exception e) {
            log.warn("Redis put place failed: {}", placeId, e);
        }
    }

    public PlaceResponse getPlace(UUID placeId) {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.Place.byId(placeId));
            return o instanceof PlaceResponse b ? b : null;
        } catch (Exception e) {
            log.warn("Redis get place failed: {}", placeId, e);
            return null;
        }
    }

    // === User places list ===
    public void putUserPlaces(UUID userId, List<PlaceResponse> list) {
        try {
            redisTemplate.opsForValue()
                    .set(CacheKey.UserPlaces.byUserId(userId), list, TTL);
        } catch (Exception e) {
            log.warn("Redis put user places failed: {}", userId, e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<PlaceResponse> getUserPlaces(UUID userId) {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.UserPlaces.byUserId(userId));
            return o == null ? null : (List<PlaceResponse>) o;
        } catch (Exception e) {
            log.warn("Redis get user places failed: {}", userId, e);
            return null;
        }
    }

    // === All places ===
    public void putAllPlaces(List<PlaceResponse> all) {
        try {
            redisTemplate.opsForValue().set(CacheKey.AllPlaces.KEY, all, TTL);
        } catch (Exception e) {
            log.warn("Redis put all places failed", e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<PlaceResponse> getAllPlaces() {
        try {
            Object o = redisTemplate.opsForValue().get(CacheKey.AllPlaces.KEY);
            return o == null ? null : (List<PlaceResponse>) o;
        } catch (Exception e) {
            log.warn("Redis get all places failed", e);
            return null;
        }
    }

    // === Eviction ===
    public void evictPlace(UUID placeId) {
        redisTemplate.delete(CacheKey.Place.byId(placeId));
    }

    public void evictUserPlaces(UUID userId) {
        redisTemplate.delete(CacheKey.UserPlaces.byUserId(userId));
    }

    public void evictAllPlaces() {
        redisTemplate.delete(CacheKey.AllPlaces.KEY);
    }
}