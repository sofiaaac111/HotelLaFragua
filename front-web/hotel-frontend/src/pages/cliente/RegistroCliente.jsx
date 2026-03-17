import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistroCliente() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registrarUsuario = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Registrar usuario
      await axios.post("http://localhost:8086/auth/register", {
        correo,
        password,
        rol: "Cliente"
      });

      // 2️⃣ Login usando LOS CAMPOS CORRECTOS
      const response = await axios.post(
        "http://localhost:8086/auth/login",
        {
          correo: correo,
          password: password
        }
      );

      const token = response.data.access_token;

      if (!token) {
        alert("No se recibió token");
        return;
      }

      localStorage.setItem("token", token);

      navigate("/registro-info");

    } catch (error) {
      console.error("ERROR COMPLETO:", error.response?.data || error);
      alert("Error en el registro o login");
    }
  };

  return (
    <form onSubmit={registrarUsuario}>
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
}

export default RegistroCliente;