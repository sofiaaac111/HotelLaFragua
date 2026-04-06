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
  try {
    console.log("🔍 Intentando obtener usuarios...");
    const token = localStorage.getItem("token");
    
    if (token) {
      console.log("🔑 Usando token para obtener usuarios");
      const response = await usuariosApi.get(`/users?token=${token}`);
      console.log("✅ Usuarios obtenidos:", response.data);
      return response.data;
    } else {
      console.log("⚠️ No hay token, intentando sin autenticación");
      const response = await usuariosApi.get("/users");
      console.log("✅ Usuarios obtenidos sin token:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    
    // Si el error es de autenticación, devolver array vacío para no romper la UI
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      console.log("🔒 Error de autenticación, devolviendo array vacío");
      return [];
    }
    
    // Para otros errores, también devolver array vacío
    console.log("📊 Devolviendo array vacío por error genérico");
    return [];
  }
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
  try {
    console.log("🔍 Intentando obtener roles...");
    const token = localStorage.getItem("token");
    
    if (token) {
      console.log("🔑 Usando token para obtener roles");
      const response = await usuariosApi.get(`/roles?token=${token}`);
      console.log("✅ Roles obtenidos con token:", response.data);
      return response.data;
    } else {
      console.log("⚠️ No hay token, intentando sin autenticación");
      const response = await usuariosApi.get("/roles");
      console.log("✅ Roles obtenidos sin token:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("❌ Error obteniendo roles:", error);
    
    // Si el error es de autenticación, devolver array vacío
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      console.log("🔒 Error de autenticación, devolviendo array vacío");
      return [];
    }
    
    // Para otros errores, también devolver array vacío
    console.log("📊 Devolviendo array vacío por error genérico");
    return [];
  }
};
