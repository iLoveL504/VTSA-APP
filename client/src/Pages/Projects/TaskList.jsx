import React, { useState, useRef, useEffect } from 'react'
import '../../css/TaskList.css'

const TaskList = ({ projSched, taskPhotos, currentTask }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [selectedTask, setSelectedTask] = useState(null)
    const taskListRef = useRef(null)
    const avoidPhotos = [100, 200, 300, 400]
    console.log(taskPhotos)
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
        }
    }

    // Find current task based on today's date
    const findCurrentTask = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return projSched.find(task => {
            if (getTaskTypeClass(task) !== 'task') return false
            
            const startDate = new Date(task.task_start)
            const endDate = new Date(task.task_end)
            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(0, 0, 0, 0)

            return today >= startDate && today <= endDate
        })
    }

    // Auto-scroll to current task
    useEffect(() => {
        const currentTask = findCurrentTask()
        if (currentTask && taskListRef.current) {
            const taskElement = taskListRef.current.querySelector(`[data-task-id="${currentTask.task_id}"]`)
            if (taskElement) {
                taskElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                })
                
                // Add highlight effect
                taskElement.classList.add('current-task')
                setTimeout(() => {
                    taskElement.classList.remove('current-task')
                }, 3000)
            }
        }
    }, [projSched])

    const isTaskComplete = (task) => {
        return task.task_done === 1
    }
    console.log(currentTask)
    const isTaskCurrent = (task) => {
        
        return task.task_id === currentTask.task_id
    }

    return (
        <div className="Content TaskList">
            <div className="task-list-container">
                <div className='task-list-section' ref={taskListRef}>
                    <h4>Task List</h4>
                    <div className="task-items">
                        {projSched.map((task, index) => (
                            <div 
                                key={index} 
                                data-task-id={task.task_id}
                                className={`task-item ${getTaskTypeClass(task)} ${selectedTask === task.task_id ? 'selected' : ''} ${
                                    isTaskComplete(task) ? 'completed' : ''
                                } ${isTaskCurrent(task) ? 'current' : ''}`}
                                onClick={() => handleTaskClick(task)}
                            >
                                {/* Completion Indicator */}

                                {/* Current Task Indicator */}
                                {isTaskCurrent(task) && (
                                    <div className="current-task-indicator">
                                        <span>Today's Task</span>
                                    </div>
                                )}

                                <div className='task-header'>
                                {getTaskTypeClass(task) === 'task' && (
                                    <div className="completion-indicator">
                                        {isTaskComplete(task) ? (
                                            <div className="completed-badge">
                                                ✅
                                            </div>
                                        ) : (
                                            <div className="in-progress-badge">
                                                🔄
                                            </div>
                                        )}
                                    </div>
                                )}

                                    <div className='task-name'>{task.task_name}</div>
                                </div>
                                
                                <div className="task-meta">
                                    <span className="task-dates">
                                        {formatDate(task.task_start)} - {formatDate(task.task_end)}
                                    </span>
                                    <span className="task-duration">{task.task_duration} days</span>
                                </div>

                                {(getTaskTypeClass(task) === 'task' && (!avoidPhotos.includes(task.task_parent))) && (
                                    <div className="task-photos-preview">
                                        {getTaskPhotos(task.task_id).length > 0 ? (
                                            <div className="photos-count">
                                                📷 {getTaskPhotos(task.task_id).length} photos
                                            </div>
                                        ) : (
                                            <div className="no-photos">No photos</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className='task-details-section'>
                    <h4>Task Details</h4>
                    {selectedTask ? (
                        <div className="task-details">
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
                    ) : (
                        <div className="no-task-selected">
                            <p>Select a task to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskList