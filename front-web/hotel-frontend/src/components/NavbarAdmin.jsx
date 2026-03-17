import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function NavbarAdmin() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="logo" onClick={() => navigate("/admin")}>Admin</div>
      <ul className="nav-links">
        <li onClick={() => navigate("/admin")}>Dashboard</li>
        <li onClick={() => navigate("/admin/usuarios")}>Usuarios</li>
        <li onClick={() => navigate("/admin/habitaciones")}>Habitaciones</li>
        <li onClick={() => navigate("/admin/ofertas")}>Ofertas</li>
        <li onClick={() => navigate("/admin/reportes")}>Reportes</li>
      </ul>
      <div className="nav-buttons">
        <button className="btn-outline" onClick={() => navigate("/")}>Salir</button>
      </div>
    </nav>
  );
}

export default NavbarAdmin;