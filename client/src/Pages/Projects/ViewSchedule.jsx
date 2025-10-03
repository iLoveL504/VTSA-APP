import React, { useState, useMemo, useEffect, useRef } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "../Tests/TestChart.css";
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
import { useReactToPrint } from "react-to-print";

const TestChart = ({ id }) => {
    const location = useLocation();
    const { projId } = useParams()
    const [view, setView] = useState(ViewMode.Day);
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const { data: projSched, fetchError: projFetchError, isLoading: projSchedIsLoading } = useAxiosFetch(`${backendURL}/projects/schedule/${projId}`);
    const [hasError, setHasError] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [displayTasks, setDisplayTasks] = useState([])
    const [isPrinting, setIsPrinting] = useState(false);
    const contentRef = useRef();
    
    const schedule = location.state?.schedule || defaultSchedule;

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Gantt Chart - Project ${projId}`,
        onBeforeGetContent: () => {
            setIsPrinting(true);
            return Promise.resolve();
        },
        onAfterPrint: () => {
            setIsPrinting(false);
        },
        pageStyle: `
            @page {
                size: A3 landscape;
                margin: 10mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .gantt-wrapper {
                    max-height: none !important;
                    overflow: visible !important;
                    page-break-inside: avoid;
                }
                .btn-container {
                    display: none !important;
                }
            }
        `
    });

    useEffect(() => {
      if(projSched && !projSchedIsLoading) {
        console.log(projSched)
      }
    }, [projSchedIsLoading])

    const tasks = useMemo(() => {
        try {
            const taskMap = projSched.map(task => {
                //console.log(task)
                const isParent = task.task_type === "summary";

                const startDate = new Date(task.task_start);
                const endDate = new Date(task.task_end);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
                    console.error("Invalid task:", task);
                    return null;
                }

                return {
                    id: String(task.task_id),
                    name: task.task_name || `Task ${task.task_id}`,
                    start: startDate,
                    end: endDate,
                    progress: task.task_progress ?? 0,
                    project: task.task_parent || undefined,
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
    }, [projSchedIsLoading, projSched]);

    useEffect(() => {
        if(!tasks) setDisplayTasks(tasks)   
    }, [tasks])

    useEffect(() => {
        // console.log(tasks)
        // console.log(displayTasks)
    }, [displayTasks])

    const handleViewClick = () => {
        const tasksToView = displayTasks.filter(t => t.id >= 500)
        setDisplayTasks(tasksToView)
    }


    if (!tasks || tasks.length === 0) {
        return (
            <div className="gantt-container">
                <div className="empty-state">
                    No tasks available for this project.
                </div>
            </div>
        );
    }

    // Calculate column width based on print state and view mode
    const getColumnWidth = () => {
        if (isPrinting) {
            // Smaller columns for printing to fit on page
            switch(view) {
                case ViewMode.Day:
                    return 20; // Much smaller for day view
                case ViewMode.Week:
                    return 40;
                case ViewMode.Month:
                    return 80;
                default:
                    return 20;
            }
        } else {
            // Normal view columns
            switch(view) {
                case ViewMode.Day:
                    return 60;
                case ViewMode.Week:
                    return 120;
                case ViewMode.Month:
                    return 200;
                default:
                    return 60;
            }
        }
    };

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

              <button 
                className="btn-view"
                onClick={handlePrint}
                style={{ marginLeft: '10px' }}
              >
                <i className="fas fa-print"></i> Print
              </button>
            </div>
          </div>
            
          <div ref={contentRef}>
            {
              (projSched && !projSchedIsLoading) ? (
                <>
                  <div 
                    className="gantt-wrapper" 
                    style={{
                        maxHeight: isPrinting ? "none" : "900px",
                        overflowY: isPrinting ? "visible" : "auto",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "2rem"
                    }}
                  >
                    <Gantt
                        tasks={displayTasks}
                        viewMode={view}
                        columnWidth={getColumnWidth()} 
                    />
                  </div>
                </>
              ) : (
                <div>
                  Schedule is loading
                </div>
              )
            }
            
          </div>
        </div>
    );
};

export default TestChart;