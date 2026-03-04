import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Descubre La Fragua</h1>
          <p>
            Un refugio urbano donde el encanto histórico se fusiona con el
            diseño contemporáneo.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-gold"
              onClick={() => navigate("/registro")}
            >
              Reservar ahora
            </button>

            <button
              className="btn-black"
              onClick={() => navigate("/")}
            >
              Ver habitaciones
            </button>
          </div>
        </div>
      </section>

      <section className="content">
        <h2>Bienvenido al Hotel La Fragua</h2>
        <p>Contenido adicional para probar scroll...</p>
        <div style={{ height: "1200px" }}></div>
      </section>
    </div>
  );
}

export default Home;