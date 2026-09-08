import axios from "axios";

const adminApi = axios.create({
  baseURL: "https://herbalistshop-api-production.up.railway.app/api",
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
