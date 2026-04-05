import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function NavbarCliente() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]); // Se actualiza cuando cambia la ruta

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioCorreo");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="logo" onClick={() => navigate("/")}>La Fragua</div>
      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Inicio</li>
        <li onClick={() => navigate("/habitaciones")}>Habitaciones</li>
        <li onClick={() => navigate("/ofertas")}>Ofertas</li>
        <li onClick={() => navigate("/gastronomia")}>Gastronomía</li>
        <li onClick={() => navigate("/contacto")}>Contacto</li>
      </ul>
      <div className="nav-buttons">
        {isAuthenticated ? (
          <>
            <button className="btn-outline" onClick={() => navigate("/perfil")}>
              <i className="bi bi-person-circle me-2"></i>
              Perfil
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>
            <button className="btn-gold" onClick={() => navigate("/registro")}>
              <i className="bi bi-person-plus me-2"></i>
              Regístrate
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavbarCliente;