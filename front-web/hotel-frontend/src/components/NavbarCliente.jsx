import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/css/hotel-styles.css";

function NavbarCliente() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clienteData, setClienteData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si hay token y datos del cliente en localStorage
    const token = localStorage.getItem("token");
    const clienteDataStr = localStorage.getItem("clienteData");
    
    setIsAuthenticated(!!token);
    
    if (clienteDataStr) {
      try {
        const cliente = JSON.parse(clienteDataStr);
        setClienteData(cliente);
      } catch (error) {
        console.error("Error parsing cliente data:", error);
        setClienteData(null);
      }
    } else {
      setClienteData(null);
    }
  }, [location]); // Se actualiza cuando cambia la ruta

  const handleLogout = () => {
    // Limpiar todos los datos del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioCorreo");
    localStorage.removeItem("clienteData");
    
    setIsAuthenticated(false);
    setClienteData(null);
    navigate("/");
  };

  const getNombreCompleto = () => {
    if (!clienteData) return "";
    return `${clienteData.nombre || ""} ${clienteData.apellido || ""}`.trim();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{
        background:
          "linear-gradient(135deg, rgba(166, 124, 82, 0.95) 0%, rgba(139, 99, 68, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container">
        <button
          type="button"
          className="navbar-brand fw-bold btn btn-link p-0 text-white text-decoration-none"
          onClick={() => navigate("/")}
          style={{ border: "none" }}
        >
          <i className="bi bi-building me-2"></i>
          Hotel La Fragua
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCliente"
          aria-controls="navbarCliente"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCliente">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${isActive("/") ? "active" : ""}`}
                onClick={() => navigate("/")}
              >
                <i className="bi bi-house-door me-1"></i> Inicio
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${isActive("/habitaciones") ? "active" : ""}`}
                onClick={() => navigate("/habitaciones")}
              >
                <i className="bi bi-door-closed me-1"></i> Habitaciones
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${isActive("/reservas") ? "active" : ""}`}
                onClick={() => navigate("/reservas")}
              >
                <i className="bi bi-calendar-check me-1"></i> Reservas
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link ${isActive("/contacto") ? "active" : ""}`}
                onClick={() => navigate("/contacto")}
              >
                <i className="bi bi-telephone me-1"></i> Contacto
              </button>
            </li>

            {isAuthenticated && clienteData ? (
              <>
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate("/perfil")}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {getNombreCompleto() || "Usuario"}
                  </button>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCliente;