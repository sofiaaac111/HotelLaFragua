import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

function LayoutAdmin() {
  return (
    <>
      <NavbarAdmin />
      <div style={{ paddingTop: "100px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default LayoutAdmin;