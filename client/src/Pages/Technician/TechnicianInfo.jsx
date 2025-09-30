import { useEffect, useState } from 'react'
import { useStoreActions } from 'easy-peasy'
import { useParams } from 'react-router-dom'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { Grid } from 'ldrs/react'
import { Axios } from '../../api/axios.js'
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import '../../css/TechnicianInfo.css'

const TechnicianInfo = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const { empId } = useParams()
    const [open, setOpen] = useState(false);
    const searchSetEmployee = useStoreActions(actions => actions.searchSetEmployee)
    const employee = searchSetEmployee(empId)
    const [empLoading, setEmpLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [saveStatus, setSaveStatus] = useState('')
    const [formData, setFormData] = useState({})
    const [empInfo, setEmpInfo] = useState({})
    const {data: teamInfo, isLoading: teamIsLoading} = useAxiosFetch(`${backendURL}/teams/team-designation/${empId}`) 
    const teamDesignation = teamInfo[0]

    useEffect(() => {
        if (employee !== undefined) {
            setEmpLoading(false)
            setEmpInfo(employee)
            setFormData(employee)
            console.log(employee)
        }
    }, [employee])

    const getJobBadgeClass = (job) => {
        if (job?.toLowerCase().includes('manager')) return 'project manager'
        if (job?.toLowerCase().includes('engineer')) return 'project engineer'
        return 'job-technician'
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        console.log(value)
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNumberInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }))
    }

    if (empLoading || teamIsLoading) {
        return (
            <div className="Content TechnicianInfo">
                <div className="loading-state">
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                    <p className="loading-text">Loading technician information...</p>
                </div>
            </div>
        )
    }

    const handleSave = async () => {
        try{
            await Axios.put(`/employees/${empId}`, formData)
            setSaveStatus('success')
            setIsEditing(false)
            handleClick()
            window.location.reload()
        } catch(e) {
            console.log(e)
        }
    }

    const handleCancel = () => {
        setFormData(employee)
        setIsEditing(false)
        console.log('hello')
        setSaveStatus('')
    }

     const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const action = (
        <>
        <Button color="secondary" size="small" onClick={handleClose}>
            Undo
        </Button>
        
        </>
    );

    return (
        <div className="Content TechnicianInfo">
            {/* Employee Header */}
            <div className="employee-header">
                <h2>{empInfo.first_name} {empInfo.last_name}</h2>
                <p className="employee-id">Employee ID: {empInfo.employee_id}</p>
                <div className="action-buttons">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    ) : (
                        <>
                            <button onClick={handleSave} disabled={saveStatus === 'saving'}>
                                {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    )}
                     <div>
                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            message={<span>update employee <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE"}} /></span>}
                            action={action}
                        />
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="info-grid">
                {/* Personal Info Card */}
                <div className="info-card">
                    <h3>Personal Information</h3>
                    <div className="info-item">
                        <label>Last Name:</label>
                        <input 
                            type="text"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="info-item">
                        <label>First Name:</label>
                        <input 
                            type="text"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="info-item">
                        <label>Employee ID:</label>
                        <input 
                            type="text"
                            name="employee_id"
                            value={formData.employee_id || ''}
                            onChange={handleNumberInputChange}
                            disabled={true}
                        />
                    </div>
                    <div className="info-item">
                        <label>Username:</label>
                        <input 
                            type="text"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Employment Info Card */}
                <div className="info-card">
                    <h3>Employment Details</h3>
                    <div className="info-item">
                        <span className="info-label">Position:</span>
                        <span className={`job-badge ${getJobBadgeClass(formData.job)}`}>
                            {formData.job}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Hire Date:</span>
                        <span className="info-value">
                            {new Date(formData.hire_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Project Assignment Section */}
            <div className="project-section">
                <h3>Current Project Assignment</h3>
                {teamDesignation === undefined ? (
                    <div className="no-project">
                        <p>No project assigned yet</p>
                    </div>
                ) : (
                    <div className="project-details">
                        <h4 className="project-name">{teamDesignation['project name']}</h4>
                        <div className="project-meta">
                            <div className="project-meta-item">
                                <span className="project-meta-label">Team ID</span>
                                <span className="project-meta-value">{teamDesignation.team_id}</span>
                            </div>
                            <div className="project-meta-item">
                                <span className="project-meta-label">Role</span>
                                <span className="project-meta-value">{empInfo.job}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TechnicianInfo