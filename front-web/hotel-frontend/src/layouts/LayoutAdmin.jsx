import { Outlet, Navigate, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function LayoutAdmin() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Rutas que requieren autenticación
  const protectedRoutes = ["/admin/usuarios", "/admin/habitaciones", "/admin/ofertas", "/admin/reportes"];
  
  // Si no hay token y se intenta acceder a una ruta protegida, redirigir al login de admin
  if (!token && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/admin/login" replace />;
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