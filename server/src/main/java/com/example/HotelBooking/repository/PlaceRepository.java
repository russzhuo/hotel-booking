package com.example.HotelBooking.repository;

import com.example.HotelBooking.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

public interface PlaceRepository extends JpaRepository<Place, UUID> {
    List<Place> findAllByOwnerId(UUID ownerId);

    UUID id(UUID id);

    @Query("""
        SELECT p FROM Place p
        WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :pattern, '%'))
           OR LOWER(p.address) LIKE LOWER(CONCAT('%', :pattern, '%'))
           OR LOWER(p.city) LIKE LOWER(CONCAT('%', :pattern, '%'))
           OR LOWER(p.country) LIKE LOWER(CONCAT('%', :pattern, '%'))
           OR LOWER(p.description) LIKE LOWER(CONCAT('%', :pattern, '%'))
        """)
    List<Place> searchLike(@Param("pattern") String pattern);
}