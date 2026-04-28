import axios from "axios";

// API genérica con autenticación automática
const api = axios.create({
  baseURL: "http://localhost:8086", // auth-service por defecto
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Función para crear APIs específicas
export const createApi = (baseURL) => {
  const specificApi = axios.create({
    baseURL: baseURL,
  });

  specificApi.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return specificApi;
};

export default api;
