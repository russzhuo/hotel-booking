package com.example.HotelBooking.dto;

import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.PlacePhoto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public record PlaceDetailResponse(
        PlaceResponse basicInfo,
        List<LocalDate> blockedDates
) {
}
