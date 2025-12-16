package com.example.HotelBooking.service;

import com.example.HotelBooking.entity.PlacePhoto;

import java.util.List;
import java.util.UUID;

public interface PlacePhotoService {
    List<PlacePhoto> saveAll(List<PlacePhoto> photos);
    List<PlacePhoto> findAllByPlaceId(UUID placeId);
    void deleteById(UUID photoId);
    void deleteAllByPlaceId(UUID placeId);
}