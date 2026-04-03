import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8086/auth/login", {
        correo,
        contraseña: password
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      navigate("/perfil");

    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container mt-5">

      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        <form onSubmit={iniciarSesion}>

          {/* CORREO */}
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN */}
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>

        </form>

        <p className="mt-3 text-center">
          ¿No tienes cuenta? <a href="/registro">Registrarse</a>
        </p>

      </div>
    </div>
  );
  
}
export default Login;
