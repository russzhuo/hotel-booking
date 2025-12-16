import axios from "axios";
import { toast } from "react-toastify";
import { navigateToLogin } from "../event";
import { API_BASE_URL } from "../constants/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 3000,
  withCredentials: true,
});

const isBrowser = typeof window !== 'undefined';

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log('api.interceptors.request -> token: ', token);
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 504:
        case 404:
          isBrowser &&
            toast.error(
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
              "Server error"
            );
          break;
        case 401:
          if (isBrowser) {
            const NO_REDIRECT_PATHS = ['/register'];

            const currentPath = location.pathname;

            if (!NO_REDIRECT_PATHS.includes(currentPath)) {
              navigateToLogin();
            }

          }
          break;
        case 429:
          toast.error("Too many requests, please try again later");
          break;
        default:
          isBrowser &&
            toast.error(
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
              "unknown error!"
            );
      }
      return Promise.reject({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }

    return Promise.reject(err);
  }
);

export { api };
