import React, { useState } from 'react'
import '../../css/TaskList.css'

const TaskList = ({ projSched, taskPhotos, currentTask }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [selectedTask, setSelectedTask] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const avoidPhotos = [100, 200, 300, 400]

    const getTaskPhotos = (taskId) => {
        return taskPhotos.filter(t => t.task_id === taskId).map(t => t.photo_url)
    }

    const getTaskDetails = (taskId) => {
        return projSched.find(task => task.task_id === taskId)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const calculateProgress = (task) => {
        if (task.task_done === 1) return 100
        return task.task_percent || 0
    }

    const getTaskTypeClass = (task) => {
        if (task.task_type === "summary" && task.task_parent === null) return 'phase'
        if (task.task_type === "summary" && task.task_parent !== null) return 'summary'
        return 'task'
    }

    const handleTaskClick = (task) => {
        if (getTaskTypeClass(task) === 'task') {
            setSelectedTask(task.task_id)
            setShowModal(true)
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedTask(null)
    }

    const isTaskComplete = (task) => {
        return task.task_done === 1
    }

    const isTaskCurrent = (task) => {
        return task.task_id === currentTask?.task_id
    }

    const getIndentation = (task) => {
        const type = getTaskTypeClass(task)
        if (type === 'phase') return '0px'
        if (type === 'summary') return '20px'
        return '40px'
    }

    // Filter out non-task items for the table if needed, or show all with different styling

    return (
        <div className="Content TaskList">
            <div className="task-table-container">
                <div className="task-table-section">
                    <h4>Task List</h4>
                    <div className="table-wrapper">
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th className="col-status">Status</th>
                                    <th className="col-task">Task Name</th>
                                    <th className="col-dates">Start Date</th>
                                    <th className="col-dates">End Date</th>
                                    <th className="col-duration">Duration</th>
                                    <th className="col-photos">Photos</th>
                                    <th className="col-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projSched.map((task, index) => (
                                    <tr 
                                        key={index}
                                        data-task-id={task.task_id}
                                        className={`task-row ${getTaskTypeClass(task)} ${
                                            isTaskComplete(task) ? 'completed' : ''
                                        } ${isTaskCurrent(task) ? 'current' : ''}`}
                                        style={{ paddingLeft: getIndentation(task) }}
                                    >
<td className="col-status">
    {getTaskTypeClass(task) === 'task' && (
        <div className="completion-indicator">
            {isTaskComplete(task) ? (
                <div className="completed-badge" title="Completed">
                    <i className="fas fa-check-circle"></i>
                </div>
            ) : (
                <div className="in-progress-badge" title="In Progress">
                    <i className="fas fa-sync-alt"></i>
                </div>
            )}
        </div>
    )}
    {isTaskCurrent(task) && (
        <div className="current-indicator" title="Today's Task">
            <i className="fas fa-flag"></i>
        </div>
    )}
</td>
                                        <td className="col-task">
                                            <div className="task-name-wrapper">
                                                <span 
                                                    className="task-name"
                                                    style={{ paddingLeft: getIndentation(task) }}
                                                >
                                                    {task.task_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="col-dates">
                                            {formatDate(task.task_start)}
                                        </td>
                                        <td className="col-dates">
                                            {formatDate(task.task_end)}
                                        </td>
                                        <td className="col-duration">
                                            <span className="duration-badge">
                                                {task.task_duration} days
                                            </span>
                                        </td>
                                        <td className="col-photos">
                                            {(getTaskTypeClass(task) === 'task' && (!avoidPhotos.includes(task.task_parent))) && (
                                                <div className="photos-count">
                                                    {getTaskPhotos(task.task_id).length > 0 ? (
                                                        <span className="has-photos">
                                                            <i className="fas fa-camera"></i> {getTaskPhotos(task.task_id).length}
                                                        </span>
                                                    ) : (
                                                        <span className="no-photos">-</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="col-actions">
                                            {getTaskTypeClass(task) === 'task' && (
                                                <button 
                                                    className="btn-view-details"
                                                    onClick={() => handleTaskClick(task)}
                                                >
                                                    View Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Task Details Modal */}
            {showModal && selectedTask && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Task Details</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            {(() => {
                                const task = getTaskDetails(selectedTask)
                                const photos = getTaskPhotos(selectedTask)
                                return (
                                    <>
                                        <div className="detail-header">
                                            <h3>{task.task_name}</h3>
                                            <div className={`task-badge ${task.task_done === 1 ? 'completed' : 'in-progress'}`}>
                                                {task.task_done === 1 ? 'Completed' : 'In Progress'}
                                            </div>
                                        </div>
                                        
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Start Date:</label>
                                                <span>{formatDate(task.task_start)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>End Date:</label>
                                                <span>{formatDate(task.task_end)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Duration:</label>
                                                <span>{task.task_duration} days</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Progress:</label>
                                                <span>{calculateProgress(task)}%</span>
                                            </div>
                                            {task.section_title && (
                                                <div className="detail-item full-width">
                                                    <label>Section:</label>
                                                    <span>{task.section_title}</span>
                                                </div>
                                            )}
                                            {task.description && (
                                                <div className="detail-item full-width">
                                                    <label>Description:</label>
                                                    <span>{task.description}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="photos-section">
                                            <h5>Photo Attachments ({photos.length})</h5>
                                            {photos.length > 0 ? (
                                                <div className="photos-grid">
                                                    {photos.map((photo, index) => (
                                                        <div key={index} className="photo-item">
                                                            <img 
                                                                src={`${backendURL}${photo}`} 
                                                                alt={`Task photo ${index + 1}`}
                                                                className="task-photo"
                                                            />
                                                            <div className="photo-actions">
                                                                <button className="btn-view">View</button>
                                                                <button className="btn-download">Download</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="no-photos-message">
                                                    No photos attached to this task
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskList