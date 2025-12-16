package com.example.HotelBooking.service.impl;

import com.example.HotelBooking.dto.ApiResponse;
import com.example.HotelBooking.dto.CreatePlaceRequest;
import com.example.HotelBooking.dto.PlaceResponse;
import com.example.HotelBooking.dto.UpdatePlaceRequest;
import com.example.HotelBooking.entity.Place;
import com.example.HotelBooking.entity.PlacePerk;
import com.example.HotelBooking.entity.PlacePhoto;
import com.example.HotelBooking.entity.User;
import com.example.HotelBooking.exception.ResourceNotFoundException;
import com.example.HotelBooking.infrastructure.cache.PlaceRedisCache;
import com.example.HotelBooking.repository.PlacePerkRepository;
import com.example.HotelBooking.repository.PlacePhotoRepository;
import com.example.HotelBooking.repository.PlaceRepository;
import com.example.HotelBooking.service.PlacePhotoService;
import com.example.HotelBooking.service.PlaceService;
import com.example.HotelBooking.utils.UpdateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    private final PlacePhotoRepository placePhotoRepository;

    private final PlacePerkRepository placePerkRepository;

    private final PlaceRedisCache placeCache;

    @Override
    public PlaceResponse createPlace(CreatePlaceRequest createPlaceRequest, User user) {
        log.info(createPlaceRequest.toString());

        Place place = Place.builder()
                .owner(user)
                .checkIn(createPlaceRequest.checkIn())
                .checkOut(createPlaceRequest.checkOut())
                .price(createPlaceRequest.price())
                .title(createPlaceRequest.title())
                .description(createPlaceRequest.description())
                .extraInfo(createPlaceRequest.extraInfo())
                .maxGuests(createPlaceRequest.maxGuests())
                .address(createPlaceRequest.address())
                .photos(new ArrayList<>())
                .perks(new ArrayList<>())
                .build();

        // Persist the new place
        placeRepository.save(place);

        syncPhotos(place, createPlaceRequest.photoUrls());
        syncPerks(place, createPlaceRequest.perks());

        PlaceResponse resp = PlaceResponse.from(place);

        placeCache.putPlace(place.getId(), resp);
        placeCache.evictUserPlaces(user.getId());
        placeCache.evictAllPlaces();

        return resp;
    }

    @Override
    public List<PlaceResponse> getOwnedPlaces(User user) {
        List<PlaceResponse> cached = placeCache.getUserPlaces(user.getId());
        if (cached != null) {
            if (cached.isEmpty()) {
                log.info("User places CACHE HIT (empty list) – userId={}", user.getId());
            } else {
                log.info("User places CACHE HIT ({} items) – userId={}", cached.size(), user.getId());
            }

            return cached;
        }
        ;

        log.info("User places CACHE MISS – loading from DB – userId={}", user.getId());

        List<Place> placeEntities = placeRepository.findAllByOwnerId(user.getId());

        if (placeEntities != null && !placeEntities.isEmpty()) {
            List<PlaceResponse> respList = placeEntities.stream()
                    .map((place) -> PlaceResponse.from(place))
                    .toList();

            placeCache.putUserPlaces(user.getId(), respList);
            return respList;
        }

        return null;
    }

    @Override
    public List<PlaceResponse> getAllPlaces() {
        List<PlaceResponse> cached = placeCache.getAllPlaces();
        if (cached != null) {
            if (cached.isEmpty()) {
                log.info("All places CACHE HIT (empty list)");
            } else {
                log.info("All places CACHE HIT ({} items)", cached.size());
            }

            return cached;
        }

        log.info("All places CACHE MISS – loading from DB");

        List<Place> placeEntities = placeRepository.findAll();

        if (placeEntities != null && !placeEntities.isEmpty()) {
            return placeEntities.stream().map((place) -> PlaceResponse.from(place)).toList();
        }

        return null;
    }

    @Override
    public PlaceResponse getPlaceById(UUID id) {
        PlaceResponse cached = placeCache.getPlace(id);
        if (cached != null) {
            log.info("Place CACHE HIT – placeId={}", id);
            return cached;
        }

        log.info("Place CACHE MISS – placeId={}", id);

        Place place = placeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Place not found with id" + id));

        PlaceResponse resp = PlaceResponse.from(place);

        placeCache.putPlace(id, resp);
        return resp;
    }

    @Override
    public PlaceResponse updatePlace(UpdatePlaceRequest updatePlaceRequest, User user) {
        Place place = placeRepository.findById(updatePlaceRequest.id()).orElseThrow(() -> new ResourceNotFoundException("Place not found with id" + updatePlaceRequest.id()));

        if (!place.getOwner().getId().equals(user.getId())) {
            log.warn("Access denied: user {} tried to update place {}", user.getId(), place.getId());
            throw new AccessDeniedException("You are not allowed to update this place");
        }

        UpdateUtils.updateIfPresent(updatePlaceRequest.title(), place::setTitle);
        UpdateUtils.updateIfPresent(updatePlaceRequest.extraInfo(), place::setExtraInfo);
        UpdateUtils.updateIfPresent(updatePlaceRequest.address(), place::setAddress);
        UpdateUtils.updateIfPresent(updatePlaceRequest.description(), place::setDescription);
        UpdateUtils.updateIfPresent(updatePlaceRequest.checkIn(), place::setCheckIn);
        UpdateUtils.updateIfPresent(updatePlaceRequest.checkOut(), place::setCheckOut);
        UpdateUtils.updateIfPresent(updatePlaceRequest.maxGuests(), place::setMaxGuests);
        UpdateUtils.updateIfPresent(updatePlaceRequest.price(), place::setPrice);

        syncPhotos(place, updatePlaceRequest.photoUrls());
        syncPerks(place, updatePlaceRequest.perks());

        PlaceResponse resp = PlaceResponse.from(place);

        placeCache.putPlace(place.getId(), resp);
        placeCache.evictUserPlaces(user.getId());
        placeCache.evictAllPlaces();

        log.info("Place updated and caches refreshed – placeId={}, userId={}", place.getId(), user.getId());

        return resp;
    }

    @Override
    public void deletePlace(UUID id, User user) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found with id" + id));

        if (!place.getOwner().getId().equals(user.getId())) {
            log.warn("Access denied: user {} tried to delete booking {} owned by {}",
                    user.getId(), id, place.getOwner().getId());
            throw new AccessDeniedException("You can only delete your own bookings");
        }

        placeRepository.delete(place);

        placeCache.evictPlace(id);
        placeCache.evictUserPlaces(user.getId());
        placeCache.evictAllPlaces();
    }

    private void syncPhotos(Place place, List<String> photoUrls) {
        if (photoUrls == null || photoUrls.isEmpty()) {
            place.getPhotos().clear();
            return;
        }

        Set<String> incoming = photoUrls.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        // Remove photos that are no longer present
        place.getPhotos().removeIf(existing -> !incoming.contains(existing.getUrl()));

        incoming.stream()
                .filter(newPhotoUrl -> place.getPhotos().stream()
                        .noneMatch(existing -> existing.getUrl().equals(newPhotoUrl)))
                .map(newPhotoUrl -> PlacePhoto.builder()
                        .place(place)
                        .url(newPhotoUrl)
                        .build())
                .forEach(place.getPhotos()::add);

        List<PlacePhoto> placePhotos = place.getPhotos();

        // Update sort order
        for (PlacePhoto photo : placePhotos) {
            String url = photo.getUrl();
            int sortOrder = photoUrls.indexOf(url);
            if (sortOrder != -1) {
                photo.setSortOrder(sortOrder);
            }
        }
    }

    private void syncPerks(Place place, List<String> perks) {
        if (perks == null || perks.isEmpty()) {
            place.getPerks().clear();
            return;
        }

        log.info("Perks: {}", perks);
        // Normalise input and removes duplicates from request
        Set<String> incoming = perks.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        // Remove perks that are no longer present
        place.getPerks().removeIf(existing -> !incoming.contains(existing.getPerk()));

        // Add only the ones that are really new
        incoming.stream()
                .filter(newPerk -> place.getPerks().stream()
                        .noneMatch(existing -> existing.getPerk().equals(newPerk)))
                .map(newPerk -> PlacePerk.builder()
                        .place(place)
                        .perk(newPerk)
                        .build())
                .forEach(place.getPerks()::add);
    }
}
