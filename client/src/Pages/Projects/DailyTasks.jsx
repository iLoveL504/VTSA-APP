import React, { useState, useEffect } from 'react';
import { Grid } from 'ldrs/react'
import { useNavigate } from 'react-router-dom'

const DailyTasks = ({ allTaskDates, tasksIsLoading }) => {
    const navigate = useNavigate()
    const handleReportClick = () => {
        navigate(`report`)
    }
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        if (allTaskDates && Array.isArray(allTaskDates)) {
            setTaskList(allTaskDates);
        }
    }, [allTaskDates]);

    const handleTaskToggle = (index) => {
        const updatedTasks = [...taskList];
        updatedTasks[index] = {
            ...updatedTasks[index],
            done: updatedTasks[index].done === 1 ? 0 : 1
        };
        setTaskList(updatedTasks);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (done) => {
        return done === 1 
            ? { text: 'Completed', class: 'completed' }
            : { text: 'Pending', class: 'pending' };
    };


    const completedTasks = taskList.filter(task => task.done === 1).length;
    const totalTasks = taskList.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (tasksIsLoading) {
        return (
            <div className="Loading">
                <p>Data is Loading...</p>
                <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
            </div>
        );
    }

    return (
        <div className='Content DailyTasks'>
            <div className="tasks-header">
                <h2>Project Tasks</h2>
                <div className="progress-summary">
                    <div className="progress-text">
                        {completedTasks} of {totalTasks} tasks completed
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="tasks-container">
                {taskList.length > 0 ? (
                    <div className="tasks-list-scrollable">
                        <div className="tasks-list">
                            {taskList.map((task, index) => {
                                const status = getStatusBadge(task.done);
                                return (
                                    <div key={index} className={`task-item ${task.done === 1 ? 'completed' : ''}`}>
                                        <div className="task-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={task.done === 1}
                                                onChange={() => handleTaskToggle(index)}
                                                id={`task-${index}`}
                                            />
                                            <label htmlFor={`task-${index}`} className="custom-checkbox"></label>
                                        </div>
                                        
                                        <div className="task-content">
                                            <div className="task-name">{task.name}</div>
                                            <div className="task-dates">
                                                <span className="date-item">
                                                    <i className="fas fa-calendar-start"></i>
                                                    {formatDate(task.date)}
                                                </span>
                                                <span className="date-item">
                                                    <i className="fas fa-calendar-end"></i>
                                                    {formatDate(task.end_date)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className={`task-status ${status.class}`}>
                                            {status.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="no-tasks">
                        <i className="fas fa-clipboard-list"></i>
                        <p>No tasks available for this project</p>
                    </div>
                )}
            </div>    

            <div className="tasks-actions">
                <button className="btn-primary">
                    <i className="fas fa-plus"></i>
                    Add New Task
                </button>
                <button className="btn-secondary">
                    <i className="fas fa-save"></i>
                    Save Changes
                </button>
            </div>

            {/* Floating Daily Report Button */}
            <button className="floating-report-btn" onClick={handleReportClick} style={{display: sessionStorage.getItem('roles') === 'Foreman' ? 'block' : 'none'}}>
                <i className="fas fa-file-alt"></i>
                Make Daily Report
            </button>
        </div>
    );
};

export default DailyTasks;