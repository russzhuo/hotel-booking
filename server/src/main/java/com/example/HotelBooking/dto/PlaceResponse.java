package com.example.HotelBooking.dto;

import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.PlacePhoto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public record PlaceResponse(
        UUID id,

        String title,
        String address,
        String description,
        String extraInfo,

        LocalTime checkIn,
        LocalTime checkOut,

        int maxGuests,
        BigDecimal price,

        String ownerUsername,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<String> perks,

        List<String> photoUrls
) {
    public static PlaceResponse from(Place place) {
        return new PlaceResponse(
                place.getId(),
                place.getTitle(),
                place.getAddress(),
                place.getDescription(),
                place.getExtraInfo(),
                place.getCheckIn(),
                place.getCheckOut(),
                place.getMaxGuests(),
                place.getPrice(),
                place.getOwner().getName(),
                place.getCreatedAt(),
                place.getUpdatedAt(),
                place.getPerks().stream().map((perk) -> perk.getPerk()).toList(),
                place.getPhotos().stream()
                        .sorted(Comparator.comparingInt(photo -> photo.getSortOrder() != null ? photo.getSortOrder() : 0))
                        .map((photo) -> photo.getUrl()).toList()
        );
    }
}
