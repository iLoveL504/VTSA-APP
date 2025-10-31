import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import QAQCList from '../../components/QAQCTNC/QAQCList.jsx'
import { useSharedSocket } from '../../Context/SocketContext.js';
import '../../css/QAQCPage.css'
import { Axios } from '../../api/axios.js'
import useAxiosFetch from '../../hooks/useAxiosFetch.js';

const QAQCAssignment = ({updateIsLoading}) => {
    const { utilitiesSocket } = useSharedSocket()
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const { data: manpower, isLoading: manpowerIsLoading } = useAxiosFetch(`${backendURL}/api/teams/project-manpower`)
    const navigate = useNavigate()
    const projects = useStoreState(state => state.projects)
    const employees = useStoreState(state => state.employees)
    const qaqcTechs = employees.filter(e => e.job === 'QAQC' && e.is_active === 0)
    console.log(manpower)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEntry, setSelectedEntry] = useState({})
    const [assignModal, setAssignModal] = useState({ isOpen: false, project: null })
    const [selectedTech, setSelectedTech] = useState('')
    const [assignmentStatus, setAssignmentStatus] = useState('')
    console.log(selectedEntry)
    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects
        
        const term = searchTerm.toLowerCase()
        return projects.filter(project => 
        project.lift_name?.toLowerCase().includes(term) ||
        project.client?.toLowerCase().includes(term) ||
        project.status?.toLowerCase().includes(term)
        )
    }, [projects, searchTerm])

    useEffect(() => {
        console.log(filteredProjects)
    }, [filteredProjects])

    const handleCreateClick = () => {
        navigate('create')
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleAssignClick = (project) => {
        setAssignModal({ isOpen: true, project })
        setSelectedTech('')
        setAssignmentStatus('')
    }
    console.log(selectedEntry)
    const handleAssignConfirm = async () => {
        if (!selectedTech) {
            setAssignmentStatus('Please select a QAQC technician')
            return
        }

        try {
            console.log(selectedTech)
            const peID = projects.find(p => p.id === assignModal.project.id).project_engineer_id
            const ProjectManagerId = employees.find(e => e.job === 'Project Manager').employee_id
            setAssignmentStatus('assigning')
            console.log(selectedEntry)
            const payload = {
                projId: assignModal.project.id,
                qaqcId: parseInt(selectedTech.employee_id),
                assign_date: new Date().toISOString().split('T')[0],
                inspection_type: 'QAQC',
                inspection_reason: selectedEntry.qaqc_inspection_reason,
                inspection_date: new Date(selectedEntry.qaqc_inspection_date).toISOString().split('T')[0]
            }
       
            console.log(peID)
            console.log(payload)

            const response = await Axios.put(`/api/projects/qaqc/assign/${assignModal.project.id}`, payload)
            
            if (response.data.success) {
                setAssignmentStatus('success')

                //Make Notification
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error("Socket emit timeout"));
                    }, 5000); 

                    utilitiesSocket.emit("new_notification", {
                        subject: 'Assigned for QAQC Inspection',
                        body: `QAQC Inspection to be conducted for ${assignModal.project.lift_name} is assigned to ${selectedTech.last_name} ${selectedTech.first_name} (${selectedTech.employee_id})`,
                        Ids: [selectedTech.employee_id, ProjectManagerId, peID]
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

                setTimeout(() => {
                    setAssignModal({ isOpen: false, project: null })
                    window.location.reload() // Refresh to show updated assignment
                }, 1500)
            }
        } catch (error) {
            console.error('Error assigning QAQC technician:', error)
            setAssignmentStatus('error')
        }
    }


    const handleAssignClose = () => {
        setAssignModal({ isOpen: false, project: null })
        setSelectedTech('')
        setAssignmentStatus('')
    }

    if (manpowerIsLoading) return (
        <div>loading data</div>
    )

    return (
        <div className='Content QAQCMenu'>
            {/* Assignment Modal */}
            {assignModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content assign-modal">
                        <h3>Assign QAQC Technician</h3>
                        <div className="modal-project-info">
                            <p><strong>Project:</strong> {assignModal.project.lift_name}</p>
                            <p><strong>Client:</strong> {assignModal.project.client}</p>
                            <p><strong>Inspection Due:</strong> {assignModal.project.qaqc_inspection_date ? 
                                new Date(assignModal.project.qaqc_inspection_date).toLocaleDateString('en-GB') : 'Not set'}</p>
                        </div>
                        
                        <div className="tech-selection">
                            <label htmlFor="qaqc-tech-select">Select QAQC Technician:</label>
                            <span>Only available ones are listed</span>
                            <select 
                                id="qaqc-tech-select"
                                value={selectedTech.employee_id} 
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const tech = qaqcTechs.find(t => t.employee_id === selectedId);
                                    setSelectedTech(tech);
                                }}
                                className="tech-select"
                            >
                                <option value="">Choose a technician...</option>
                                {qaqcTechs.map(tech => (
                                    <option key={tech.employee_id} value={tech.employee_id}>
                                        {tech.first_name} {tech.last_name} ({tech.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {assignmentStatus === 'error' && (
                            <div className="status error">Error assigning technician. Please try again.</div>
                        )}
                        {assignmentStatus === 'Please select a QAQC technician' && (
                            <div className="status error">{assignmentStatus}</div>
                        )}
                        {assignmentStatus === 'success' && (
                            <div className="status success">Technician assigned successfully!</div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleAssignClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignConfirm} 
                                className="btn-confirm"
                                disabled={assignmentStatus === 'assigning' || assignmentStatus === 'success'}
                            >
                                {assignmentStatus === 'assigning' ? 'Assigning...' : 'Assign Technician'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
            {/* Header with Create Button and Search */}
            <div className='entry-section'>
                <h1>Project Info</h1>
                <div className='entry-info'>
                    <div className="info-item">
                    <strong>Project</strong>
                    <span>{selectedEntry.lift_name || 'No project selected'}</span>
                    </div>
                    <div className="info-item">
                    <strong>Current Phase</strong>
                    <span>{selectedEntry.status || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                    <strong>Current Task</strong>
                    <span>{selectedEntry.current_task || 'N/A'}</span>
                    </div>
                    {selectedEntry.qaqc_pending ? (
                    <div className="entry-qaqc-assignment">
                        <h3>QAQC Inspection Required</h3>
                        <p>This project needs QAQC inspection assigned</p>
                        <button 
                            className="assign-qaqc-btn"
                            onClick={() => handleAssignClick(selectedEntry)}
                        >
                            Assign QAQC Inspector
                        </button>
                    </div>
                    ) : selectedEntry.qaqc_is_assigned ? (
                    <div className="entry-qaqc-assigned">
                        <strong>QAQC Assigned</strong>
                        <span>Assigned to: {selectedEntry.qaqc ? `${selectedEntry.qaqc.last_name} ${selectedEntry.qaqc.first_name}` : 'Technician'}</span>
                        <span>Assigned on: {new Date(selectedEntry.qaqc_inspection_date).toLocaleDateString('en-GB')}</span>
                    </div>
                    ) : selectedEntry.qaqc_ongoing ? (
                        <div className="entry-qaqc-ongoing">
                            <strong>QAQC Ongoing</strong>
                            <span>Assigned to: {selectedEntry.qaqc ? `${selectedEntry.qaqc.last_name} ${selectedEntry.qaqc.first_name}` : 'Technician'}</span>
                            <span>Assigned on: {new Date(selectedEntry.qaqc_inspection_date).toLocaleDateString('en-GB')}</span>
                        </div>
                    ) : (
                    <div className="entry-no-inspection">
                        <strong>QAQC Status</strong>
                        <span>No inspection required at the moment</span>
                    </div>
                    )}
                </div>
            </div>
            
            <div className="projects-header">
                <div className="header-left">
                    <h1>QAQC Assignment</h1>
                    <div className="projects-count">
                        {projects.filter(p => p.qaqc_inspection_date && !p.qaqc_assign_date).length} projects need QAQC assignment
                    </div>
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
            <div className="project-table-header">
            <div className="table-row header-row">
                <div className="table-cell">Project & Client</div>
                <div className="table-cell">Progress</div>
                <div className="table-cell">Phase</div>
                <div className="table-cell">Current Task</div>
                <div className="table-cell">QAQC Reason</div>
                <div className="table-cell">QAQC Status</div>
                <div className="table-cell">QAQC Dates</div>
            </div>
            </div>

            {/* Project List */}
            <div>
                <QAQCList 
                    searchTerm={searchTerm} 
                    updateIsLoading={updateIsLoading} 
                    setSelectedEntry={setSelectedEntry}
                    onAssignClick={handleAssignClick}
                    manpower={manpower}
                    qaqcTechs={qaqcTechs}
                />
            </div>

            {/* No Results Message */}
            {filteredProjects.length === 0 && projects.length > 0 && (
                <div className="no-results">
                <p>No projects found matching "{searchTerm}"</p>
                <button onClick={handleClearSearch} className="clear-search-link">
                    Clear search
                </button>
                </div>
            )}
        </div>
    )
}

export default QAQCAssignment