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

const PMSNewEntry = () => {
    const { utilitiesSocket } = useSharedSocket()
     const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const navigate = useNavigate()
    const {data: projects} = useAxiosFetch(`${backendURL}/api/projects`)
    //const projects = useStoreState(state => state.projects)
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
            //window.location.reload()
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

    return (
        <div className='Content PMSEntry'>
            {/* Custom Confirmation Modal */}
            {confirmModalOpen && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <div className="modal-header">
                            <h3>Confirm Technician Assignment</h3>
                        </div>
                        <div className="modal-content">
                            <p className="modal-description">
                                Are you sure you want to assign <strong>{selectedTech?.first_name} {selectedTech?.last_name}</strong> to 
                                the project <strong>"{selectedProject?.lift_name}"</strong> for <strong>Final Joint Inspection</strong>?
                            </p>
                            <div className="confirmation-details">
                                <div className="details-section">
                                    <strong>Project Details:</strong>
                                    <div className="detail-item">• Client: {selectedProject?.client}</div>
                                    <div className="detail-item">• Joint Inspection: {selectedProject?.pms_joint_inspection ? new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB') : 'N/A'}</div>
                                    <div className="detail-item">• Location: {selectedProject?.island_group}</div>
                                </div>
                                <div className="details-section">
                                    <strong>Technician Details:</strong>
                                    <div className="detail-item">• Name: {selectedTech?.first_name} {selectedTech?.last_name}</div>
                                    <div className="detail-item">• Region: {selectedTech?.island_group}</div>
                                    <div className="detail-item">• Role: {selectedTech?.job}</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={handleCancelAssign} 
                                className="modal-btn modal-btn-cancel"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmAssign} 
                                className="modal-btn modal-btn-confirm"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {successModalOpen && (
            <div className="modal-overlay">
                <div className="confirmation-modal success-modal">
                    <div className="modal-header success-header">
                        <h3>Assignment Successful!</h3>
                    </div>
                    <div className="modal-content">
                        <div className="success-icon">✓</div>
                        <p className="modal-description">
                            <strong>{selectedTech?.first_name} {selectedTech?.last_name}</strong> has been successfully assigned to 
                            the project <strong>"{selectedProject?.lift_name}"</strong> for Final Joint Inspection.
                        </p>
                        <div className="confirmation-details">
                            <div className="details-section">
                                <strong>Assignment Details:</strong>
                                <div className="detail-item">• Project: {selectedProject?.lift_name}</div>
                                <div className="detail-item">• Technician: {selectedTech?.first_name} {selectedTech?.last_name}</div>
                                <div className="detail-item">• Inspection Date: {selectedProject?.pms_joint_inspection ? new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB') : 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button 
                            onClick={handleCloseSuccessModal}
                            className="modal-btn modal-btn-confirm"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        )}
            {/* Header with Create Button and Search */}
            {selectedProject ? (
                <div className='joint-inspection-section'>
                    <div className="selected-project-header">
                        <button 
                            onClick={handleBackToList}
                            className="back-button"
                        >
                            ← Back to Projects
                        </button>
                        <h4>{selectedProject.lift_name}</h4>
                        <div className="project-details">
                            <p><strong>Client:</strong> {selectedProject.client}</p>
                            <p><strong>Joint Inspection Date:</strong> {new Date(selectedProject.pms_joint_inspection).toLocaleDateString('en-GB')}</p>
                            <p><strong>Location:</strong> {selectedProject.island_group}</p>
                        </div>
                    </div>

                    {/* Technician Assignment Section */}
                    {selectedProject.prepare_handover ? (
                        <FinalizeHandover proj={selectedProject}/>
                    ) : (selectedProject.pms_ongoing || selectedProject.pms_is_assigned) ? (
                        <>Final Joint Inspection is Ongoing</>
                    ) : (
                        <div className="assignment-section">
                        <h5>Assign PMS Technician</h5>
                        <div className="assignment-form">
                            <div className="form-group">
                                <label htmlFor="technician-select">Select Technician:</label>
                                <FormControl className="form-control-professional" size="small" fullWidth>
                                    <InputLabel id="qaqc-reason-label">PMS Tech</InputLabel>
                                    <Select
                                        labelId="qaqc-reason-label"
                                        id="qaqc-reason-select"
                                        value={selectedTech || ''}
                                        label="PMS Tech"
                                        onChange={handleSelectedTech}
                                    >
                                        {pmsTechs.map((t, index) => (
                                            <MenuItem value={t} key={index}>({t.island_group}) {t.last_name} {t.first_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            
                            <button
                                onClick={handleAssignClick}
                                disabled={!selectedTech || assignmentLoading}
                                className="assign-button"
                            >
                                {assignmentLoading ? 'Assigning...' : 'Assign Technician'}
                            </button>
                        </div>
                    </div>
                    )}
                    
                </div>
            ) : (
                <>
                    {/* Main Projects List View */}
                    <div className="projects-header">
                        <div className="header-left">
                            <h3>Pending Joint Inspections for new entries</h3>
                        </div>

                        <div className="header-right">
                            {/* Search Bar */}
                            <div className="search-container">
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Search projects by name, client, or status..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="clear-search-btn"
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <span className="search-icon">🔍</span>
                                </div>
                            </div>

                            {/* Create Project Button */}
                            <button 
                                onClick={handleCreateClick} 
                                className="create-project-btn"
                                style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}
                            >
                                + Add New Project
                            </button>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div className="pms-handover-table-header">
                        <div className="table-row header-row">
                            <div className="table-cell">Project</div>
                            <div className="table-cell">PMS Inspection</div>
                            <div className="table-cell">Progress</div>
                            <div className="table-cell">Status</div>
                            <div className="table-cell">Action</div>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="projects-list">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(project => (
                                <div
                                    key={project.id}
                                    className={`ProjectInfo joint-pms ${selectedProject?.id === project.id ? 'selected' : ''}`}
                                    onClick={handleSelect(project)}
                                >
                                    <div className="project-basic-info">
                                        <div className="project-name">{project.lift_name}</div>
                                        <div className="project-client">{project.client}</div>
                                        <div className="project-location">{project.island_group}</div>
                                    </div>
                                    <div className="inspection-date">
                                        {new Date(project.pms_joint_inspection).toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="progress-section">
                                        <Box sx={{ width: '100%' }}>
                                            <div className="progress-text">{project.progress}%</div>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={project.progress} 
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#e9ecef',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        backgroundColor: '#315a95'
                                                    }
                                                }}
                                            />          
                                        </Box>
                                    </div>
                                    <div className="project-status">
                                        <strong>
                                            {project.prepare_handover ? 'Prepare Handover' : project.pms_ongoing ? 
                                            'Ongoing' : project.pms_is_assigned ? 
                                                'Assigned' : 'Pending'}
                                        </strong>
                                    </div>
                                    <div className="action-cell">
                                        
                                        <button 
                                            onClick={handleSelect(project)}
                                            className="assign-action-btn"
                                        >
                                            {project.prepare_handover ? 'Prepare Handover' : project.pms_ongoing ? 
                                            'Ongoing' : project.pms_is_assigned ? 
                                                'Assigned' : 'Assign Technician'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-projects-message">
                                {searchTerm ? 'No projects found matching your search' : 'No projects pending joint inspection'}
                            </div>
                        )}
                    </div>

                    {/* No Results Message */}
                    {filteredProjects.length === 0 && jointProjects.length > 0 && (
                        <div className="no-results">
                            <p>No projects found matching "{searchTerm}"</p>
                            <button onClick={handleClearSearch} className="clear-search-link">
                                Clear search
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default PMSNewEntry