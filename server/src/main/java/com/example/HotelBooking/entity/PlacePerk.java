package com.example.HotelBooking.entity;

import jakarta.persistence.*;

import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.util.UUID;

@Entity
@Table(name = "place_perks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"place_id", "perk"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlacePerk {

    @Id
    @GeneratedValue
    @JdbcTypeCode(Types.VARCHAR)
    @Column(name ="id", unique = true, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(nullable = false, length = 100)
    private String perk; // e.g., "WiFi", "Pool", "Free parking"
}