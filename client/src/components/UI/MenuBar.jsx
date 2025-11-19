import AdminMenu from "../Menu/AdminMenu";
import ProjectEngineerMenu from "../Menu/ProjectEngineerMenu";
import ForemanMenu from "../Menu/ForemanMenu"
import PMSCoordinatorMenu from "../Menu/PMSCoordinatorMenu";
import PMSTechnicianMenu from "../Menu/PMSTechnicianMenu";
import InstallerMenu from "../Menu/InstallerMenu";
import QAQCCoordinatorMenu from "../Menu/QAQCCoordinatorMenu";
import ProjectManagerMenu from '../Menu/ProjectManagerMenu'
import QAQCMenu from "../Menu/QAQCMenu";
import TNCCoordinatorMenu from "../Menu/TNCCoordinator";
import TNCMenu from '../Menu/TNCMenu'

const MenuBar = ({ menuToggle }) => {
const user = sessionStorage.getItem('roles');

return (
  <div className={`Menu${!menuToggle ? '' : ' Hidden'}`}>
    {
        user === "Operations Manager" ? <ProjectManagerMenu /> :
        user === "Project Manager" ? <ProjectManagerMenu /> :
        user === "Project Engineer" ? <ProjectEngineerMenu /> :
        user === "Foreman" ? <ForemanMenu /> :
        user === "Installer" || user === "Skilled Installer" ? <InstallerMenu /> :
        user === "PMS Coordinator" ? <PMSCoordinatorMenu /> :
        user === "PMS Technician" ? <PMSTechnicianMenu /> :
        user === "QAQC Coordinator" ? <QAQCCoordinatorMenu /> :
        user === "QAQC" ? <QAQCMenu /> : 
        user === "TNC Coordinator" ? <TNCCoordinatorMenu /> :
        user === "TNC Technician" ? <TNCMenu /> :
      <AdminMenu/>
    }
  </div>
);
}

export default MenuBar