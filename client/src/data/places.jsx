import { useCallback } from "react";
import { api } from "../services/http-client";
import { useQuery } from "@tanstack/react-query";

const fetchUserPlaces = async () => {
  const response = await api.get("/places/user-places");

  if (!response.data?.success) {
    throw new Error(response.data.message || "Failed to fetch user places");
  }

  return response.data.data;
};

const fetchPlaces = async () => {
  const response = await api.get("/places");

  if (!response.data?.success) {
    throw new Error(response.data.message || "Failed to fetch places");
  }

  return response.data.data;
};

const fetchPlaceDetails = async (placeId) => {
  const response = await api.get(`/places/${placeId}`);

  if (!response.data?.success) {
    throw new Error(response.data.message || `Failed to place (id=${placeId})`);
  }

  console.log('response.data: ', response.data);
  return response.data.data;
};

export const createPlace = async (data) => {
  return await api.post(`/places`, data);
};

export const updatePlace = async (data) => {
  return await api.put(`/places`, data);
};

export const usePlaces = () => {
  return useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
  });
};

export const useUserPlaces = (currentUserId) => {
  return useQuery({
    queryKey: [`user-places-${currentUserId}`],
    queryFn: () => currentUserId ? fetchUserPlaces() : null,
  });
};

export const usePlaceDetails = (placeId) => {
  const queryResults = useQuery({
    queryKey: [`place-details${placeId ? "-" + placeId : ""}`],
    queryFn: () => (placeId ? fetchPlaceDetails(placeId) : null),
  });

  const update = useCallback(async (data = {}) => {
    return updatePlace({id: placeId, ...data});
  }, [placeId]);

  return {
    ...queryResults,
    update
  }
};

