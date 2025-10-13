import React, { useState, useEffect } from 'react';
import { Grid } from 'ldrs/react'
import useAxiosFetch from "../../hooks/useAxiosFetch.js"
import {  useParams } from 'react-router-dom'
import '../../css/DailyTasks.css'

const DailyTasks = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const {projId} = useParams()
    console.log(projId)

    const {data: fetchedData, isLoading: isLoading} = useAxiosFetch(`${backendURL}/projects/schedule/${projId}`)
    // const handleReportClick = () => {
    //     navigate(`report`)
    // }
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        if (fetchedData && Array.isArray(fetchedData)) {
            setTaskList(fetchedData.filter(t => Number(t.task_id) >= 500));
        }
    }, [fetchedData]);

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
    console.log(taskList)
    const completedTasks = taskList.filter(task => task.done === 1).length;
    const totalTasks = taskList.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const handleTaskToggle = (index) => {
        const updatedTasks = [...taskList];
        updatedTasks[index] = {
            ...updatedTasks[index],
            done: updatedTasks[index].done === 1 ? 0 : 1
        };
        setTaskList(updatedTasks);
    };

    useEffect(() => {
        console.log(`${Math.trunc(progressPercentage)}%`)
    }, [progressPercentage])

    if (isLoading) {
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
                    <div className="tasks-table-wrapper">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th className="status-column">Status</th>
                                    <th className="task-column">Task Description</th>
                                    <th className="start-date-column">Start Date</th>
                                    <th className="end-date-column">End Date</th>
                                    <th className="actions-column">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taskList.map((task, index) => {
                                    const status = getStatusBadge(task.task_done);
                                    return (
                                        <tr key={index} className={`task-row ${task.task_done === 1 ? 'completed' : ''}`}>
                                            <td className="status-cell">
                                                <div className={`status-badge ${status.class}`}>
                                                    {status.text}
                                                </div>
                                            </td>
                                            <td className="task-cell">
                                                <div className="task-name">{task.task_name}</div>
                                            </td>
                                            <td className="date-cell">
                                                <div className="date-item">
                                                    <i className="fas fa-calendar-start"></i>
                                                    {formatDate(task.task_start)}
                                                </div>
                                            </td>
                                            <td className="date-cell">
                                                <div className="date-item">
                                                    <i className="fas fa-calendar-end"></i>
                                                    {formatDate(task.task_end)}
                                                </div>
                                            </td>
                                            <td className="actions-cell">
                                                <div className="task-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.task_done === 1}
                                                        onChange={() => handleTaskToggle(index)}
                                                        id={`task-${index}`}
                                                    />
                                                    <label htmlFor={`task-${index}`} className="custom-checkbox">
                                                        {task.task_done === 1 && '✓'}
                                                    </label>
                                                    <span className="checkbox-label">
                                                        {task.task_done === 1 ? 'Mark Pending' : 'Mark Complete'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-tasks">
                        <i className="fas fa-clipboard-list"></i>
                        <p>No tasks available for this project</p>
                    </div>
                )}
            </div>   

         
        </div>
    );
};

export default DailyTasks;