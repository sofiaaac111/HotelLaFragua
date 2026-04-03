// src/services/habitacionesService.js
import axios from "axios";

const API_URL = "http://localhost:8082/api/habitaciones"; // Cambia según tu backend

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHabitaciones = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const crearHabitacion = async (habitacion) => {
  const response = await axios.post(API_URL, habitacion, { headers: getAuthHeaders() });
  return response.data;
};

export const actualizarHabitacion = async (id, habitacion) => {
  const response = await axios.put(`${API_URL}/${id}`, habitacion, { headers: getAuthHeaders() });
  return response.data;
};

export const eliminarHabitacion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};