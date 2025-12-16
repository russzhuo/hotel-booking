package com.example.HotelBooking.infrastructure.cache;

import java.time.Duration;
import java.util.UUID;

public interface CacheKey {
    String SEPARATOR = ":";

    interface Place {
        String PREFIX = "place" + SEPARATOR;

        static String byId(UUID placeId) {
            return PREFIX + placeId.toString();
        }
    }

    interface Booking {
        String PREFIX = "booking" + SEPARATOR;

        static String byId(UUID bookingId) {
            return PREFIX + bookingId.toString();
        }
    }

    interface UserPlaces {
        String PREFIX = "user" + SEPARATOR + "places" + SEPARATOR;

        static String byUserId(UUID userId) {
            return PREFIX + userId.toString();
        }
    }

    interface UserBookings {
        String PREFIX = "user" + SEPARATOR + "bookings" + SEPARATOR;

        static String byUserId(UUID userId) {
            return PREFIX + userId.toString();
        }
    }

    interface AllPlaces {
        String KEY = "all:places";
    }

    interface AllBookings {
        String KEY = "all:bookings";
    }
}
