package com.example.HotelBooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

public record ApiResponse<T>(
        boolean success,
        T data,
        String message,

        @JsonInclude(JsonInclude.Include.NON_NULL)   // ← only include if not null
        List<String> errors
) {

    // Success response
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    // Error response (validation, business rules, etc.)
    public static <T> ApiResponse<T> error(List<String> errors) {
        return new ApiResponse<>(false, null, "Request failed", errors);
    }

    public static <T> ApiResponse<T> error(String error) {
        return error(List.of(error));
    }
}