package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface PlaceRepository extends JpaRepository<Place, UUID> {
    List<Place> findAllByOwnerId(UUID ownerId);

    UUID id(UUID id);
}