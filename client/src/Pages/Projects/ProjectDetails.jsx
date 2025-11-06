import { useEffect, useState } from 'react'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useNavigate, useParams } from 'react-router-dom' 
import { Axios } from '../../api/axios.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"
import TaskOverviewSection from '../../components/Project/TaskOverviewSection.jsx'


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
    projectCompleted, currentTask, projectExists, proj, setFormData, formData, teamInfo, projIsLoading, teamIsLoading,
    saveStatus, handleSave, isEditing, errors, handleInputChange, handleNumberInputChange, handleBlur, handleSubmit,
    values, setIsEditing, handleCancel, photos, photosIsLoading, backendURL, setActivePage, currentTaskPhase, currentParentTask,
    projectedTask, isBehindSchedule, onHold, taskIsLoading
}) => {
    console.log(projectedTask)
    console.log(currentParentTask)
    console.log(currentTask)
    console.log(proj)
    const {projId} = useParams()
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
     const [isDataFinalized, setIsDataFinalized] = useState(false)
    const handleTaskDetails = () => () => {
        setActivePage('task')
    }

    const handleResumeProject = () => {
        // Open the modal instead of directly resuming
        setIsResumeModalOpen(true)
    }

    useEffect(() => {
        // Check if all critical data is loaded and conditions are finalized
        if (!projIsLoading && !taskIsLoading && proj && currentTask !== undefined && onHold !== undefined) {
            setIsDataFinalized(true)
        }
    }, [projIsLoading, taskIsLoading, proj, currentTask, onHold])

    const confirmResumeProject = async () => {
        // Add your resume project logic here
        console.log('Resuming project:', proj.id)
        // Example: API call to update project status
        const response = await Axios.put(`api/projects/resume/${proj.id}`)
        if (!response?.data.success) {
            window.alert('Project is now resumed')
        } else {
            window.alert('success')
            console.log(response.data.result)
            //window.location.reload()
        }
        // Close modal after action
        setIsResumeModalOpen(false)
        // You might want to refresh the project data here
    }

    const navigate = useNavigate()
    
    useEffect(() => {
        if (proj !== undefined) {
            setFormData(proj)
            // setIsLoading(false)
        }
    }, [proj, formData, teamInfo, projIsLoading, setFormData, photos, photosIsLoading])

    const handleCreateSchedule = () => {
        navigate(`/projects/${projId}/custom`) 
    }

//  || tasksIsLoading || projectExists === 'loading'
// isLoading || teamIsLoading 
    if (projIsLoading || taskIsLoading || !isDataFinalized) {
        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }

    return (
        <div className="Content ProjectDetails">
            {saveStatus === 'success' && <div className="status success">Project updated successfully!</div>}
                {saveStatus === 'error' && <div className="status error">Error updating project</div>}

                
           
<TaskOverviewSection
  onHold={onHold}
  isBehindSchedule={isBehindSchedule}
  projectedTask={projectedTask}
  currentParentTask={currentParentTask}
  proj={proj}
  onResumeProject={handleResumeProject}
  onTaskDetails={handleTaskDetails()}
  role={sessionStorage.getItem('roles')}
  // New props
  projectCompleted={projectCompleted}
  projectExists={projectExists}
  currentTask={currentTask}
  currentTaskPhase={currentTaskPhase}
  onCreateSchedule={handleCreateSchedule}
/>


            {!proj.on_hold ? (
                <>
                <div className="project-form">
                    
                    <div className="form-section">
                                           {(sessionStorage.getItem('roles') === 'Project Engineer' || 
                        sessionStorage.getItem('roles') === 'Project Manager') && 
                                <div className="action-buttons">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)}>Edit</button>
                                ) : (
                                    <>
                                        <button onClick={handleSubmit(handleSave)} disabled={saveStatus === 'saving'}>
                                            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                                        </button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                )}                
                        </div>
                    }
                        <h3>Basic Information</h3>
                        <div className="form-row">
                            <label>Project ID: {values.id}</label>
                            <label>Client: {values.client}</label>
                            <label>Region: {values.region}</label>
                            <label>Province: {values['province']}</label>
                            <label>City/Municipality: {values['city/municipality']}</label>
                            <label>Lift Name:</label>
                            <input
                                type="text"
                                name="lift_name"
                                value={values.lift_name || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                onBlur={handleBlur}
                            />
                            {errors && <span className='missing'>{errors.lift_name}</span>}

                        </div>
                        <div className="form-row">
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={values.description || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                onBlur={handleBlur}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Specifications</h3>
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Capacity:</label>
                                <input
                                    type="number"
                                    name="cap"
                                    value={values.cap || ''}
                                    onChange={handleNumberInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.cap}</span>}
                            </div>
                            <div className="form-row">
                                <label>Speed:</label>
                                <input
                                    type="number"
                                    name="speed"
                                    value={values.speed || ''}
                                    onChange={handleNumberInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.speed}</span>}
                            </div>
                            <div className="form-row">
                                <label>Stops:</label>
                                <input
                                    type="text"
                                    name="stops"
                                    value={values.stops || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.stops}</span>}
                            </div>
                            <div className="form-row">
                                <label>Travel (m):</label>
                                <input
                                    type="text"
                                    name="travel"
                                    value={values.travel || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.travel}</span>}
                            </div>
                            <div className="form-row">
                                <label>Overhead Height:</label>
                                <input
                                    type="number"
                                    name="overhead_height"
                                    value={values.overhead_height || ''}
                                    onChange={handleNumberInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.overhead_height}</span>}
                            </div>
                            <div className="form-row">
                                <label>Pit Depth:</label>
                                <input
                                    type="number"
                                    name="pit_depth"
                                    value={values.pit_depth || ''}
                                    onChange={handleNumberInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                                {errors && <span className='missing'>{errors.pit_depth}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Team Information</h3>
                        {teamIsLoading ? (
                            <Grid size="40" speed="1.5" color="rgba(84, 176, 210, 1)" />
                        ) : teamInfo[0] === undefined ? (
                            <>
                                <p>No team assigned</p>
                                <button onClick={() => navigate(`/projects/${proj.id}/team`)}>Assign Team</button>
                            </>
                        ) : (
                            <>
                                <div className="form-row">
                                    <label>Project Engineer:</label>
                                    <span>{teamInfo[0].pe_username === null ? (
                                        <button onClick={() => navigate(`/projects/${proj.id}/team`)}>Assign Project Engineer</button>
                                    ) : (
                                        teamInfo[0].pe_username
                                    )}</span>
                                    <label>Foreman:</label>
                                    <span>{teamInfo[0].Foreman}</span>
                                </div>
                                <div className="form-row">
                                    <label>Team Members:</label>
                                    <div className="team-members">
                                        {teamInfo.map((member, index) => (
                                            <span key={index} className="member-tag"
                                            onClick={
                                                () => navigate(`/technician/${member.empe_id}`)
                                            }
                                            style={{'cursor': 'pointer'}}
                                            >
                                                {member.e_username}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="form-section">
                        <h3>Dates</h3>
                        <div className="form-grid">
                            <div className="form-row">
                                <label>Created At:</label>
                                <span>{new Date(values.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="form-row">
                                <label>Manufacturing End:</label>
                                <input
                                    type="date"
                                    name="manufacturing_end_date"
                                    value={values.manufacturing_end_date ? values.manufacturing_end_date.split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className="form-row">
                                <label>Targetted Project End:</label>
                                <input
                                    type="date"
                                    name="project_end_date"
                                    value={values.project_end_date ? values.project_end_date.split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>
                    </div>

                   
                    {
                        (photos.data && photos.data.length > 0) && (
                            <div className="form-section">
                                <h3>Contract</h3>
                                <div className='attachments-list'>
                                    attachments here
                                    {console.log(photos.data)}
                                    {photos.data.map((p, index) => (
                                        <img
                                        src={`${backendURL}${p}`}
                                        alt={`Attachment ${index + 1}`}
                                        className="attachment-preview"
                                        onError={(e) => (e.target.style.display = 'none')}
                                        />                    
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    
                </div>      
  
                </>
            ) : (
                <>
                </>
            )}        
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