import { useEffect, useState } from "react";
import { 
  getUsuarios, 
  getRoles, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario
} from "../../services/usuariosApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function UsuariosView() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formDataUsuario, setFormDataUsuario] = useState({
    nombre_usuario: "",
    correo: "",
    contraseña: "",
    estado: true,
    roles: []
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuarios(),
        getRoles()
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChangeUsuario = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "roles") {
      if (checked) {
        setFormDataUsuario(prev => ({
          ...prev,
          roles: [...prev.roles, value]
        }));
      } else {
        setFormDataUsuario(prev => ({
          ...prev,
          roles: prev.roles.filter(rol => rol !== value)
        }));
      }
    } else if (type === "checkbox") {
      setFormDataUsuario(prev => ({
        ...prev,
        [name]: checked
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
        await actualizarUsuario(editingUsuario.id_usuario, formDataUsuario);
      } else {
        await crearUsuario(formDataUsuario);
      }
      await cargarDatos();
      resetFormUsuario();
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
      estado: usuario.estado,
      roles: usuario.roles.map(rol => rol.nombre)
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

  const resetFormUsuario = () => {
    setFormDataUsuario({
      nombre_usuario: "",
      correo: "",
      contraseña: "",
      estado: true,
      roles: []
    });
    setEditingUsuario(null);
  };

  const closeModalUsuario = () => {
    setShowModalUsuario(false);
    resetFormUsuario();
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
              <h2 className="mb-2">Gestión de Usuarios</h2>
              <p className="text-muted mb-0">Administra usuarios del sistema y asigna roles predefinidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Gestión de Usuarios */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
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
                    className="btn btn-success"
                    onClick={() => {
                      setEditingUsuario(null);
                      resetFormUsuario();
                      setShowModalUsuario(true);
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Crear Nuevo Usuario
                  </button>
                </div>
              </div>

              {/* Información de Roles Predefinidos */}
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

              {/* Tabla de Usuarios */}
              <div className="table-responsive">
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
                          <span className={`badge ${usuario.estado ? 'bg-success' : 'bg-danger'}`}>
                            {usuario.estado ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          {usuario.roles.map((rol, index) => (
                            <span key={index} className="badge bg-info text-dark me-1">
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
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditUsuario(usuario)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUsuario(usuario.id_usuario)}
                            >
                              <i className="bi bi-trash"></i>
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

      {/* Modal para Crear/Editar Usuario */}
      {showModalUsuario && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModalUsuario}></button>
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
                        onChange={handleInputChangeUsuario}
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
                        onChange={handleInputChangeUsuario}
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
                        onChange={handleInputChangeUsuario}
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
                          onChange={handleInputChangeUsuario}
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
                              onChange={handleInputChangeUsuario}
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
                  <button type="button" className="btn btn-secondary" onClick={closeModalUsuario}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    {editingUsuario ? 'Actualizar' : 'Crear'} Usuario
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
