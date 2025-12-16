package com.example.HotelBooking.utils;

import java.util.function.Consumer;

public final class UpdateUtils {

    private UpdateUtils() {
        // prevent instantiation
    }

    public static <T> void updateIfPresent(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }
}