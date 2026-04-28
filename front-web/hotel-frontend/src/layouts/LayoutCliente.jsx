import { Outlet } from "react-router-dom";
import NavbarCliente from "../components/NavbarCliente";

function LayoutCliente() {
  return (
    <>
      <NavbarCliente />
      <div style={{ paddingTop: "100px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutCliente;