import { Routes, Route } from "react-router-dom";

// Layouts
import LayoutCliente from "./layouts/LayoutCliente.jsx";
import LayoutAdmin from "./layouts/LayoutAdmin.jsx";

// Clientes
import ClienteHome from "./pages/cliente/ClienteHome.jsx";
import PerfilCliente from "./pages/cliente/PerfilCliente.jsx";
import Login from "./pages/cliente/Login.jsx";
import RegistroCliente from "./pages/cliente/RegistroCliente.jsx";
import RegistroInfoCliente from "./pages/cliente/RegistroInfoCliente.jsx";
import HabitacionesView from "./pages/cliente/HabitacionesView.jsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Habitaciones from "./pages/admin/Habitaciones.jsx";

function App() {
  return (
    <Routes>
      {/* Clientes */}
      <Route element={<LayoutCliente />}>
        <Route path="/" element={<ClienteHome />} />
        <Route path="/habitaciones" element={<HabitacionesView />} />
        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroCliente />} />
        <Route path="/registro-info" element={<RegistroInfoCliente />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/*" element={<LayoutAdmin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="habitaciones" element={<Habitaciones />} />
      </Route>
    </Routes>
  );
}

export default App;