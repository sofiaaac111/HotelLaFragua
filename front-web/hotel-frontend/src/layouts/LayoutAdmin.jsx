import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function LayoutAdmin() {
  return (
    <>
      <NavbarAdmin />
      <div style={{ padding: "2rem" }}>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutAdmin;