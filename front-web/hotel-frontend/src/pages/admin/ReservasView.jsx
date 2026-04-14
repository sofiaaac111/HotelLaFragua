import React, { useState, useEffect } from "react";
import {
  getReservas,
  eliminarReserva,
  cambiarEstadoReserva,
  getEstadisticasReservas
} from "../../services/reservasApi";

function ReservasView() {
  const [reservas, setReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchReserva, setSearchReserva] = useState("");
  const [showModalReserva, setShowModalReserva] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);

  const [formDataReserva, setFormDataReserva] = useState({
    id_cliente: "",
    id_habitacion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "pendiente",
    numero_personas: 1,
    total_pago: 0,
    metodo_pago: "tarjeta",
    observaciones: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [reservasData, estadisticasData] = await Promise.all([
        getReservas(),
        getEstadisticasReservas()
      ]);
      setReservas(reservasData);
      setFilteredReservas(reservasData);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataReserva(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReserva = async (e) => {
    e.preventDefault();
    try {
      if (editingReserva) {
        await actualizarReserva(editingReserva.id_reserva, formDataReserva);
        alert("Reserva actualizada correctamente");
      } else {
        await crearReserva(formDataReserva);
        alert("Reserva creada correctamente");
      }
      await cargarDatos();
      closeModal();
    } catch (error) {
      console.error("Error guardando reserva:", error);
      alert("Error al guardar la reserva: " + (error.response?.data?.message || "Intenta nuevamente"));
    }
  };

  const handleDeleteReserva = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      try {
        await eliminarReserva(id);
        await cargarDatos();
        alert("Reserva eliminada correctamente");
      } catch (error) {
        console.error("Error eliminando reserva:", error);
        alert("Error al eliminar la reserva: " + (error.response?.data?.message || "Intenta nuevamente"));
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoReserva(id, nuevoEstado);
      await cargarDatos();
      alert(`Reserva ${nuevoEstado} correctamente`);
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar estado: " + (error.response?.data?.message || "Intenta nuevamente"));
    }
  };

  const resetForm = () => {
    setFormDataReserva({
      id_cliente: "",
      id_habitacion: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado: "pendiente",
      numero_personas: 1,
      total_pago: 0,
      metodo_pago: "tarjeta",
      observaciones: ""
    });
    setEditingReserva(null);
  };

  const closeModal = () => {
    setShowModalReserva(false);
    resetForm();
  };

  const handleEditReserva = (reserva) => {
    setEditingReserva(reserva);
    setFormDataReserva({
      id_cliente: reserva.id_cliente,
      id_habitacion: reserva.id_habitacion,
      fecha_inicio: reserva.fecha_inicio,
      fecha_fin: reserva.fecha_fin,
      estado: reserva.estado,
      numero_personas: reserva.numero_personas,
      total_pago: reserva.total_pago,
      metodo_pago: reserva.metodo_pago,
      observaciones: reserva.observaciones || ""
    });
    setShowModalReserva(true);
  };

  // Filtrar reservas
  useEffect(() => {
    const filtered = reservas.filter(reserva => {
      const searchLower = searchReserva.toLowerCase();
      return (
        reserva.id_reserva?.toString().includes(searchLower) ||
        reserva.nombre_cliente?.toLowerCase().includes(searchLower) ||
        reserva.numero_habitacion?.toString().includes(searchLower) ||
        reserva.estado?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredReservas(filtered);
  }, [searchReserva, reservas]);

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { bg: "bg-warning", text: "Pendiente" },
      confirmada: { bg: "bg-success", text: "Confirmada" },
      cancelada: { bg: "bg-danger", text: "Cancelada" },
      completada: { bg: "bg-info", text: "Completada" }
    };
    const estadoInfo = estados[estado] || { bg: "bg-secondary", text: estado };
    return <span className={`badge ${estadoInfo.bg}`}>{estadoInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Estadísticas */}
      {estadisticas && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-primary mb-1">{estadisticas.total}</h3>
                <p className="text-muted mb-0">Total Reservas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-success mb-1">{estadisticas.confirmadas}</h3>
                <p className="text-muted mb-0">Confirmadas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-warning mb-1">{estadisticas.pendientes}</h3>
                <p className="text-muted mb-0">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-danger mb-1">{estadisticas.canceladas}</h3>
                <p className="text-muted mb-0">Canceladas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0 fw-bold text-dark">
                <i className="bi bi-calendar-check me-3"></i>
                Gestión de Reservas
              </h2>
              <p className="text-muted mb-0 mt-2">
                Administra las reservas del hotel y su estado
              </p>
            </div>
            <div>
              <button 
                className="btn"
                style={{ 
                  background: "#a67c52", 
                  borderColor: "#a67c52", 
                  color: "white" 
                }}
                onClick={() => {
                  setEditingReserva(null);
                  resetForm();
                  setShowModalReserva(true);
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Nueva Reserva
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Buscar por ID, cliente, habitación o estado..."
              value={searchReserva}
              onChange={(e) => setSearchReserva(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-end">
            <span className="text-muted">
              Mostrando {filteredReservas.length} de {reservas.length} reservas
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="card shadow-lg">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0">ID</th>
                  <th className="border-0">Cliente</th>
                  <th className="border-0">Habitación</th>
                  <th className="border-0">Fechas</th>
                  <th className="border-0">Personas</th>
                  <th className="border-0">Total</th>
                  <th className="border-0">Estado</th>
                  <th className="border-0">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservas.length > 0 ? (
                  filteredReservas.map((reserva) => (
                    <tr key={reserva.id_reserva}>
                      <td className="align-middle">
                        <span className="fw-bold">#{reserva.id_reserva}</span>
                      </td>
                      <td className="align-middle">
                        <div>
                          <div className="fw-semibold">{reserva.nombre_cliente}</div>
                          <small className="text-muted">{reserva.correo_cliente}</small>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div>
                          <div className="fw-semibold">Habitación {reserva.numero_habitacion}</div>
                          <small className="text-muted">{reserva.tipo_habitacion}</small>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div>
                          <div className="small">
                            <i className="bi bi-calendar-event me-1"></i>
                            {new Date(reserva.fecha_inicio).toLocaleDateString()}
                          </div>
                          <div className="small text-muted">
                            <i className="bi bi-calendar-event me-1"></i>
                            {new Date(reserva.fecha_fin).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-secondary">{reserva.numero_personas}</span>
                      </td>
                      <td className="align-middle">
                        <span className="fw-bold text-success">
                          ${reserva.total_pago?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="align-middle">
                        {getEstadoBadge(reserva.estado)}
                      </td>
                      <td className="align-middle">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditReserva(reserva)}
                            title="Editar reserva"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          
                          {reserva.estado === 'pendiente' && (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleCambiarEstado(reserva.id_reserva, 'confirmada')}
                              title="Confirmar reserva"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
                          
                          {reserva.estado === 'confirmada' && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleCambiarEstado(reserva.id_reserva, 'completada')}
                              title="Completar reserva"
                            >
                              <i className="bi bi-check-circle"></i>
                            </button>
                          )}
                          
                          {reserva.estado !== 'cancelada' && (
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleCambiarEstado(reserva.id_reserva, 'cancelada')}
                              title="Cancelar reserva"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                          
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteReserva(reserva.id_reserva)}
                            title="Eliminar reserva"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                        <h5>No se encontraron reservas</h5>
                        <p>No hay reservas que coincidan con tu búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      {showModalReserva && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingReserva ? "Editar Reserva" : "Nueva Reserva"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmitReserva}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">ID Cliente</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="id_cliente"
                        value={formDataReserva.id_cliente}
                        onChange={handleInputChange}
                        required
                        placeholder="ID del cliente"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">ID Habitación</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="id_habitacion"
                        value={formDataReserva.id_habitacion}
                        onChange={handleInputChange}
                        required
                        placeholder="ID de la habitación"
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">Fecha Inicio</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="fecha_inicio"
                        value={formDataReserva.fecha_inicio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">Fecha Fin</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="fecha_fin"
                        value={formDataReserva.fecha_fin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-primary">Número de Personas</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="numero_personas"
                        value={formDataReserva.numero_personas}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-primary">Total Pago</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="total_pago"
                        value={formDataReserva.total_pago}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-primary">Estado</label>
                      <select
                        className="form-select form-select-lg"
                        name="estado"
                        value={formDataReserva.estado}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">Método de Pago</label>
                      <select
                        className="form-select form-select-lg"
                        name="metodo_pago"
                        value={formDataReserva.metodo_pago}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="tarjeta">Tarjeta de Crédito</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">Observaciones</label>
                      <textarea
                        className="form-control form-control-lg"
                        name="observaciones"
                        value={formDataReserva.observaciones}
                        onChange={handleInputChange}
                        rows="1"
                        placeholder="Notas adicionales"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn" style={{background: "#a67c52", borderColor: "#a67c52", color: "white"}}>
                    {editingReserva ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservasView;
