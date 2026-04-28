import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AUTH_API_BASE_URL } from "../../services/config.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${AUTH_API_BASE_URL}/login`, {
        correo,
        contraseña: password
      });

      const token = response.data.access_token;
      
      if (!token) {
        alert("Error en el login. Intenta nuevamente.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioCorreo", correo); // Guardar el correo para usarlo en el perfil
      
      alert("¡Sesión iniciada correctamente!");
      navigate("/perfil");

    } catch (error) {
      console.error("Error en login:", error);
      alert(error.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row w-100">
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              {/* Logo/Title */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-building display-4 text-primary"></i>
                </div>
                <h2 className="fw-bold mb-1">Hotel La Fragua</h2>
                <p className="text-muted">Bienvenido de nuevo</p>
              </div>

              <form onSubmit={iniciarSesion}>
                {/* CORREO */}
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label fw-semibold">
                    Correo electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      placeholder="tu@email.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* BOTÓN */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Ingresar
                    </>
                  )}
                </button>

                {/* LINK REGISTRO */}
                <div className="text-center">
                  <span className="text-muted">¿No tienes cuenta? </span>
                  <a href="/registro" className="text-primary text-decoration-none fw-semibold">
                    Registrarse
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
