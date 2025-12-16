package com.example.HotelBooking.service;

import com.example.HotelBooking.dto.CreatePlaceRequest;
import com.example.HotelBooking.dto.PlaceResponse;
import com.example.HotelBooking.dto.UpdatePlaceRequest;
import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.User;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlaceService {
    public PlaceResponse createPlace(CreatePlaceRequest createPlaceRequest, User user);
    public List<PlaceResponse> getOwnedPlaces(User user);
    public List<PlaceResponse> getAllPlaces();
    public PlaceResponse getPlaceById(UUID id);
    public PlaceResponse updatePlace(UpdatePlaceRequest updatePlaceRequest, User user);
    public void deletePlace(UUID id, User user);
}