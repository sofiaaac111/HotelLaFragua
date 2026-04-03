// src/services/habitacionesService.js
import axios from "axios";

const API_URL = "http://localhost:8082/api/habitaciones"; // Cambia según tu backend

export const getHabitaciones = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearHabitacion = async (habitacion) => {
  const response = await axios.post(API_URL, habitacion);
  return response.data;
};

export const actualizarHabitacion = async (id, habitacion) => {
  const response = await axios.put(`${API_URL}/${id}`, habitacion);
  return response.data;
};

export const eliminarHabitacion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};