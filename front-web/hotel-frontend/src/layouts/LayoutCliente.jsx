import { Outlet } from "react-router-dom";
import NavbarCliente from "../components/NavbarCliente";

function LayoutCliente() {
  return (
    <>
      <NavbarCliente />
      <div style={{ padding: "2rem" }}>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutCliente;