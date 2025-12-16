package com.example.HotelBooking.controller;

import com.example.HotelBooking.dto.*;
import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.service.PlaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

//router.post('/places',postPlace)
//router.get('/places',getPlaces)
//router.get('/user-places',getUserPlaces)
//router.get('/places/:id',getPlacesById)
//router.put('/places',putPlace)

@RestController
@RequestMapping("api/places")
@RequiredArgsConstructor
@Slf4j
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<ApiResponse<PlaceResponse>> createPlace(@Valid @RequestBody CreatePlaceRequest createPlaceRequest, @AuthenticationPrincipal User user) {
        log.info("User {} is creating a new place", user.getUsername());

        PlaceResponse placeResponse = placeService.createPlace(createPlaceRequest, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(placeResponse, "Place created successfully"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<PlaceResponse>> updatePlace(@Valid @RequestBody UpdatePlaceRequest updatePlaceRequest, @AuthenticationPrincipal User user) {
        log.info("User {} is creating a new place", user.getUsername());

        PlaceResponse placeResponse = placeService.updatePlace(updatePlaceRequest, user);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(placeResponse, "Place updated successfully"));
    }

    @GetMapping("/user-places")
    public ResponseEntity<ApiResponse<List<PlaceResponse>>> getOwnedPlaces(@AuthenticationPrincipal User user) {
        log.info("Fetching place owned by user with ID: {}", user.getId());

        List<PlaceResponse> placeResponseList = placeService.getOwnedPlaces(user);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(placeResponseList, "Places retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlaceResponse>>> getAllPlaces() {
        log.info("Fetching all available places");

        List<PlaceResponse> placeResponseList = placeService.getAllPlaces();

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(placeResponseList, "Places retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaceResponse>> getPlaceById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        log.info("Fetching place with ID: {}", id);

        PlaceResponse placeResponse = placeService.getPlaceById(id);

        return ResponseEntity.ok(ApiResponse.success(placeResponse, "Place retrieved successfully"));
    }
}
