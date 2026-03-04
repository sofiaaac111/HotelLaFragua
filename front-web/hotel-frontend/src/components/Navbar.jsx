import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="logo">La Fragua</div>

      <ul className="nav-links">
        <li>Inicio</li>
        <li>Habitaciones</li>
        <li>Ofertas</li>
        <li>Gastronomía</li>
        <li>Contacto</li>
      </ul>

      <div className="nav-buttons">
        <button className="btn-outline" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </button>
        <button className="btn-gold" onClick={() => navigate("/register")}>
          Regístrate
        </button>
      </div>
    </nav>
  );
}

export default Navbar;