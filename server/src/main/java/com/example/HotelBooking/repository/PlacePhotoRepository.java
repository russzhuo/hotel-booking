package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.PlacePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface PlacePhotoRepository extends JpaRepository<PlacePhoto, UUID> {
    List<PlacePhoto> findAllByPlaceIdOrderBySortOrderAsc(UUID placeId);
}