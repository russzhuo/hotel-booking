import { api } from "../services/http-client";
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const response = await api.get("/user/profile");

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user profile");
  }

  return response.data.data;
};


export const useUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: fetchUserProfile,
    });
}
