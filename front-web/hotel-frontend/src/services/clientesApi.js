import axios from "axios";
import { CLIENTES_SERVICE_URL } from "./config.js";

const clientesApi = axios.create({
  baseURL: CLIENTES_SERVICE_URL,
});

clientesApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clientes
export const getClientes = async () => {
  const response = await clientesApi.get("/clientes/");
  return response.data;
};

export const getClienteById = async (id) => {
  const response = await clientesApi.get(`/clientes/${id}`);
  return response.data;
};

export const getClientePorDocumento = async (numero_documento) => {
  const response = await clientesApi.get(`/clientes/documento/${numero_documento}`);
  return response.data;
};

export const crearCliente = async (cliente) => {
  const response = await clientesApi.post("/clientes/", cliente);
  return response.data;
};

export const actualizarCliente = async (id, cliente) => {
  const response = await clientesApi.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const eliminarCliente = async (id) => {
  const response = await clientesApi.delete(`/clientes/${id}`);
  return response.data;
};
