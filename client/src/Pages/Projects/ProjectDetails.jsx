import { useEffect, useState } from 'react'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useNavigate, useParams } from 'react-router-dom' 
import { Axios } from '../../api/axios.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"

// Modal Component
const ScheduleModal = ({ isOpen, onClose, onChoice }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Project Schedule</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p>How would you like to create the schedule?</p>
          
          <div className="schedule-options">
            <div className="schedule-option" onClick={() => onChoice('default')}>
              <div className="option-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="option-content">
                <h4>Use Default Schedule</h4>
                <p>Quick setup with pre-defined tasks and timelines</p>
              </div>
            </div>
            
            <div className="schedule-option" onClick={() => onChoice('custom')}>
              <div className="option-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <div className="option-content">
                <h4>Customize Schedule</h4>
                <p>Create a tailored schedule with custom tasks and timelines</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = ({
    projectCompleted, currentTask, currentParentTask, currentIsLoading, projectExists, fetchedData, proj, setFormData, formData, teamInfo, projIsLoading, teamIsLoading,
    saveStatus, handleSave, isEditing, errors, handleInputChange, handleNumberInputChange, handleBlur, handleSubmit,
    values, setIsEditing, handleCancel
}) => {
    console.log(teamIsLoading)
    const {projId} = useParams()
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const handleTaskComplete =  (task) => async () => {
        try {
            console.log(fetchedData)
            console.log(task)
            let percentCompleted = 0
            let taskUpdates = []
            for(const t in fetchedData) {
                percentCompleted += fetchedData[t].task_percent
                taskUpdates.push(fetchedData[t])
                taskUpdates[t].task_done = 1
                if (fetchedData[t].task_name === task.task_name) break
            }
            console.log(taskUpdates)
            console.log(percentCompleted)

            const payload = {
                taskUpdates,
                percentCompleted
            }
            await Axios.put(`/api/projects/schedule/${projId}`, payload)
            //window.location.reload()
        } catch (e) {
            console.log(e)
        } 
        // const t = task.split('_date')[0]
        // const task_done = t + '_done'
        // console.log(task_done)
        // const payload = {
        //     id: Number(projId),
        //     task: task_done
        // }
        // await Axios.put(`/projects/schedule/${projId}`, payload)


    }

    const navigate = useNavigate()
    
    useEffect(() => {
        if (proj !== undefined) {
            console.log(proj)
            setFormData(proj)
            // setIsLoading(false)
        }
    }, [proj, formData, teamInfo, projIsLoading, setFormData])

    const handleCreateSchedule = () => {
        setShowScheduleModal(true)
    }

    const handleScheduleChoice = (choice) => {
        setShowScheduleModal(false)
        if (choice === 'default') {
            // Navigate to default schedule creation
            navigate(`schedule`) // or your default schedule route
        } else {
            // Navigate to custom schedule creation
            navigate(`/projects/${projId}/custom`) // or your custom schedule route
        }
    }
//  || tasksIsLoading || projectExists === 'loading'
// isLoading || teamIsLoading 
    console.log(teamIsLoading || currentIsLoading)
    if (projIsLoading) {
        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }
console.log(currentTask)
    return (
        <div className="Content ProjectDetails">
            {console.log(teamInfo)}
            {/* Schedule Modal */}
            <ScheduleModal 
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onChoice={handleScheduleChoice}
            />
            
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
            {saveStatus === 'success' && <div className="status success">Project updated successfully!</div>}
                {saveStatus === 'error' && <div className="status error">Error updating project</div>}
                            <ScheduleModal 
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onChoice={handleScheduleChoice}
            />
            
                <div className="task-overview-section">
                <h3>Task Overview</h3>
                <div className="task-cards-container">
                    {
                        projectCompleted ? (
                            <div>Project Completed</div>
                        ) :
                        projectExists ? (
                            <>
                                <div className="task-card current-task-card">
                                <div className="task-card-header">
                                    <h4>Current Task</h4>
                                    <span className="priority-badge">ACTIVE</span>
                                </div>
                                {currentTask && Object.keys(currentTask).length > 0 ? (
                                    <div className="task-card-content">
                                        <div className="task-name">
                                            {currentTask.task_name}
                                            <button 
                                                className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
                                                onClick={handleTaskComplete(currentTask)}
                                             disabled={currentTask.task_done === 1 || sessionStorage.getItem('roles') !== 'Project Engineer'} 
                                            >
                                                <i className="fas fa-check"></i>
                                                {currentTask.task_done === 1 ? 'Completed' : 
                                                sessionStorage.getItem('roles') === 'Project Engineer' ? 'Mark Complete' : 'Pending'}
                                            </button>
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
                            <div className="task-card parent-task-card">
                                <div className="task-card-header">
                                    <h4>Parent Project</h4>
                                    <span className="project-badge">OVERVIEW</span>
                                </div>
                                {currentParentTask && Object.keys(currentParentTask).length > 0 ? (
                                    <div className="task-card-content">
                                        <div className="task-name">{currentParentTask.task_name}</div>
                                        <div className="task-dates">
                                            <div className="task-date">
                                                <i className="fas fa-play-circle"></i>
                                                Start: {new Date(currentParentTask.task_start).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-date">
                                                <i className="fas fa-flag-checkered"></i>
                                                End: {new Date(currentParentTask.task_end).toLocaleDateString("en-GB")}
                                            </div>
                                            <div className="task-duration">
                                                <i className="fas fa-clock"></i>
                                                Duration: {currentParentTask.task_duration} days
                                            </div>
                                        </div>
                                        <div className="task-progress">
                                     
                                            <span>{((currentParentTask.task_done || 0) * 100).toFixed(0)}% Complete</span>
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
                                    <button onClick={handleCreateSchedule}>Create Schedule</button>
                                </div>
                            )
                    }
                </div>
            </div>

                <div className="project-form">
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-row">
                            <label>Project ID: {values.id}</label>
                            <label>{values.region}</label>
                            <label>{values['province/municipality']}</label>
                            <label>{values.city}</label>
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
                </div>
        </div>
  )
}

export default ProjectDetails