import React, { useEffect, useState } from "react";
import { 
  getUsuarios, 
  getRoles, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario
} from "../../services/usuariosApi";
import { 
  getClientes, 
  getClienteById, 
  actualizarCliente, 
  eliminarCliente 
} from "../../services/clientesApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../assets/css/hotel-styles.css";

function UsuariosView() {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [formDataUsuario, setFormDataUsuario] = useState({
    nombre_usuario: "",
    correo: "",
    contraseña: "",
    roles: [],
    estado: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosData, rolesData, clientesData] = await Promise.all([
        getUsuarios(),
        getRoles(),
        getClientes()
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setClientes(clientesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormDataUsuario(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === "roles") {
      const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
      setFormDataUsuario(prev => ({
        ...prev,
        roles: selectedRoles
      }));
    } else {
      setFormDataUsuario(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      if (editingUsuario) {
        await actualizarUsuario(editingUsuario.id_usuario, {
          ...formDataUsuario,
          contraseña: formDataUsuario.contraseña || undefined
        });
      } else {
        await crearUsuario(formDataUsuario);
      }
      
      await cargarDatos();
      resetForm();
      setShowModalUsuario(false);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleEditUsuario = (usuario) => {
    setEditingUsuario(usuario);
    setFormDataUsuario({
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      contraseña: "",
      roles: usuario.roles ? usuario.roles.map(rol => rol.nombre) : [],
      estado: usuario.estado
    });
    setShowModalUsuario(true);
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await eliminarUsuario(id);
        await cargarDatos();
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
    }
  };

  const resetForm = () => {
    setFormDataUsuario({
      nombre_usuario: "",
      correo: "",
      contraseña: "",
      roles: [],
      estado: true
    });
    setEditingUsuario(null);
  };

  const closeModal = () => {
    setShowModalUsuario(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2">
                <i className="bi bi-people-fill me-2" style={{ color: "#a67c52" }}></i>
                Gestión de Usuarios
              </h2>
              <p className="text-muted mb-0">Administra usuarios del sistema y asigna roles predefinidos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "usuarios" ? "active" : ""}`}
                onClick={() => setActiveTab("usuarios")}
                style={{ 
                  color: activeTab === "usuarios" ? "#a67c52" : "#6c757d",
                  borderColor: activeTab === "usuarios" ? "#a67c52" : "transparent"
                }}
              >
                <i className="bi bi-person-badge me-2"></i>
                Usuarios del Sistema
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "clientes" ? "active" : ""}`}
                onClick={() => setActiveTab("clientes")}
                style={{ 
                  color: activeTab === "clientes" ? "#a67c52" : "#6c757d",
                  borderColor: activeTab === "clientes" ? "#a67c52" : "transparent"
                }}
              >
                <i className="bi bi-people me-2"></i>
                Clientes del Hotel
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === "usuarios" && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header" style={{ background: "#a67c52", color: "white" }}>
                <h4 className="mb-0">
                  <i className="bi bi-people-fill me-2"></i>
                  Gestión de Usuarios
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar usuario..."
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button 
                      className="btn"
                      style={{ 
                        background: "#a67c52", 
                        borderColor: "#a67c52", 
                        color: "white" 
                      }}
                      onClick={() => {
                        setEditingUsuario(null);
                        resetForm();
                        setShowModalUsuario(true);
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Crear Nuevo Usuario
                    </button>
                  </div>
                </div>

                <div className="alert alert-info mt-3" role="alert">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Roles Predefinidos del Sistema
                  </h6>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>1. Administrador:</strong> Acceso completo al sistema
                    </div>
                    <div className="col-md-4">
                      <strong>2. Empleado:</strong> Gestión de habitaciones y clientes
                    </div>
                    <div className="col-md-4">
                      <strong>3. Cliente:</strong> Acceso a reservas y perfil
                    </div>
                  </div>
                </div>

                <div className="table-responsive mt-3">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Correo</th>
                        <th>Estado</th>
                        <th>Roles Asignados</th>
                        <th>Fecha de Creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id_usuario}>
                          <td>{usuario.id_usuario}</td>
                          <td>
                            <strong>{usuario.nombre_usuario}</strong>
                          </td>
                          <td>{usuario.correo}</td>
                          <td>
                            <span className={`badge me-1`} style={{
                              background: usuario.estado ? "#48bb78" : "#f56565",
                              color: "white"
                            }}>
                              {usuario.estado ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td>
                            {usuario.roles.map((rol, index) => (
                              <span key={index} className="badge me-1" style={{
                                background: "#8b6344",
                                color: "white"
                              }}>
                                {rol.nombre}
                              </span>
                            ))}
                          </td>
                          <td>
                            {new Date(usuario.fecha_creacion).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={() => handleEditUsuario(usuario)}
                                title="Modificar usuario"
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center ms-1"
                                onClick={() => handleDeleteUsuario(usuario.id_usuario)}
                                title="Eliminar usuario"
                              >
                                <i className="bi bi-trash me-1"></i>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {usuarios.length === 0 && (
                    <div className="text-center py-4">
                      <i className="bi bi-people display-4 text-muted"></i>
                      <p className="text-muted mt-2">No hay usuarios registrados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "clientes" && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header" style={{ background: "#a67c52", color: "white" }}>
                <h4 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Clientes del Hotel
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar cliente..."
                      />
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <button 
                      className="btn"
                      style={{ 
                        background: "#a67c52", 
                        borderColor: "#a67c52", 
                        color: "white" 
                      }}
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      Nuevo Cliente
                    </button>
                  </div>
                </div>

                <div className="table-responsive mt-3">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Documento</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente) => (
                        <tr key={cliente.id_cliente}>
                          <td>{cliente.id_cliente}</td>
                          <td>
                            <strong>{cliente.nombre} {cliente.apellido}</strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {cliente.tipo_documento} {cliente.numero_documento}
                            </small>
                          </td>
                          <td>{cliente.telefono}</td>
                          <td>{cliente.correo}</td>
                          <td>
                            {cliente.fecha_registro ? 
                             new Date(cliente.fecha_registro).toLocaleDateString() : 
                             <span className="text-muted">Sin fecha</span>
                            }
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                title="Modificar cliente"
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center ms-1"
                                title="Eliminar cliente"
                              >
                                <i className="bi bi-trash me-1"></i>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {clientes.length === 0 && (
                    <div className="text-center py-4">
                      <i className="bi bi-people display-4 text-muted"></i>
                      <p className="text-muted mt-2">No hay clientes registrados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalUsuario && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ background: "#a67c52", color: "white", border: "none" }}>
                <h5 className="modal-title">
                  {editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmitUsuario}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre_usuario" className="form-label">
                        Nombre de Usuario <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre_usuario"
                        name="nombre_usuario"
                        value={formDataUsuario.nombre_usuario}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo Electrónico <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="correo"
                        name="correo"
                        value={formDataUsuario.correo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                   
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contraseña" className="form-label">
                        Contraseña {!editingUsuario && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="contraseña"
                        name="contraseña"
                        value={formDataUsuario.contraseña}
                        onChange={handleInputChange}
                        placeholder={editingUsuario ? "Dejar en blanco para mantener la actual" : "Ingrese contraseña"}
                        required={!editingUsuario}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado</label>
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="estado"
                          name="estado"
                          checked={formDataUsuario.estado}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="estado">
                          Usuario Activo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Roles Asignados</label>
                    <div className="row">
                      {roles.map((rol) => (
                        <div key={rol.id_rol} className="col-md-3 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`rol_${rol.id_rol}`}
                              name="roles"
                              value={rol.nombre}
                              checked={formDataUsuario.roles.includes(rol.nombre)}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor={`rol_${rol.id_rol}`}>
                              {rol.nombre}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn" style={{ 
                    background: "#a67c52", 
                    borderColor: "#a67c52", 
                    color: "white" 
                  }}>
                    <i className="bi bi-check-circle me-2"></i>
                    {editingUsuario ? "Actualizar" : "Crear"} Usuario
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

export default UsuariosView;
