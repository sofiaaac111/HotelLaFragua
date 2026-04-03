import { useEffect, useState } from "react";
import { getHabitaciones } from "../../services/habitacionesService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../assets/css/hotel-styles.css";

function HabitacionesView() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [filtro, setFiltro] = useState({
    tipo: "",
    estado: "",
    precioMin: "",
    precioMax: ""
  });
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const cargarHabitaciones = async () => {
    try {
      const data = await getHabitaciones();
      setHabitaciones(data);
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro({ ...filtro, [name]: value });
  };

  const habitacionesFiltradas = habitaciones.filter(habitacion => {
    return (
      (!filtro.tipo || habitacion.tipo_habitacion === filtro.tipo) &&
      (!filtro.estado || habitacion.estado === filtro.estado) &&
      (!filtro.precioMin || habitacion.precio_base >= parseFloat(filtro.precioMin)) &&
      (!filtro.precioMax || habitacion.precio_base <= parseFloat(filtro.precioMax))
    );
  });

  const getEstadoColor = (estado) => {
    const colores = {
      "Libre": "#28a745",
      "Ocupada": "#dc3545", 
      "Limpieza": "#17a2b8",
      "Mantenimiento": "#ffc107"
    };
    return colores[estado] || "#6c757d";
  };

  const getTipoIcon = (tipo) => {
    const iconos = {
      "Individual": "🛏️",
      "Doble": "🛏️🛏️",
      "Familiar": "👨‍👩‍👧‍👦",
      "Suite": "👑"
    };
    return iconos[tipo] || "🏠";
  };

  return (
    <div className="habitaciones-view-cliente">
      {/* Hero Section */}
      <div className="hero-section text-center text-white py-5" style={{
        background: 'linear-gradient(135deg, rgba(166, 124, 82, 0.9) 0%, rgba(139, 99, 68, 0.9) 100%)',
        backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlend: 'overlay'
      }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Nuestras Habitaciones</h1>
          <p className="lead mb-4">Descubre el confort y elegancia que te mereces</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Filtros */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Buscar Habitaciones</h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Tipo de Habitación</label>
                    <select 
                      className="form-select"
                      name="tipo"
                      value={filtro.tipo}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todos los tipos</option>
                      <option value="Individual">Individual</option>
                      <option value="Doble">Doble</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Estado</label>
                    <select 
                      className="form-select"
                      name="estado"
                      value={filtro.estado}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todos los estados</option>
                      <option value="Libre">Disponible</option>
                      <option value="Ocupada">Ocupada</option>
                      <option value="Limpieza">En Limpieza</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Precio Mínimo</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="precioMin"
                      value={filtro.precioMin}
                      onChange={handleFiltroChange}
                      placeholder="Desde..."
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Precio Máximo</label>
                    <input 
                      type="number" 
                      className="form-control"
                      name="precioMax"
                      value={filtro.precioMax}
                      onChange={handleFiltroChange}
                      placeholder="Hasta..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Habitaciones */}
        <div className="row g-4">
          {habitacionesFiltradas.map((habitacion) => (
            <div key={habitacion.numero_habitacion} className="col-lg-4 col-md-6">
              <div className="card habitacion-card shadow-lg border-0 overflow-hidden">
                {/* Imagen de la habitación */}
                <div className="position-relative">
                  {habitacion.foto ? (
                    <img 
                      src={habitacion.foto} 
                      alt={`Habitación ${habitacion.numero_habitacion}`}
                      className="card-img-top habitacion-imagen"
                    />
                  ) : (
                    <div className="habitacion-imagen-placeholder d-flex align-items-center justify-content-center">
                      <i className="bi bi-image display-1 text-muted"></i>
                    </div>
                  )}
                  
                  {/* Badge de estado */}
                  <div className="position-absolute top-3 end-3">
                    <span 
                      className="badge px-3 py-2 rounded-pill text-white fw-semibold"
                      style={{ backgroundColor: getEstadoColor(habitacion.estado) }}
                    >
                      {habitacion.estado}
                    </span>
                  </div>

                  {/* Número de habitación */}
                  <div className="position-absolute top-3 start-3">
                    <div className="bg-white bg-opacity-90 rounded px-3 py-2">
                      <span className="fw-bold text-dark">Habitación {habitacion.numero_habitacion}</span>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  {/* Tipo y precio */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">
                        <span className="me-2">{getTipoIcon(habitacion.tipo_habitacion)}</span>
                        {habitacion.tipo_habitacion}
                      </h5>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-people me-1"></i>
                        {habitacion.ocupacion} personas • {habitacion.numero_camas} cama{habitacion.numero_camas > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-end">
                      <h4 className="text-primary fw-bold mb-0">
                        ${parseFloat(habitacion.precio_base).toLocaleString()}
                      </h4>
                      <p className="text-muted small mb-0">por noche</p>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="card-text text-muted mb-3">
                    {habitacion.descripcion || "Habitación elegante y confortable diseñada para tu máxima comodidad."}
                  </p>

                  {/* Comodidades */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">Comodidades</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {(habitacion.comodidades || []).slice(0, 4).map(comodidadId => (
                        <span key={comodidadId} className="comodidad-chip" title={getComodidadLabel(comodidadId)}>
                          {getComodidadIcon(comodidadId)}
                        </span>
                      ))}
                      {(habitacion.comodidades || []).length > 4 && (
                        <span className="comodidad-chip">
                          +{(habitacion.comodidades || []).length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => setHabitacionSeleccionada(habitacion)}
                      disabled={habitacion.estado !== "Libre"}
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      {habitacion.estado === "Libre" ? "Reservar Ahora" : "No Disponible"}
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setHabitacionSeleccionada(habitacion)}
                    >
                      <i className="bi bi-eye me-2"></i>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay habitaciones */}
        {habitacionesFiltradas.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-house-door display-1 text-muted"></i>
            <h4 className="mt-3">No se encontraron habitaciones</h4>
            <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {habitacionSeleccionada && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title">Detalles de la Habitación {habitacionSeleccionada.numero_habitacion}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setHabitacionSeleccionada(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    {habitacionSeleccionada.foto ? (
                      <img 
                        src={habitacionSeleccionada.foto} 
                        alt={`Habitación ${habitacionSeleccionada.numero_habitacion}`}
                        className="img-fluid rounded"
                      />
                    ) : (
                      <div className="text-center py-5 bg-light rounded">
                        <i className="bi bi-image display-1 text-muted"></i>
                        <p className="text-muted mt-2">Sin imagen disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h4 className="fw-bold mb-3">
                      {getTipoIcon(habitacionSeleccionada.tipo_habitacion)} {habitacionSeleccionada.tipo_habitacion}
                    </h4>
                    
                    <div className="mb-3">
                      <span 
                        className="badge px-3 py-2 rounded-pill text-white fw-semibold me-2"
                        style={{ backgroundColor: getEstadoColor(habitacionSeleccionada.estado) }}
                      >
                        {habitacionSeleccionada.estado}
                      </span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <p className="mb-1"><strong>Capacidad:</strong></p>
                        <p className="text-muted">{habitacionSeleccionada.ocupacion} personas</p>
                      </div>
                      <div className="col-6">
                        <p className="mb-1"><strong>Camas:</strong></p>
                        <p className="text-muted">{habitacionSeleccionada.numero_camas}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="mb-1"><strong>Descripción:</strong></p>
                      <p className="text-muted">
                        {habitacionSeleccionada.descripcion || "Habitación elegante y confortable diseñada para tu máxima comodidad."}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="mb-1"><strong>Comodidades:</strong></p>
                      <div className="d-flex flex-wrap gap-2">
                        {(habitacionSeleccionada.comodidades || []).map(comodidadId => (
                          <span key={comodidadId} className="badge bg-light text-dark p-2">
                            {getComodidadIcon(comodidadId)} {getComodidadLabel(comodidadId)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-primary fw-bold">
                        ${parseFloat(habitacionSeleccionada.precio_base).toLocaleString()}
                      </h3>
                      <p className="text-muted">por noche</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setHabitacionSeleccionada(null)}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg"
                  disabled={habitacionSeleccionada.estado !== "Libre"}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  {habitacionSeleccionada.estado === "Libre" ? "Reservar Ahora" : "No Disponible"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Funciones auxiliares
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
    servicio_habitacion: "🛎️"
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
    servicio_habitacion: "Servicio Habitación"
  };
  return labels[comodidadId] || comodidadId;
};

export default HabitacionesView;
