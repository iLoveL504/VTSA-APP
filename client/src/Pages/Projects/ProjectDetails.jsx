import { useEffect } from 'react'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useNavigate, useParams } from 'react-router-dom' 
import { Axios } from '../../api/axios.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"


const ProjectDetails = ({
    projectCompleted, currentTask, projectExists, proj, setFormData, formData, teamInfo, projIsLoading, teamIsLoading,
    saveStatus, handleSave, isEditing, errors, handleInputChange, handleNumberInputChange, handleBlur, handleSubmit,
    values, setIsEditing, handleCancel, photos, photosIsLoading, backendURL, setActivePage, currentTaskPhase, currentParentTask,
    projectedTask, isBehindSchedule
}) => {

    const {projId} = useParams()

    const handleTaskDetails = () => () => {
        setActivePage('task')
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
    if (projIsLoading) {
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

                
            
                <div className="task-overview-section">
                <h3>Task Overview</h3>
                {/* Warning is progress is lagging behind*/}
                {isBehindSchedule && (
                    <div className="lagging-task-info">
                        <h2>Lagging behind schedule </h2>
                        <div className="lagging-task-title">
                            <strong>Projected Task:</strong> {projectedTask.task_name} 
                        </div>    
                        <div className="lagging-task-dates">
                            {new Date(projectedTask.task_start).toLocaleDateString("en-GB")} - {new Date(currentParentTask.task_end).toLocaleDateString("en-GB")} 
                            ({projectedTask.task_duration} days) • 
                        </div>                    
                    </div>
                )}
                    {/* Overarching Task Display - Simple Text */}
                {currentParentTask && Object.keys(currentParentTask).length > 0 && (
                    <div className="overarching-task-info">
                        <div className="overarching-task-title">
                            <strong>Current Phase:</strong> {currentParentTask.task_name}
                        </div>
                        <div className="overarching-task-dates">
                            {new Date(currentParentTask.task_start).toLocaleDateString("en-GB")} - {new Date(currentParentTask.task_end).toLocaleDateString("en-GB")} 
                            ({currentParentTask.task_duration} days) • 
                        </div>
                    </div>
                )}
                {/* QAQC Technician Task Pad*/}
                {
                    sessionStorage.getItem('roles') === 'QAQC' ? (
                        <div className="overarching-task-info">
                            <h3>QAQC Inspection:</h3>
                            {proj.qaqc_inspection_reason}
                            <button onClick={handleTaskDetails()}>
                                Proceed with QAQC Inspection
                            </button>
                        </div>
                    ) : (
                        <>
                        {proj.qaqc_inspection_date !== null && (
                            <div className="overarching-task-info">
                                <h3>QAQC Inspection</h3>
                            </div>                        
                        )}                
                        </>
                    )
                }
            {console.log(currentTask)}
                <div className="task-cards-container">
                    {
                        projectCompleted ? (
                            <div>Project Completed</div>
                        ) :
                        projectExists ? (
                            <>
                                <div className="task-card current-task-card" onClick={handleTaskDetails()}>
                                <div className="task-card-header">
                                    <h4>Current Task</h4>
                                    <span className="priority-badge">ACTIVE</span>
                                </div>
                                {currentTask && Object.keys(currentTask).length > 0 ? (
                                    <div className="task-card-content">
                                        <div className="task-name">
                                            {currentTask.task_name}
                                            {sessionStorage.getItem('roles') === 'Project Engineer' ? (
                                            
                                                <button 
                                                    className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
                                                    disabled={currentTask.task_done === 1 || sessionStorage.getItem('roles') !== 'Project Engineer' || currentTask.task_approval === 0} 
                                                >
                                                    <i className="fas fa-check"></i>
                                                    {currentTask.task_done === 1 ? 'Completed' : 
                                                    sessionStorage.getItem('roles') === 'Project Engineer' ? 'Mark Complete' : 'Pending'}
                                                </button>                                                
                                            ) : sessionStorage.getItem('roles') === 'Foreman' ? (
                                                //Foreman button
                                                <button 
                                                    className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
                                                    disabled={currentTask.task_approval === 1} 
                                                >
                                                    <i className="fas fa-check"></i>
                                                    {currentTask.task_done === 1 ? 'Completed' : currentTask.task_approval === 1 ? 'Confirmation Pending'
                                                    : 'Task Done'}
                                                </button>                                               
                                            ) : (
                                                //View
                                                <button 
                                                    className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
                                                >
                                                    <i className="fas fa-check"></i>
                                                    {currentTask.task_done === 1 ? 'Completed' : 
                                                    sessionStorage.getItem('roles') === 'Project Engineer' ? 'Mark Complete' : 'Pending'}
                                                </button> 
                                            )}

                                        </div>
                                        <div className="task-dates">
                                            <div className="task-date">
                                                <i className="fas fa-play-circle"></i>
                                                Start: {new Date(currentTask.task_start).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-date">
                                                <i className="fas fa-flag-checkered"></i>
                                                End: {new Date(currentTask.task_end).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-duration">
                                                <i className="fas fa-clock"></i>
                                                Duration: {currentTask.task_duration} days
                                            </div>
                                        </div>
                                        <div className="task-progress">
                                  
                                            <span>Progress Contribution: {currentTask.task_percent}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="task-empty-state">
                                        <i className="fas fa-check-circle"></i>
                                        <div className="empty-message">No current tasks scheduled</div>
                                        <div className="empty-submessage">All tasks are completed or not scheduled yet</div>
                                    </div>
                                )}
                            </div>

                            {/* Parent Task Card */}
                            <div className="task-card parent-task-card" onClick={handleTaskDetails()}>
                                <div className="task-card-header">
                                    <h4>Parent Project</h4>
                                    <span className="project-badge">OVERVIEW</span>
                                </div>
                                {currentTaskPhase && Object.keys(currentTaskPhase).length > 0 ? (
                                    <div className="task-card-content">
                                        <div className="task-name">{currentTaskPhase.task_name}</div>
                                        <div className="task-dates">
                                            <div className="task-date">
                                                <i className="fas fa-play-circle"></i>
                                                Start: {new Date(currentTaskPhase.task_start).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-date">
                                                <i className="fas fa-flag-checkered"></i>
                                                End: {new Date(currentTaskPhase.task_end).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-duration">
                                                <i className="fas fa-clock"></i>
                                                Duration: {currentTaskPhase.task_duration} days
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="task-empty-state">
                                        <i className="fas fa-project-diagram"></i>
                                        <div className="empty-message">No parent project</div>
                                        <div className="empty-submessage">This task is standalone</div>
                                    </div>
                                )}
                            </div>
                            </>
                        ) : (
                                <div className='no-schedule-card'>
                                    {
                                        sessionStorage.getItem('roles') === 'Project Engineer' ? (
                                            <button onClick={handleCreateSchedule}>Create Schedule</button>
                                        ) : (<div>Schedule to be created</div>)
                                    }
                                    
                                </div>
                            )
                    }
                </div>
            </div>
 

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
                            <label>Region: {values.region}</label>
                            <label>Province: {values['province/municipality']}</label>
                            <label>City/Municipality: {values.city}</label>
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
                                    type="number"
                                    name="stops"
                                    value={values.stops || ''}
                                    onChange={handleNumberInputChange}
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
        </div>
  )
}

export default ProjectDetails