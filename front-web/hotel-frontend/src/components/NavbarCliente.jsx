import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function NavbarCliente() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <button className="btn-outline" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </button>
        <button className="btn-gold" onClick={() => navigate("/registro")}>
          Regístrate
        </button>
      </div>
    </nav>
  );
}

export default NavbarCliente;