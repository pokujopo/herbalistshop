import axios from "axios";

const adminApi = axios.create({
  baseURL: "https://adamherbalistapi-main-ihdtg6.free.laravel.cloud/api",
  headers: {
    Accept: "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;
