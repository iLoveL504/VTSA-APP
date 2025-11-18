import React, { useState, useMemo } from 'react'
import { Outlet, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import '../../css/PMSEntry.css'
import { useEffect } from 'react';
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { Axios } from '../../api/axios';
import { useSharedSocket } from '../../Context/SocketContext';
import useAxiosFetch from "../../hooks/useAxiosFetch";
import FinalizeHandover from './FinalizeHandover';

// Material-UI Icons
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

const PMSNewEntry = () => {
    const { utilitiesSocket } = useSharedSocket()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const navigate = useNavigate()
    const {data: projects} = useAxiosFetch(`${backendURL}/api/projects`)
    const employees = useStoreState(state => state.employees)
    const projectManagerId = useStoreState(state => state.projectManagerId)
    const [searchTerm, setSearchTerm] = useState('')
    const [jointProjects, setJointProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [pmsTechs, setPmsTechs] = useState([])
    const [selectedTech, setSelectedTech] = useState('')
    const [assignmentLoading, setAssignmentLoading] = useState(false)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false)

    useEffect(() => {
        console.log(projects)
        // Filter projects that have joint inspection scheduled and are pending assignment
        const filtered = projects.filter(p => 
            p.pms_joint_inspection !== null 
        )
        
        // Filter active PMS technicians
        const filteredTechs = employees.filter(e => 
            e.job === 'PMS Technician'
        )
        
        setJointProjects(filtered)
        setPmsTechs(filteredTechs)
    }, [projects, employees])

    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return jointProjects
        
        const term = searchTerm.toLowerCase()
        return jointProjects.filter(project => 
            project.lift_name?.toLowerCase().includes(term) ||
            project.client?.toLowerCase().includes(term) ||
            project.status?.toLowerCase().includes(term)
        )
    }, [jointProjects, searchTerm])

    const handleSelect = (proj) => () => {
        setSelectedProject(proj)
        setSelectedTech('') // Reset selection when changing project
    }

    const handleSelectedTech = (e) => {
        setSelectedTech(e.target.value)
    }

    const handleAssignClick = () => {
        if (!selectedProject || !selectedTech) {
            alert('Please select both a project and a technician')
            return
        }
        setConfirmModalOpen(true)
    }

    const handleConfirmAssign = async () => {
        setConfirmModalOpen(false)
        setAssignmentLoading(true)
        
        try {
            const Ids = [projectManagerId, selectedProject.project_engineer_id, selectedTech.employee_id]
            const payload = {
                pmsId: selectedTech.employee_id
            }
            console.log(payload)
            const response = await Axios.put(`/api/projects/pms/approve/${selectedProject.id}`, payload)
            console.log(response.data)
            if(!response?.data.success) {
                window.alert('Something went wrong for the approval')
            } else {
                setSuccessModalOpen(true)
            }

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Approved and Assigned for Final Join Inspection',
                    body: `Final Joint Inspection to be conducted for ${selectedProject.lift_name} (Client: ${selectedProject.client})
                     at ${selectedProject.pms_joint_inspection}. Assigned PMS Technician: ${selectedTech.last_name} ${selectedTech.first_name}`,
                    Ids
                }, (ack) => {
                    clearTimeout(timeout);
                    if (ack?.success) {
                        utilitiesSocket.emit("refresh_project_data");
                        resolve();
                    } else {
                    reject(new Error("Server failed to process notification."));
                    }
                });
            });

        } catch (error) {
            console.error('Error assigning technician:', error)
            alert('Error assigning technician. Please try again.')
        } finally {
            setAssignmentLoading(false)
        }
    }

    const handleCloseSuccessModal = () => {
        setSuccessModalOpen(false)
        setSelectedProject(null)
        setSelectedTech('')
    }

    const handleCancelAssign = () => {
        setConfirmModalOpen(false)
    }

    const handleCreateClick = () => {
        navigate('create')
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleBackToList = () => {
        setSelectedProject(null)
        setSelectedTech('')
    }

    const getStatusBadge = (project) => {
        if (project.prepare_handover) {
            return { text: 'Prepare Handover', variant: 'warning' };
        } else if (project.pms_pending && !project.pms_is_assigned) {
            return { text: 'Assign Technician', variant: 'pending' };
        } else if (project.pms_is_assigned) {
            return { text: 'Assigned', variant: 'assigned' };
        } else {
            return { text: 'Ongoing', variant: 'ongoing' };
        }
    };

    return (
        <div className='Content PMSEntry-modern'>
            {/* Custom Confirmation Modal */}
            {confirmModalOpen && (
                <div className="modal-overlay">
                    <div className="confirmation-modal modern-modal">
                        <div className="modal-header modern-modal-header">
                            <AssignmentIcon className="modal-header-icon" />
                            <h3>Confirm Technician Assignment</h3>
                        </div>
                        <div className="modal-content modern-modal-content">
                            <p className="modal-description">
                                Are you sure you want to assign <strong>{selectedTech?.first_name} {selectedTech?.last_name}</strong> to 
                                the project <strong>"{selectedProject?.lift_name}"</strong> for <strong>Final Joint Inspection</strong>?
                            </p>
                            <div className="confirmation-details modern-details-grid">
                                <div className="details-section modern-details-section">
                                    <div className="section-header">
                                        <BusinessIcon className="section-icon" />
                                        <strong>Project Details</strong>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Client:</span>
                                        <span className="detail-value">{selectedProject?.client}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Joint Inspection:</span>
                                        <span className="detail-value">{selectedProject?.pms_joint_inspection ? new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB') : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedProject?.island_group}</span>
                                    </div>
                                </div>
                                <div className="details-section modern-details-section">
                                    <div className="section-header">
                                        <PersonIcon className="section-icon" />
                                        <strong>Technician Details</strong>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Name:</span>
                                        <span className="detail-value">{selectedTech?.first_name} {selectedTech?.last_name}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Region:</span>
                                        <span className="detail-value">{selectedTech?.island_group}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Role:</span>
                                        <span className="detail-value">{selectedTech?.job}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions modern-modal-actions">
                            <button 
                                onClick={handleCancelAssign} 
                                className="modal-btn modal-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmAssign} 
                                className="modal-btn modal-btn-primary"
                                disabled={assignmentLoading}
                            >
                                {assignmentLoading ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {successModalOpen && (
                <div className="modal-overlay">
                    <div className="confirmation-modal modern-modal success-modal">
                        <div className="modal-header modern-modal-header success-header">
                            <CheckCircleIcon className="modal-header-icon success-icon" />
                            <h3>Assignment Successful!</h3>
                        </div>
                        <div className="modal-content modern-modal-content">
                            <p className="modal-description success-description">
                                <strong>{selectedTech?.first_name} {selectedTech?.last_name}</strong> has been successfully assigned to 
                                the project <strong>"{selectedProject?.lift_name}"</strong> for Final Joint Inspection.
                            </p>
                            <div className="confirmation-details modern-details-grid">
                                <div className="details-section modern-details-section">
                                    <div className="section-header">
                                        <AssignmentIcon className="section-icon" />
                                        <strong>Assignment Details</strong>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Project:</span>
                                        <span className="detail-value">{selectedProject?.lift_name}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Technician:</span>
                                        <span className="detail-value">{selectedTech?.first_name} {selectedTech?.last_name}</span>
                                    </div>
                                    <div className="detail-item modern-detail-item">
                                        <span className="detail-label">Inspection Date:</span>
                                        <span className="detail-value">{selectedProject?.pms_joint_inspection ? new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB') : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions modern-modal-actions">
                            <button 
                                onClick={handleCloseSuccessModal}
                                className="modal-btn modal-btn-primary"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with Create Button and Search */}
            {selectedProject ? (
                <div className='joint-inspection-section modern-detail-view'>
                    <div className="selected-project-header modern-project-header">
                        <button 
                            onClick={handleBackToList}
                            className="back-button modern-back-btn"
                        >
                            <ArrowBackIcon className="back-icon" />
                            Back to Projects
                        </button>
                        
                        <div className="project-main-info">
                            <div className="project-title-section">
                                <BusinessIcon className="project-main-icon" />
                                <div>
                                    <h2>{selectedProject.lift_name}</h2>
                                    <p className="project-subtitle">#{selectedProject.id} • {selectedProject.client}</p>
                                </div>
                            </div>
                            <div className={`status-badge ${getStatusBadge(selectedProject).variant}`}>
                                {getStatusBadge(selectedProject).text}
                            </div>
                        </div>

                        <div className="project-details-grid">
                            <div className="detail-card">
                                <CalendarIcon className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Joint Inspection Date</span>
                                    <span className="detail-value">{new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB')}</span>
                                </div>
                            </div>
                            <div className="detail-card">
                                <LocationIcon className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Location</span>
                                    <span className="detail-value">{selectedProject.island_group}</span>
                                </div>
                            </div>
                            <div className="detail-card">
                                <EngineeringIcon className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Project Engineer</span>
                                    <span className="detail-value">{selectedProject.pe_fullname || 'Not assigned'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technician Assignment Section */}
                    {selectedProject.pms_pending && !selectedProject.pms_is_assigned ? (
                        <div className="assignment-section modern-assignment-section">
                            <div className="section-header-modern">
                                <AssignmentIcon className="section-icon" />
                                <h3>Assign PMS Technician</h3>
                                <p>Select a technician to conduct the final joint inspection</p>
                            </div>
                            
                            <div className="assignment-form modern-form">
                                <div className="form-group modern-form-group">
                                    <label htmlFor="technician-select" className="form-label">
                                        <PersonIcon className="label-icon" />
                                        Select Technician
                                    </label>
                                    <FormControl className="form-control-modern" size="medium" fullWidth>
                                        <InputLabel id="technician-select-label">PMS Technician</InputLabel>
                                        <Select
                                            labelId="technician-select-label"
                                            id="technician-select"
                                            value={selectedTech || ''}
                                            label="PMS Technician"
                                            onChange={handleSelectedTech}
                                        >
                                            {pmsTechs.map((t, index) => (
                                                <MenuItem value={t} key={index}>
                                                    <div className="technician-option">
                                                        <div className="tech-name">{t.last_name} {t.first_name}</div>
                                                        <div className="tech-region">({t.island_group})</div>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                
                                <button
                                    onClick={handleAssignClick}
                                    disabled={!selectedTech || assignmentLoading}
                                    className={`assign-button modern-primary-btn ${!selectedTech || assignmentLoading ? 'disabled' : ''}`}
                                >
                                    {assignmentLoading ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Assigning Technician...
                                        </>
                                    ) : (
                                        <>
                                            <AssignmentIcon className="btn-icon" />
                                            Assign Technician
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>                        
                    ) : selectedProject.prepare_handover ? (
                        <FinalizeHandover proj={selectedProject}/>
                    ) : (selectedProject.pms_ongoing || selectedProject.pms_is_assigned) ? (
                        <div className="ongoing-section">
                            <div className="ongoing-content">
                                <PlayArrowIcon className="ongoing-icon" />
                                <h4>Final Joint Inspection is Ongoing</h4>
                                <p>The inspection process has been initiated and is currently in progress.</p>
                            </div>
                        </div>
                    ) : (<></>)}
                </div>
            ) : (
                <>
                    {/* Main Projects List View */}
                    <div className="projects-header modern-header">
                        <div className="header-left">
                            <div className="title-section">
                                <AssignmentIcon className="header-icon" />
                                <div>
                                    <h1>Joint Inspection Assignments</h1>
                                    <p>Manage PMS technician assignments for final joint inspections</p>
                                </div>
                            </div>
                            <div className="projects-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{filteredProjects.length}</span>
                                    <span className="stat-label">Pending Assignments</span>
                                </div>
                            </div>
                        </div>

                        <div className="header-right">
                            {/* Search Bar */}
                            <div className="search-container modern-search">
                                <div className="search-input-wrapper">
                                    <SearchIcon className="search-icon-modern" />
                                    <input
                                        type="text"
                                        placeholder="Search projects by name, client, or status..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-input modern-search-input"
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="clear-search-btn modern-clear-btn"
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                        >
                                            <ClearIcon />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Create Project Button */}
                            <button 
                                onClick={handleCreateClick} 
                                className="create-project-btn modern-create-btn"
                                style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'flex' : 'none'}}
                            >
                                <AddIcon className="btn-icon" />
                                Add New Project
                            </button>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="projects-grid-modern">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(project => {
                                const status = getStatusBadge(project);
                                return (
                                    <div
                                        key={project.id}
                                        className={`project-card-modern ${selectedProject?.id === project.id ? 'selected' : ''}`}
                                        onClick={handleSelect(project)}
                                    >
                                        <div className="project-card-header">
                                            <div className="project-title">
                                                <BusinessIcon className="project-icon" />
                                                <div className="project-info">
                                                    <h3>{project.lift_name}</h3>
                                                    <p>#{project.id} • {project.client}</p>
                                                </div>
                                            </div>
                                            <div className={`status-badge ${status.variant}`}>
                                                {status.text}
                                            </div>
                                        </div>

                                        <div className="project-details">
                                            <div className="detail-row">
                                                <CalendarIcon className="detail-icon-small" />
                                                <span>{new Date(project.pms_joint_inspection).toLocaleDateString('en-GB')}</span>
                                            </div>
                                            <div className="detail-row">
                                                <LocationIcon className="detail-icon-small" />
                                                <span>{project.island_group}</span>
                                            </div>
                                        </div>

                                        <div className="progress-section-modern">
                                            <div className="progress-header">
                                                <span className="progress-label">Project Progress</span>
                                                <span className="progress-value">{project.progress}%</span>
                                            </div>
                                            <Box sx={{ width: '100%' }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={project.progress} 
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#f1f5f9',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            backgroundColor: '#315a95'
                                                        }
                                                    }}
                                                />          
                                            </Box>
                                        </div>

                                        <div className="project-actions">
                                            <button 
                                                onClick={handleSelect(project)}
                                                className={`action-btn ${status.variant}`}
                                            >
                                                {status.text}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="empty-state-modern">
                                <AssignmentIcon className="empty-icon" />
                                <h3>
                                    {searchTerm ? 'No projects found' : 'No pending joint inspections'}
                                </h3>
                                <p>
                                    {searchTerm 
                                        ? 'Try adjusting your search terms or clear the search to see all projects.'
                                        : 'All joint inspections have been assigned or there are no scheduled inspections.'
                                    }
                                </p>
                                {searchTerm && (
                                    <button onClick={handleClearSearch} className="clear-search-link modern-clear-link">
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default PMSNewEntry