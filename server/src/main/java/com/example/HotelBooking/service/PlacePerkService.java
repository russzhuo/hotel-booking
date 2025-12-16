package com.example.HotelBooking.service;

import com.example.HotelBooking.entity.PlacePerk;

import java.util.List;
import java.util.UUID;

public interface PlacePerkService {
    List<PlacePerk> saveAll(List<PlacePerk> perks);
    List<PlacePerk> findAllByPlaceId(UUID placeId);
    void deleteAllByPlaceId(UUID placeId);
}