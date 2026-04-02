// src/pages/admin/Habitaciones.jsx
import { useEffect, useState } from "react";
import {
  getHabitaciones,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
} from "../../services/habitacionesService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../assets/css/hotel-styles.css";

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    numero_habitacion: "",
    tipo_habitacion: "",
    descripcion: "",
    ocupacion: "",
    numero_camas: "",
    precio_base: "",
    estado: "Libre",
    comodidades: [],
  });

  const cargarHabitaciones = async () => {
    try {
      const data = await getHabitaciones();
      setHabitaciones(data);
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert price to number format (remove both dots and commas, then convert to number)
    if (name === "precio_base") {
      // Allow both dots and commas for thousands separator
      const cleanValue = value.replace(/[.,]/g, "");
      setForm({ ...form, [name]: cleanValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert all numeric fields before sending
      const formData = {
        ...form,
        precio_base: parseFloat(form.precio_base) || 0,
        ocupacion: parseInt(form.ocupacion) || 0,
        numero_camas: parseInt(form.numero_camas) || 0,
        numero_habitacion: parseInt(form.numero_habitacion) || 0,
      };
      
      console.log('Enviando datos:', formData); // Debug log
      
      if (editing) {
        console.log('Actualizando habitación:', editing.numero_habitacion);
        const response = await actualizarHabitacion(editing.numero_habitacion, formData);
        console.log('Respuesta actualización:', response);
        setEditing(null);
      } else {
        console.log('Creando nueva habitación');
        const response = await crearHabitacion(formData);
        console.log('Respuesta creación:', response);
      }
      
      resetForm();
      await cargarHabitaciones();
      setShowForm(false);
      
    } catch (error) {
      console.error("Error guardando habitación:", error);
      console.error("Detalles del error:", error.response?.data || error.message);
      
      // Mostrar error más específico
      let errorMessage = "Error al guardar la habitación. ";
      if (error.response?.status === 404) {
        errorMessage += "El endpoint del servidor no se encontró. Verifica que el backend esté corriendo en el puerto 8083.";
      } else if (error.response?.status === 400) {
        errorMessage += "Datos inválidos: " + (error.response.data?.message || "Verifica los campos del formulario.");
      } else if (error.response?.status === 500) {
        errorMessage += "Error del servidor. Verifica la consola del backend.";
      } else if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        errorMessage += "No se puede conectar al servidor. Asegúrate que el backend esté corriendo.";
      } else {
        errorMessage += "Verifica la consola para más detalles.";
      }
      
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setForm({
      numero_habitacion: "",
      tipo_habitacion: "",
      descripcion: "",
      ocupacion: "",
      numero_camas: "",
      precio_base: "",
      estado: "Libre",
      comodidades: [],
    });
  };

  const handleEditar = (habitacion) => {
    setEditing(habitacion);
    setForm({
      numero_habitacion: habitacion.numero_habitacion.toString(),
      tipo_habitacion: habitacion.tipo_habitacion,
      descripcion: habitacion.descripcion || "",
      ocupacion: habitacion.ocupacion.toString(),
      numero_camas: habitacion.numero_camas.toString(),
      precio_base: habitacion.precio_base.toString(),
      estado: habitacion.estado,
      comodidades: habitacion.comodidades || [],
    });
    setShowForm(true);
  };

  const handleEliminar = async (numero_habitacion) => {
    if (window.confirm("¿Seguro que quieres eliminar esta habitación?")) {
      try {
        await eliminarHabitacion(numero_habitacion);
        cargarHabitaciones();
      } catch (error) {
        console.error("Error eliminando habitación:", error);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      Libre: "success",
      Ocupada: "danger",
      Limpieza: "warning",
      Mantenimiento: "secondary",
    };
    return estados[estado] || "primary";
  };

  const getTipoIcon = (tipo) => {
    const iconos = {
      Individual: "🛏️",
      Doble: "🛏️🛏️",
      Familiar: "👨‍👩‍👧‍👦",
      Suite: "👑",
    };
    return iconos[tipo] || "🏠";
  };

  const getComodidadIcon = (comodidadId) => {
    const comodidades = {
      cama_king: "🛏️",
      escritorio: "🪑",
      aire_acondicionado: "❄️",
      tv_lcd: "📺",
      amenities: "🧴",
      cocina: "🍳",
      wifi: "📶",
      jacuzzi: "🛁",
      balcon: "🌅",
      minibar: "🍷",
      caja_fuerte: "🔐",
      servicio_habitacion: "🛎️",
    };
    return comodidades[comodidadId] || "📦";
  };

  const getComodidadLabel = (comodidadId) => {
    const labels = {
      cama_king: "Cama King",
      escritorio: "Escritorio",
      aire_acondicionado: "Aire Acondicionado",
      tv_lcd: "TV LCD",
      amenities: "Amenities",
      cocina: "Cocina",
      wifi: "WiFi",
      jacuzzi: "Jacuzzi",
      balcon: "Balcón",
      minibar: "Minibar",
      caja_fuerte: "Caja Fuerte",
      servicio_habitacion: "Servicio Habitación",
    };
    return labels[comodidadId] || comodidadId;
  };

  const handleComodidadToggle = (comodidadId) => {
    const comodidades = [...form.comodidades];
    const index = comodidades.indexOf(comodidadId);
    if (index !== -1) {
      comodidades.splice(index, 1);
    } else {
      comodidades.push(comodidadId);
    }
    setForm({ ...form, comodidades });
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2">Gestión de Habitaciones</h2>
              <p className="text-muted mb-0">Administra las habitaciones del hotel</p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                resetForm();
                setEditing(null);
                setShowForm(true);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Habitación
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Libres</h5>
              <h3 className="card-text">
                {habitaciones.filter(h => h.estado === "Libre").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Ocupadas</h5>
              <h3 className="card-text">
                {habitaciones.filter(h => h.estado === "Ocupada").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Limpieza</h5>
              <h3 className="card-text">
                {habitaciones.filter(h => h.estado === "Limpieza").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h5 className="card-title">Mantenimiento</h5>
              <h3 className="card-text">
                {habitaciones.filter(h => h.estado === "Mantenimiento").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Editar Habitación" : "Nueva Habitación"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Número de Habitación</label>
                      <input
                        type="number"
                        className="form-control"
                        name="numero_habitacion"
                        value={form.numero_habitacion}
                        onChange={handleChange}
                        required
                        disabled={editing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Habitación</label>
                      <select
                        className="form-select"
                        name="tipo_habitacion"
                        value={form.tipo_habitacion}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Individual">Individual</option>
                        <option value="Doble">Doble</option>
                        <option value="Familiar">Familiar</option>
                        <option value="Suite">Suite</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Ocupación</label>
                      <input
                        type="number"
                        className="form-control"
                        name="ocupacion"
                        value={form.ocupacion}
                        onChange={handleChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Número de Camas</label>
                      <input
                        type="number"
                        className="form-control"
                        name="numero_camas"
                        value={form.numero_camas}
                        onChange={handleChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Precio Base</label>
                      <input
                        type="text"
                        className="form-control"
                        name="precio_base"
                        value={form.precio_base}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="Ej: 80000, 80.000 o 80,000"
                      />
                      <small className="text-muted">Puedes usar puntos o comas para separar miles (ej: 80.000 = 80,000 = 80000)</small>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                      >
                        <option value="Libre">Libre</option>
                        <option value="Ocupada">Ocupada</option>
                        <option value="Limpieza">Limpieza</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Descripción de la habitación..."
                    />
                  </div>
                  
                  {/* Comodidades */}
                  <div className="mb-4">
                    <label className="form-label">Comodidades</label>
                    <div className="row g-2">
                      {[
                        { id: 'cama_king', icon: '🛏️', label: 'Cama King' },
                        { id: 'escritorio', icon: '🪑', label: 'Escritorio' },
                        { id: 'aire_acondicionado', icon: '❄️', label: 'Aire Acondicionado' },
                        { id: 'tv_lcd', icon: '📺', label: 'TV LCD' },
                        { id: 'amenities', icon: '🧴', label: 'Amenities' },
                        { id: 'cocina', icon: '🍳', label: 'Cocina' },
                        { id: 'wifi', icon: '📶', label: 'WiFi' },
                        { id: 'jacuzzi', icon: '🛁', label: 'Jacuzzi' },
                        { id: 'balcon', icon: '🌅', label: 'Balcón' },
                        { id: 'minibar', icon: '🍷', label: 'Minibar' },
                        { id: 'caja_fuerte', icon: '🔐', label: 'Caja Fuerte' },
                        { id: 'servicio_habitacion', icon: '🛎️', label: 'Servicio Habitación' }
                      ].map(comodidad => (
                        <div key={comodidad.id} className="col-md-3 col-sm-4 col-6">
                          <div 
                            className={`comodidad-item ${form.comodidades.includes(comodidad.id) ? 'selected' : ''}`}
                            onClick={() => handleComodidadToggle(comodidad.id)}
                          >
                            <div className="comodidad-icon">{comodidad.icon}</div>
                            <div className="comodidad-label">{comodidad.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editing ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de habitaciones */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Lista de Habitaciones</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Ocupación</th>
                  <th>Camas</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Comodidades</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {habitaciones.map((habitacion) => (
                  <tr key={habitacion.numero_habitacion}>
                    <td>
                      <strong>{habitacion.numero_habitacion}</strong>
                    </td>
                    <td>
                      <span className="me-2">{getTipoIcon(habitacion.tipo_habitacion)}</span>
                      {habitacion.tipo_habitacion}
                    </td>
                    <td>{habitacion.ocupacion} personas</td>
                    <td>{habitacion.numero_camas}</td>
                    <td>
                      <span className="fw-bold text-success">
                        ${parseFloat(habitacion.precio_base).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${getEstadoBadge(habitacion.estado)}`}>
                        {habitacion.estado}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {habitacion.descripcion || "Sin descripción"}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {(habitacion.comodidades || []).slice(0, 3).map(comodidadId => (
                          <span key={comodidadId} className="badge bg-light text-dark" title={getComodidadLabel(comodidadId)}>
                            {getComodidadIcon(comodidadId)}
                          </span>
                        ))}
                        {(habitacion.comodidades || []).length > 3 && (
                          <span className="badge bg-secondary">
                            +{(habitacion.comodidades || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditar(habitacion)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar(habitacion.numero_habitacion)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {habitaciones.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-house-door display-1 text-muted"></i>
                <p className="text-muted mt-3">No hay habitaciones registradas</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    resetForm();
                    setEditing(null);
                    setShowForm(true);
                  }}
                >
                  Crear Primera Habitación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Habitaciones;