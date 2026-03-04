import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import RegistroCliente from "./pages/RegistroCliente";
import RegistroInfoCliente from "./pages/RegistroInfoCliente";
import PerfilCliente from "./pages/PerfilCliente";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<RegistroCliente />} />
        <Route path="/registro-info" element={<RegistroInfoCliente />} />
        <Route path="/perfil" element={<PerfilCliente />} />
      </Routes>
    </>
  );
}

export default App;
