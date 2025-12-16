import { api } from "../services/http-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const authService = {
  register: (data) =>
    api.post("/auth/register", data),

  login: (data) =>
    api.post("/auth/login", data),
};

const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.register(data).then((resp) => {
      console.log('resp.data: ', resp.data);
      return resp.data;
    }),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: (resp) => {
      console.log(resp);
      navigate("/login");
    },
  });
};

export { useRegister };
