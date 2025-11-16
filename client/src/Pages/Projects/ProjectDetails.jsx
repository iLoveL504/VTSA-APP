import { useEffect, useState } from 'react'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useNavigate } from 'react-router-dom' 
import { Axios } from '../../api/axios.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"
import '../../css/ProjectDetails.css'
import { useSharedSocket } from '../../Context/SocketContext.js'

// Material-UI Icons
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Engineering as EngineeringIcon,
  Groups as GroupsIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const ResumeProjectModal = ({ isOpen, onClose, onConfirm, project }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Resume Project</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to resume the project <strong>{project?.lift_name}</strong>?</p>
          <div className="project-info">
            <strong>Project:</strong> {project?.lift_name}<br/>
            <strong>ID:</strong> #{project?.id}<br/>
            <strong>Current Status:</strong> Pending
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Resume Project</button>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({
    proj, setFormData, teamInfo, teamIsLoading,
    saveStatus, handleSave, isEditing, errors, handleInputChange, handleNumberInputChange, handleBlur, handleSubmit,
    values, setIsEditing, handleCancel, photos, backendURL, 
    dataLoaded
}) => {
    //const {projId} = useParams()
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
    const {utilitiesSocket} = useSharedSocket()
    const navigate = useNavigate()


    const confirmResumeProject = async () => {
        console.log('Resuming project:', proj.id)
        const response = await Axios.put(`api/projects/resume/${proj.id}`)
        if (!response?.data.success) {
            window.alert('Project is now resumed')
        } else {
            window.alert('success')
            console.log(response.data.result)
        }
        utilitiesSocket.emit('refresh_all_projects')
        setIsResumeModalOpen(false)
    }

    useEffect(() => {
        if (proj && Object.keys(proj).length > 0) {
            setFormData(proj)
        }
    }, [proj, setFormData])

    // const handleCreateSchedule = () => {
    //     navigate(`/projects/${projId}/custom`) 
    // }


    if(!proj.schedule_created || proj.will_resume) {
        if (!dataLoaded) {
            return (
                <div className="loading-container">
                    <div className="loading-content">
                        <Grid size="60" speed="1.5" color="#315a95" />
                        <p>Loading project details...</p>
                    </div>
                </div>
            )            
        }
    }

    if ((!proj || Object.keys(proj).length === 0 && !dataLoaded)) {
        return (
            <div className="no-data-container">
                <WarningIcon className="no-data-icon" />
                <h3>No Project Data Available</h3>
                <p>The project details could not be loaded.</p>
            </div>
        )
    }

    return (
        <div className="Content ProjectDetails">
            {/* Status Messages */}
            {saveStatus === 'success' && (
                <div className="status-message success">
                    <CheckCircleIcon className="status-icon" />
                    Project updated successfully!
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="status-message error">
                    <WarningIcon className="status-icon" />
                    Error updating project
                </div>
            )}

            {/* Header Section */}
            <div className="project-header">
                <div className="header-content">
                    <BusinessIcon style={{ color: "#ffffffff" }} />
                    <div className="project-title">
                        <h1>{values.lift_name || 'Unnamed Project'}</h1>
                        <div className="project-meta">
                            <span className="project-id">#{values.id}</span>
                            <span className="project-client">{values.client}</span>
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                {(sessionStorage.getItem('roles') === 'Project Engineer' || 
                  sessionStorage.getItem('roles') === 'Project Manager') && (
                    <div className="action-buttons">
                        {!isEditing ? (
                            <button 
                                className="btn-edit"
                                onClick={() => setIsEditing(true)}
                            >
                                <EditIcon className="btn-icon" />
                                Edit Details
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button 
                                    className="btn-save"
                                    onClick={handleSubmit(handleSave)} 
                                    disabled={saveStatus === 'saving'}
                                >
                                    {saveStatus === 'saving' ? (
                                        <>
                                            <Grid size="20" speed="1.5" color="#ffffff" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <SaveIcon className="btn-icon" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="btn-cancel"
                                    onClick={handleCancel}
                                >
                                    <CancelIcon className="btn-icon" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="project-content-grid">
                {/* Left Column - Basic Info & Specifications */}
                <div className="content-column">
                    {/* Basic Information Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <DescriptionIcon className="card-icon" />
                            <h3>Basic Information</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Lift Name</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lift_name"
                                            value={values.lift_name || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.lift_name ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="info-value">{values.lift_name || 'Not specified'}</span>
                                    )}
                                    {errors?.lift_name && <span className="error-message">{errors.lift_name}</span>}
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Description</span>
                                    {isEditing ? (
                                        <textarea
                                            name="description"
                                            value={values.description || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            rows={3}
                                            className="description-textarea"
                                        />
                                    ) : (
                                        <span className="info-value description">
                                            {values.description || 'No description provided'}
                                        </span>
                                    )}
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Region</span>
                                    <span className="info-value">{values.region || 'Not specified'}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Province</span>
                                    <span className="info-value">{values.province || 'Not specified'}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">City/Municipality</span>
                                    <span className="info-value">{values['city/municipality'] || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specifications Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <BuildIcon className="card-icon" />
                            <h3>Specifications</h3>
                        </div>
                        <div className="card-content">
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <div className="spec-header">
                                        <SpeedIcon className="spec-icon" />
                                        <span className="spec-label">Capacity</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="cap"
                                            value={values.cap || ''}
                                            onChange={handleNumberInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.cap ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.cap ? `${values.cap} kg` : 'Not specified'}</span>
                                    )}
                                    {errors?.cap && <span className="error-message">{errors.cap}</span>}
                                </div>

                                <div className="spec-item">
                                    <div className="spec-header">
                                        <SpeedIcon className="spec-icon" />
                                        <span className="spec-label">Speed</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="speed"
                                            value={values.speed || ''}
                                            onChange={handleNumberInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.speed ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.speed ? `${values.speed} m/min` : 'Not specified'}</span>
                                    )}
                                    {errors?.speed && <span className="error-message">{errors.speed}</span>}
                                </div>

                                <div className="spec-item">
                                    <div className="spec-header">
                                        <AssignmentIcon className="spec-icon" />
                                        <span className="spec-label">Stops</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="stops"
                                            value={values.stops || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.stops ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.stops || 'Not specified'}</span>
                                    )}
                                    {errors?.stops && <span className="error-message">{errors.stops}</span>}
                                </div>

                                <div className="spec-item">
                                    <div className="spec-header">
                                        <LocationIcon className="spec-icon" />
                                        <span className="spec-label">Travel</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="travel"
                                            value={values.travel || ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.travel ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.travel ? `${values.travel} m` : 'Not specified'}</span>
                                    )}
                                    {errors?.travel && <span className="error-message">{errors.travel}</span>}
                                </div>

                                <div className="spec-item">
                                    <div className="spec-header">
                                        <BuildIcon className="spec-icon" />
                                        <span className="spec-label">Overhead Height</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="overhead_height"
                                            value={values.overhead_height || ''}
                                            onChange={handleNumberInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.overhead_height ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.overhead_height ? `${values.overhead_height} m` : 'Not specified'}</span>
                                    )}
                                    {errors?.overhead_height && <span className="error-message">{errors.overhead_height}</span>}
                                </div>

                                <div className="spec-item">
                                    <div className="spec-header">
                                        <BuildIcon className="spec-icon" />
                                        <span className="spec-label">Pit Depth</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="pit_depth"
                                            value={values.pit_depth || ''}
                                            onChange={handleNumberInputChange}
                                            onBlur={handleBlur}
                                            className={errors?.pit_depth ? 'error' : ''}
                                        />
                                    ) : (
                                        <span className="spec-value">{values.pit_depth ? `${values.pit_depth} m` : 'Not specified'}</span>
                                    )}
                                    {errors?.pit_depth && <span className="error-message">{errors.pit_depth}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Team, Dates, Attachments */}
                <div className="content-column">
                    {/* Team Information Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <GroupsIcon className="card-icon" />
                            <h3>Team Information</h3>
                        </div>
                        <div className="card-content">
                            {teamIsLoading ? (
                                <div className="loading-team">
                                    <Grid size="40" speed="1.5" color="#315a95" />
                                    <span>Loading team information...</span>
                                </div>
                            ) : teamInfo[0] === undefined ? (
                                <div className="no-team">
                                    <GroupsIcon className="no-team-icon" />
                                    <div className="no-team-content">
                                        <h4>No Team Assigned</h4>
                                        <p>This project doesn't have a team assigned yet.</p>
                                        <button 
                                            className="btn-assign-team"
                                            onClick={() => navigate(`/projects/${proj.id}/team`)}
                                        >
                                            Assign Team
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="team-details">
                                    <div className="team-leadership">
                                        <div className="team-member-card lead">
                                            <EngineeringIcon className="member-icon" />
                                            <div className="member-info">
                                                <span className="member-name">
                                                    {teamInfo[0].pe_username || 'Unassigned'}
                                                </span>
                                                <span className="member-role">Project Engineer</span>
                                            </div>
                                            {!teamInfo[0].pe_username && (
                                                <button 
                                                    className="btn-assign"
                                                    onClick={() => navigate(`/projects/${proj.id}/team`)}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </div>

                                        <div className="team-member-card lead">
                                            <PersonIcon className="member-icon" />
                                            <div className="member-info">
                                                <span className="member-name">
                                                    {teamInfo[0].Foreman || 'Unassigned'}
                                                </span>
                                                <span className="member-role">Foreman</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="team-members-section">
                                        <h4>Team Members ({teamInfo.length})</h4>
                                        <div className="team-members-grid">
                                            {teamInfo.map((member, index) => (
                                                <div 
                                                    key={index} 
                                                    className="team-member-card"
                                                    onClick={() => navigate(`/technician/${member.empe_id}`)}
                                                >
                                                    <PersonIcon className="member-icon" />
                                                    <div className="member-info">
                                                        <span className="member-name">{member.e_username}</span>
                                                        <span className="member-role">{member.job}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dates Card */}
                    <div className="info-card">
                        <div className="card-header">
                            <CalendarIcon className="card-icon" />
                            <h3>Project Timeline</h3>
                        </div>
                        <div className="card-content">
                            <div className="dates-grid">
                                <div className="date-item">
                                    <span className="date-label">Created At</span>
                                    <span className="date-value">
                                        {values.created_at ? new Date(values.created_at).toLocaleDateString() : 'Not available'}
                                    </span>
                                </div>
                                
                                <div className="date-item">
                                    <span className="date-label">Manufacturing End</span>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="manufacturing_end_date"
                                            value={values.manufacturing_end_date ? values.manufacturing_end_date.split('T')[0] : ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                    ) : (
                                        <span className="date-value">
                                            {values.manufacturing_end_date ? 
                                                new Date(values.manufacturing_end_date).toLocaleDateString() : 
                                                'Not scheduled'
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="date-item">
                                    <span className="date-label">Target Project End</span>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="project_end_date"
                                            value={values.project_end_date ? values.project_end_date.split('T')[0] : ''}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                    ) : (
                                        <span className="date-value">
                                            {values.project_end_date ? 
                                                new Date(values.project_end_date).toLocaleDateString() : 
                                                'Not scheduled'
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments Card */}
                    {photos.data && photos.data.length > 0 && (
                        <div className="info-card">
                            <div className="card-header">
                                <AttachFileIcon className="card-icon" />
                                <h3>Contract Documents</h3>
                            </div>
                            <div className="card-content">
                                <div className="attachments-grid">
                                    {photos.data.map((p, index) => (
                                        <div key={index} className="attachment-item">
                                            <img
                                                src={`${backendURL}${p}`}
                                                alt={`Contract document ${index + 1}`}
                                                className="attachment-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                            <div className="attachment-fallback">
                                                <AttachFileIcon className="attachment-icon" />
                                                <span>Document {index + 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Resume Project Modal */}
            <ResumeProjectModal 
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
                onConfirm={confirmResumeProject}
                project={proj}
            />
        </div>
    )
}

export default ProjectDetails