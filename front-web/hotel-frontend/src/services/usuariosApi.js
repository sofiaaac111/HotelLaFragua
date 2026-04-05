import axios from "axios";

const usuariosApi = axios.create({
  baseURL: "http://localhost:8086/auth",
});

usuariosApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usuarios
export const getUsuarios = async () => {
  const response = await usuariosApi.get("/users");
  return response.data;
};

export const getUsuarioById = async (id) => {
  const response = await usuariosApi.get(`/users/${id}`);
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await usuariosApi.post("/register", usuario);
  return response.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await usuariosApi.put(`/users/${id}`, usuario);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  const response = await usuariosApi.delete(`/users/${id}`);
  return response.data;
};

export const getRoles = async () => {
  const response = await usuariosApi.get("/roles");
  return response.data;
};
