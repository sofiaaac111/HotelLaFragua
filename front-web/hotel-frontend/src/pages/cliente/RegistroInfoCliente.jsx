import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistroInfoCliente() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  const navigate = useNavigate();

  const guardarDatos = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("Token enviado:", token);

    if (!token) {
      alert("Sesión inválida. Inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8081/clientes/", // 👈 barra final importante
        {
          nombre,
          apellido,
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
          telefono
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Datos guardados correctamente");
      navigate("/perfil");

    } catch (error) {
      console.error("ERROR BACKEND:", error.response?.data || error);
      alert("Error al guardar datos");
    }
  };

  return (
    <div>
      <h2>Datos Personales</h2>

      <form onSubmit={guardarDatos}>
        <input placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Apellido" onChange={(e) => setApellido(e.target.value)} />
        <input placeholder="Tipo de documento" onChange={(e) => setTipoDocumento(e.target.value)} />
        <input placeholder="Número de documento" onChange={(e) => setNumeroDocumento(e.target.value)} />
        <input placeholder="Teléfono" onChange={(e) => setTelefono(e.target.value)} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default RegistroInfoCliente;