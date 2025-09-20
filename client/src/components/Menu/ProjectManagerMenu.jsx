import { MdDashboard } from "react-icons/md"
import { MdHomeRepairService } from "react-icons/md"
import { IoPerson } from "react-icons/io5"
import { RiTeamFill } from "react-icons/ri"
import { GoProjectRoadmap } from "react-icons/go";
import { IoIosDocument } from "react-icons/io";
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { BiSolidLogOut } from "react-icons/bi"


const ProjectManagerMenu = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/login')
  }
  return (
    <>
        <ul>
          <Link to="/dashboard">
            <li>
                <MdDashboard style={{ color: 'white' }}/>
                Dashboard
            </li>
          </Link>
          <Link to="/technician">
            <li>
                <IoPerson style={{ color: 'white' }}/>
                Technician
            </li>
          </Link>
          <Link to="/projects">
            <li>
                <GoProjectRoadmap style={{ color: 'white' }}/>
                Projects
            </li>
          </Link>
          <Link to="/teams">
            <li>
                <RiTeamFill style={{ color: 'white' }}/>
                Teams
            </li>
          </Link>
   
          
        </ul>

        <div className="Logout" onClick={handleLogout}><span><BiSolidLogOut /></span>Log Out</div>
    </> 
  )
}

export default ProjectManagerMenu