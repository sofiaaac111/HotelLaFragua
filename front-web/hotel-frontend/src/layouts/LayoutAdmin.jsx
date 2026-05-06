import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import { createContext, useContext, useState, useEffect } from "react";

// Crear contexto para autenticación
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isAuthenticated: false
  });

  const updateAuthState = () => {
    // Sincronizar con localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    
    console.log("AuthProvider - Sincronizando con localStorage:");
    console.log("  - Token:", token ? token.substring(0, 20) + "..." : null);
    console.log("  - User:", user);
    
    setAuthState({
      token,
      user,
      isAuthenticated: !!(token && user)
    });
  };

  useEffect(() => {
    // Sincronizar al montar
    updateAuthState();
    
    // Escuchar cambios en localStorage
    const handleStorageChange = (e) => {
      console.log("AuthProvider - Cambio detectado en localStorage:", e);
      updateAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar eventos personalizados del LoginAdmin
    const handleLoginEvent = (e) => {
      console.log("AuthProvider - Evento de login detectado:", e.detail);
      if (e.detail && e.detail.token && e.detail.user) {
        setAuthState({
          token: e.detail.token,
          user: e.detail.user,
          isAuthenticated: true
        });
      }
    };
    
    window.addEventListener('localStorageUpdated', handleLoginEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleLoginEvent);
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };

function LayoutAdmin() {
  const location = useLocation();
  
  // Obtener token directamente desde localStorage
  const token = localStorage.getItem("token");
  
  console.log("LayoutAdmin - Inicializando componente");
  console.log("LayoutAdmin - Token desde localStorage:", !!token);
  
  // Rutas que requieren autenticación
  const protectedRoutes = ["/admin/usuarios", "/admin/habitaciones", "/admin/reservas", "/admin/ofertas", "/admin/reportes"];
  
  // Si no hay token y se intenta acceder a una ruta protegida, redirigir al login
  if (!token && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si hay token, verificar rol de administrador
  if (token && protectedRoutes.includes(location.pathname)) {
    try {
      // Decodificar el JWT para obtener información del usuario
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      console.log("LayoutAdmin - Token decodificado exitosamente");
      console.log("LayoutAdmin - Usuario desde token:", decodedPayload);
      
      // Verificar si el usuario tiene rol de administrador
      const roles = decodedPayload?.roles;
      const hasAdminRole = Array.isArray(roles) && roles.some((rol) => {
        if (typeof rol === "string") return rol === "Administrador";
        return rol?.nombre === "Administrador" || rol?.name === "Administrador";
      });
      console.log("LayoutAdmin - ¿Tiene rol de administrador?:", hasAdminRole);
      
      if (!hasAdminRole) {
        console.log("LayoutAdmin - Acceso denegado: no es administrador");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Acceso denegado. Solo los administradores pueden acceder al panel de administración.");
        return <Navigate to="/admin/login" replace />;
      }
      
      console.log("LayoutAdmin - ✅ Acceso permitido: usuario es administrador");
      
      return (
        <>
          <NavbarAdmin />
          <div style={{ paddingTop: "60px", paddingBottom: "40px", minHeight: "100vh" }}>
            <div style={{ 
              backgroundColor: "#d4edda", 
              border: "1px solid #c3e6cb", 
              borderRadius: "4px", 
              padding: "12px", 
              marginBottom: "20px",
              color: "#155724"
            }}>
              <strong>✅ ACCESO PERMITIDO</strong>
              <p>El acceso a administración está habilitado correctamente.</p>
              <p>Usuario: {decodedPayload?.correo || 'No disponible'}</p>
              <p>Rol: Administrador</p>
            </div>
            <Outlet />
          </div>
        </>
      );
      
    } catch (error) {
      console.error("LayoutAdmin - Error verificando token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/admin/login" replace />;
    }
  }

  return (
    <>
      <NavbarAdmin />
      <div style={{ paddingTop: "60px", paddingBottom: "40px", minHeight: "100vh" }}>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutAdmin;