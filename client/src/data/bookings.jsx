import { useCallback } from "react";
import { api } from "../services/http-client";
import { useQuery } from "@tanstack/react-query";

const fetchUserBookings = async () => {
  const response = await api.get("/bookings/user-bookings");

  if (!response.data?.success) {
    throw new Error(response.data.message || "Failed to fetch user bookings");
  }

  return response.data.data;
};

const fetchBookingDetails = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);

  if (!response.data?.success) {
    throw new Error(response.data.message || `Failed to booking (id=${bookingId})`);
  }

  console.log('response.data: ', response.data);
  return response.data.data;
};

export const createBooking = async (data) => {
  return await api.post(`/bookings`, data);
};

export const updateBooking = async (data) => {
  return await api.put(`/bookings`, data);
};

export const deleteBooking = async (bookingId) => {
  return await api.delete(`/bookings/${bookingId}`);
};

export const useUserBookings = (currentUserId) => {
  return useQuery({
    queryKey: [`user-bookings-${currentUserId}`],
    queryFn: () => currentUserId ? fetchUserBookings() : null,
  });
};

export const useBookingDetails = (bookingId) => {
  const queryResults = useQuery({
    queryKey: [`booking-details${bookingId ? "-" + bookingId : ""}`],
    queryFn: () => (bookingId ? fetchBookingDetails(bookingId) : null),
  });

  const update = useCallback(async (data = {}) => {
    return updateBooking({id: bookingId, ...data});
  }, [bookingId]);

  const cancel = useCallback(async () => {
    return deleteBooking(bookingId);
  }, [bookingId]);

  return {
    ...queryResults,
    update,
    cancel
  }
};

