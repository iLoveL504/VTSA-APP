import { useEffect } from 'react'
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useNavigate, useParams } from 'react-router-dom' 
import { Axios } from '../../api/axios.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"


const ProjectDetails = ({
    currentTask, proj, setFormData, setIsLoading, formData, teamInfo, isLoading, teamIsLoading, tasksIsLoading,
    saveStatus, handleSave, isEditing, errors, handleInputChange, handleNumberInputChange, handleBlur, handleSubmit,
    tasksFetchError, values, setIsEditing, handleCancel, findReverseTaskName
}) => {
    const {projId} = useParams()
    const handleTaskComplete =  (task) => async () => {

        const t = task.split('_date')[0]
        const task_done = t + '_done'
        console.log(task_done)
        const payload = {
            task: task_done
        }
        await Axios.put(`/projects/schedule/${projId}`, payload)
        window.location.reload()
    }

    const navigate = useNavigate()
    useEffect(() => {
        if (proj !== undefined) {
            console.log(proj)
            setFormData(proj)
            setIsLoading(false)
        }
    }, [proj, formData, teamInfo])

    

    if (isLoading || teamIsLoading || tasksIsLoading) {
        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }

    return (
        <div className="Content ProjectDetails">
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
                <div className="form-section current-task-section">
                    <h3>Current Task</h3>
                    {currentTask && !tasksFetchError ? (
                        <div className="current-task-card">
                            <div className="task-name">{currentTask.name} 
                                <button className={`complete-btn ${currentTask.done === 1  ? 'completed': ''}`} 
                                style={{
                                    display: Object.keys(currentTask).length === 0 ? 'none' : 'block'
                                }} onClick={handleTaskComplete(findReverseTaskName(currentTask.name))}>
                                    <i className="fas fa-check"></i>
                                    Mark Complete
                                </button>
                            </div>
                            <div className="task-date">
                                Scheduled: {currentTask.date}
                            </div>
                            <div className="task-date">
                                End: {currentTask.end_date}
                                {console.log(Object.keys(currentTask).length)}
                            </div>
                            
                        </div>
                    ) : (
                        <div className="current-task-card">
                            <div className="task-name">No current tasks scheduled</div>
                            <div className="task-date">All tasks are completed or not scheduled yet</div>
                        </div>
                    )}
                </div>

                <div className="project-form">
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-row">
                            <label>Project ID: {values.id}</label>
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
                                    <label>Foreman:</label>
                                    <span>{teamInfo[0].Foreman}</span>
                                </div>
                                <div className="form-row">
                                    <label>Team Members:</label>
                                    <div className="team-members">
                                        {teamInfo.map((member, index) => (
                                            <span key={index} className="member-tag"
                                            onClick={
                                                () => navigate(`/technician/${member.employee_id}`)
                                            }
                                            style={{'cursor': 'pointer'}}
                                            >
                                                {member.full_name}
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