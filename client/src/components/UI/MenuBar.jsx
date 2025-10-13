import AdminMenu from "../Menu/AdminMenu";
import ProjectEngineerMenu from "../Menu/ProjectEngineerMenu";
import ForemanMenu from "../Menu/ForemanMenu"
import PMSCoordinatorMenu from "../Menu/PMSCoordinatorMenu";
import PMSTechnicianMenu from "../Menu/PMSTechnicianMenu";
import InstallerMenu from "../Menu/InstallerMenu";

const MenuBar = ({ menuToggle }) => {
const user = sessionStorage.getItem('roles');

return (
  <div className={`Menu${!menuToggle ? '' : ' Hidden'}`}>
    {
      user === "manager" ? <AdminMenu /> :
      user === "Project Manager" ? <AdminMenu /> :
      user === "Project Engineer" ? <ProjectEngineerMenu /> :
      user === "Foreman" ? <ForemanMenu /> :
      user === "Installer" || user === "Skilled Installer" ? <InstallerMenu /> :
      user === "PMS Coordinator" ? <PMSCoordinatorMenu /> :
      user === "PMS Technician" ? <PMSTechnicianMenu /> :
      <AdminMenu/>
    }
  </div>
);
}

export default MenuBar