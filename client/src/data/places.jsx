import { useCallback, useEffect } from "react";
import { api } from "../services/http-client";
import { useQuery } from "@tanstack/react-query";
import { event, EVENTS } from "../event";
import { useSearchParams } from "react-router-dom";

const fetchUserPlaces = async () => {
  const response = await api.get("/places/user-places");

  if (!response.data?.success) {
    throw new Error(response.data.message || "Failed to fetch user places");
  }

  return response.data.data;
};

const fetchPlaces = async (params = {}) => {
  const response = await api.get("/places", {
    params
  });

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

export const searchPlaces = async (data) => {
  return await api.get(`/places/search`, {
    params: data
  });
}

export const usePlaces = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return useQuery({
    queryKey: ["places", query],
    queryFn: () => fetchPlaces({ query }),
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

  useEffect(() => {
    const handler = () => {
      queryResults?.refetch();
    };

    const evtType = EVENTS.REFRESH_PLACE_DETAIL;

    event.on(evtType, handler);

    return () => {
      event.off(evtType, handler);
    };
  }, [queryResults]);

  const update = useCallback(async (data = {}) => {
    return updatePlace({ id: placeId, ...data });
  }, [placeId]);

  return {
    ...queryResults,
    update,
  }
};

