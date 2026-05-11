import axios from "axios";
import { EMPLEADOS_SERVICE_URL } from "./config.js";

const empleadosApi = axios.create({
  baseURL: EMPLEADOS_SERVICE_URL,
});

empleadosApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Empleados
export const getEmpleados = async () => {
  const response = await empleadosApi.get("/empleados/");
  return response.data;
};

export const getEmpleado = async (id) => {
  const response = await empleadosApi.get(`/empleados/${id}`);
  return response.data;
};

export const crearEmpleado = async (empleadoData) => {
  const response = await empleadosApi.post("/empleados/", empleadoData);
  return response.data;
};

export const actualizarEmpleado = async (id, empleadoData) => {
  const response = await empleadosApi.put(`/empleados/${id}`, empleadoData);
  return response.data;
};

export const eliminarEmpleado = async (id) => {
  const response = await empleadosApi.delete(`/empleados/${id}`);
  return response.data;
};
