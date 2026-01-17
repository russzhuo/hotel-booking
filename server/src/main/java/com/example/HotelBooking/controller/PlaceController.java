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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;


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
    public ResponseEntity<ApiResponse<List<PlaceResponse>>> getPlaces(@RequestParam(required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            List<PlaceResponse> placeResponseList = placeService.getAllPlaces();
            return ResponseEntity.ok(ApiResponse.success(placeResponseList, "Query is not provided; returning all places"));
        }

        List<PlaceResponse> placeResponseList = placeService.searchPlaces(query.trim());

        if (placeResponseList.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(Collections.emptyList(), "No places found"));
        }

        return ResponseEntity.ok(ApiResponse.success(placeResponseList, "Places found for query: " + query));
    }

//    @GetMapping
//    public ResponseEntity<ApiResponse<List<PlaceResponse>>> getAllPlaces() {
//        log.info("Fetching all available places");
//
//        List<PlaceResponse> placeResponseList = placeService.getAllPlaces();
//
//        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(placeResponseList, "Places retrieved successfully"));
//    }

//    @GetMapping("/search")
//    public ResponseEntity<ApiResponse<List<PlaceResponse>>> searchPlaces(
//            @RequestParam(required = false) String query
//    ) {
//        if (query == null || query.trim().isEmpty()) {
//            return ResponseEntity.badRequest()
//                    .body(ApiResponse.error("Query parameter is required"));
//        }
//
//        List<PlaceResponse> placeResponseList = placeService.searchPlaces(query.trim());
//
//        if (placeResponseList.isEmpty()) {
//            return ResponseEntity.ok(ApiResponse.success(Collections.emptyList(), "No places found"));
//        }
//
//        return ResponseEntity.ok(ApiResponse.success(placeResponseList, "Places found for query: " + query));
//    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaceDetailResponse>> getPlaceById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        log.info("Fetching place with ID: {}", id);

        PlaceResponse placeResponse = placeService.getPlaceById(id);
        List<LocalDate> blockedDates = placeService.getPlaceBlockedDates(id);

        PlaceDetailResponse placeDetailResponse = new PlaceDetailResponse(placeResponse, blockedDates);

        return ResponseEntity.ok(ApiResponse.success(placeDetailResponse, "Place retrieved successfully"));
    }
}
