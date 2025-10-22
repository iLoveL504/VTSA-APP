import React from 'react'
import { IoIosDocument } from "react-icons/io";
import { useNavigate, Link } from 'react-router-dom';
import { BiSolidLogOut } from "react-icons/bi"
import { MdDashboard } from "react-icons/md"
import { MdHomeRepairService } from "react-icons/md"

const QAQCCoordinatorMenu = () => {
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
            <Link to="/QAQC">
                <li>
                    <MdHomeRepairService style={{ color: 'white' }}/>
                    QAQC
                </li>
            </Link>
                
            
            </ul>

            <div className="Logout" onClick={handleLogout}><span><BiSolidLogOut /></span>Log Out</div>
        </>      
    )
}

export default QAQCCoordinatorMenu