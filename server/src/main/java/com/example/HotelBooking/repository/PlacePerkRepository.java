package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.PlacePerk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

public interface PlacePerkRepository extends JpaRepository<PlacePerk, UUID> {
}