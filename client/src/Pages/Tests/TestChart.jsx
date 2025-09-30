import React, { useState, useMemo, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./TestChart.css";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { useLocation, useParams } from "react-router-dom";
import { Axios } from '../../api/axios';
import Queue from '../../DataStructs/Queue'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import defaultSchedule from "../../data/TasksData.js";

const TestChart = ({ id }) => {
    const location = useLocation();
    const { projId } = useParams()
    const [view, setView] = useState(ViewMode.Day);
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const { data: projInfo, fetchError: projFetchError, isLoading: projIsLoading } = useAxiosFetch(`${backendURL}/projects/${id}`);
    const [hasError, setHasError] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [displayTasks, setDisplayTasks] = useState([])
    
    const schedule = location.state?.schedule || defaultSchedule;

      const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };


    const tasks = useMemo(() => {
        try {
            const taskMap = schedule.map(task => {
                console.log(task)
                const isParent = task.type === "summary";

                const startDate = new Date(task.start);
                const endDate = new Date(task.end);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
                    console.error("Invalid task:", task);
                    return null;
                }

                return {
                    id: String(task.id),
                    name: task.text || `Task ${task.id}`,
                    start: startDate,
                    end: endDate,
                    progress: task.progress ?? 0,
                    project: task.parent || undefined,
                    type: isParent ? "project" : "task",
                    styles: {
                        progressColor: isParent ? "#1e3a8a" : "#15803d",
                        progressSelectedColor: isParent ? "#1d4ed8" : "#166534",
                        backgroundColor: isParent ? "#1a579eff" : "#63b6cbff",
                        fontSize: isParent ? "15px" : "13px",
                        fontWeight: isParent ? "600" : "400",
                    }
                };
            }).filter(Boolean);
            setDisplayTasks(taskMap)
            return taskMap
        } catch (error) {
            console.error("Error processing tasks:", error);
            setHasError(true);
            return [];
        }
    }, [schedule]);

    useEffect(() => {
        if(!tasks) setDisplayTasks(tasks)   
    }, [tasks])

    useEffect(() => {
        console.log(tasks)
        console.log(displayTasks)
    }, [displayTasks])

    const handleViewClick = () => {
        const tasksToView = displayTasks.filter(t => t.id >= 500)

        setDisplayTasks(tasksToView)
    }

    const handleFloatingButtonClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmSave = async () => {
        setIsSaving(true);
        try {
            // Add your save logic here
            let columnsArray = [];
            let valuesArray = [];
            console.log("Saving schedule:", schedule);
            const columns = new Queue()
            const values = new Queue()
            schedule.map(s => {

                let value = {
                    task_id: s.id,
                    task_name: s.text,
                    task_start: s.start.toISOString().split('T')[0],
                    task_end: s.end.toISOString().split('T')[0],
                    task_duration: s.duration,
                    task_type: s.type,
                    task_parent: s.parent,
                    task_percent: s.percent_progress
                }
                values.enqueue(value)
            })
            valuesArray = values.elements
            const payload = {id: 801, tasks: valuesArray}
            const response = await Axios.post(`/projects/schedule/${Number(projId)}`, payload);
            if (response.data?.success) {
                alert(response.data.message); // "Schedule saved successfully!"
            } else {
                alert("Unexpected server response. Please try again.");
            }
            setShowConfirmModal(false);
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("Error saving schedule. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelSave = () => {
        setShowConfirmModal(false);
        console.log("Save operation cancelled by user");
    };

    // Show empty state if no tasks
    if (!tasks || tasks.length === 0) {
        return (
            <div className="gantt-container">
                <div className="empty-state">
                    No tasks available for this project.
                </div>
            </div>
        );
    }


    return (
        <div className={`gantt-container ${!isEditable ? "gantt-readonly" : ""}`}>
          <div className="btn-container">
            <div className="view-controls">
              <button 
                className={`btn-view ${view === ViewMode.Day ? "active" : ""}`}
                onClick={() => setView(ViewMode.Day)}
              >
                Day
              </button>
              <button 
                className={`btn-view ${view === ViewMode.Week ? "active" : ""}`}
                onClick={() => setView(ViewMode.Week)}
              >
                Week
              </button>
              <button 
                className={`btn-view ${view === ViewMode.Month ? "active" : ""}`}
                onClick={() => setView(ViewMode.Month)}
              >
                Month
              </button>
            </div>
            
            <div className="filter-controls">
              <button 
                className="btn-view"
                onClick={handleViewClick}
              >
                View by Parent
              </button>
              
              <FormControl className="form-control-professional" size="small">
                <InputLabel id="parent-select-label">Parent Task</InputLabel>
                <Select
                  labelId="parent-select-label"
                  id="parent-select"
                  value={age}
                  label="Parent Task"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
            
            <div 
            className="gantt-wrapper" 
            style={{
                maxHeight: "900px",   // ✅ limit height here
                overflowY: "auto",    // ✅ vertical scrollbar if content exceeds height
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "2rem"
            }}
            >
            <Gantt
                tasks={displayTasks}
                viewMode={view}
                onDateChange={isEditable ? (updatedTask) => {
                    console.log(updatedTask);
                } : (task) => task}
                onProgressChange={isEditable ? console.log : (task) => task}
                onDelete={isEditable ? console.log : (task) => task}
                onDoubleClick={isEditable ? console.log : (task) => task}
                onSelect={isEditable ? console.log : (task) => task}
                columnWidth={60} 
            />
            </div>
            
            <button 
                className="floating-btn"
                onClick={handleFloatingButtonClick}
                aria-label="Save schedule"
            >
                <i className="fas fa-save" style={{ color: '#ffffff' }}></i>
                Save Schedule
            </button>

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Save</h3>
                            <button 
                                className="modal-close" 
                                onClick={handleCancelSave}
                                disabled={isSaving}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <p>Are you sure you want to save the schedule?</p>
                            <p className="modal-warning">This action cannot be undone.</p>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={handleCancelSave}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-confirm"
                                onClick={handleConfirmSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i>
                                        Confirm Save
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestChart;