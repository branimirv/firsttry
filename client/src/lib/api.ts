import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "./storage";

const API_CONFIG = {
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const createApiClient = (): AxiosInstance => {
  const api = axios.create(API_CONFIG);

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.get();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenStorage.remove();
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiClient();

export default api;
