// src/pages/admin/Habitaciones.jsx
import { useEffect, useState } from "react";
import {
  getHabitaciones,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
} from "../../services/habitacionesService";

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    precio: "",
    estado: "",
    descripcion: "",
  });

  const cargarHabitaciones = async () => {
    const data = await getHabitaciones();
    setHabitaciones(data);
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await actualizarHabitacion(editing.id, form);
      setEditing(null);
    } else {
      await crearHabitacion(form);
    }
    setForm({ nombre: "", tipo: "", precio: "", estado: "", descripcion: "" });
    cargarHabitaciones();
  };

  const handleEditar = (habitacion) => {
    setEditing(habitacion);
    setForm({
      nombre: habitacion.nombre,
      tipo: habitacion.tipo,
      precio: habitacion.precio,
      estado: habitacion.estado,
      descripcion: habitacion.descripcion,
    });
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que quieres eliminar esta habitación?")) {
      await eliminarHabitacion(id);
      cargarHabitaciones();
    }
  };

  return (
    <div>
      <h1>CRUD Habitaciones</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="tipo"
          placeholder="Tipo"
          value={form.tipo}
          onChange={handleChange}
          required
        />
        <input
          name="precio"
          placeholder="Precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleChange}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
        <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
        {editing && <button type="button" onClick={() => setEditing(null)}>Cancelar</button>}
      </form>

      {/* Tabla de habitaciones */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.nombre}</td>
              <td>{h.tipo}</td>
              <td>{h.precio}</td>
              <td>{h.estado}</td>
              <td>{h.descripcion}</td>
              <td>
                <button onClick={() => handleEditar(h)}>Editar</button>
                <button onClick={() => handleEliminar(h.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Habitaciones;