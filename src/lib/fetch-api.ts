import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { getCookies } from "./cookie";

const fetchApi: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

fetchApi.interceptors.request.use(
  (config) => {
    const token = getCookies("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

fetchApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default fetchApi;
