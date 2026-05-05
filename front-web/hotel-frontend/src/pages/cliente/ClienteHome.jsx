import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function ClienteHome() {
  return (
    <div className="cliente-home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a La Fragua</h1>
          <p>Disfruta tu estadía con el máximo confort y estilo</p>
          <Link to="/reservas" className="btn-gold">Reservar Ahora</Link>
        </div>
        <div className="hero-image">
          <img src="/assets/hotel-hero.jpg" alt="Hotel La Fragua" />
        </div>
      </section>
    </div>
  );
}

export default ClienteHome;