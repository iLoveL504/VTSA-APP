import React, { useState, useMemo, useEffect, useRef } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "../Tests/TestChart.css";
import { useParams } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../../css/ViewSchedule.css'

import { useReactToPrint } from "react-to-print";

const TestChart = ({projSched, projSchedIsLoading}) => {
    const { projId } = useParams()
    const [view, setView] = useState(ViewMode.Day);
    
    const [displayTasks, setDisplayTasks] = useState([])
    const [isPrinting, setIsPrinting] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const currentDate = new Date()
    const contentRef = useRef();
    const ganttRef = useRef();
    
    //const schedule = location.state?.schedule || defaultSchedule;

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
    }, [projSchedIsLoading, projSched])

    // Find current/ongoing tasks
    const findCurrentTasks = useMemo(() => {
        if (!displayTasks || displayTasks.length === 0) return [];

        const now = new Date();
        return displayTasks.filter(task => {
            const start = new Date(task.start);
            const end = new Date(task.end);
            return start <= now && end >= now && task.type !== "project";
        });
    }, [displayTasks]);

    // Find upcoming tasks (starting today or in the future)
    const findUpcomingTasks = useMemo(() => {
        if (!displayTasks || displayTasks.length === 0) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return displayTasks.filter(task => {
            const start = new Date(task.start);
            start.setHours(0, 0, 0, 0);
            return start >= today && task.type !== "project";
        }).sort((a, b) => new Date(a.start) - new Date(b.start));
    }, [displayTasks]);



    // Auto-select current task
    useEffect(() => {
        if (findCurrentTasks.length > 0) {
            // Prefer tasks that are currently ongoing
            setCurrentTaskId(findCurrentTasks[0].id);
        } else if (findUpcomingTasks.length > 0) {
            // Fall back to the next upcoming task
            setCurrentTaskId(findUpcomingTasks[0].id);
        }
    }, [findCurrentTasks, findUpcomingTasks]);



    const tasks = useMemo(() => {
        console.log(projSched)
        try {
            const taskMap = projSched.map(task => {
                const isParent = task.task_type === "summary";
                const isCurrent = String(task.task_id) === currentTaskId;

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
                        progressColor: isCurrent ? "#ff6b35" : (isParent ? "#1e3a8a" : "#15803d"),
                        progressSelectedColor: isCurrent ? "#ff8c42" : (isParent ? "#1d4ed8" : "#166534"),
                        backgroundColor: isCurrent ? "#447516ff" : (isParent ? "#1a579eff" : "#63b6cbff"),
                        backgroundSelectedColor: isCurrent ? "#ffeaa7" : undefined,
                        fontSize: isParent ? "15px" : "13px",
                        fontWeight: isParent ? "600" : "400",
                    }
                };
            }).filter(Boolean);
            setDisplayTasks(taskMap)

            return taskMap
        } catch (error) {
            console.error("Error processing tasks:", error);
     
            return [];
        }
    }, [projSched, currentTaskId]);

    useEffect(() => {
        if(!tasks) setDisplayTasks(tasks)   
    }, [tasks])

    useEffect(() => {
        // console.log(tasks)
        // console.log(displayTasks)
    }, [displayTasks])


    // Custom header with today marker
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
            switch(view) {
                case ViewMode.Day:
                    return 20;
                case ViewMode.Week:
                    return 40;
                case ViewMode.Month:
                    return 80;
                default:
                    return 20;
            }
        } else {
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
        <div className={`gantt-container gantt-readonly`}>
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
                onClick={handlePrint}
                style={{ marginLeft: '10px' }}
              >
                <i className="fas fa-print"></i> Print
              </button>
            </div>

            {/* Current Task Info Panel */}
            {(findCurrentTasks.length > 0 || findUpcomingTasks.length > 0) && (
                <div className="current-task-panel">
                    <div className="current-task-info">
                        <strong>Current Focus: </strong>
                        {findCurrentTasks.length > 0 ? (
                            <span className="ongoing-task">
                                {findCurrentTasks[0].name} (Ongoing)
                            </span>
                        ) : (
                            <span className="upcoming-task">
                                {findUpcomingTasks[0].name} (Upcoming)
                            </span>
                        )}
                    </div>
                    <div className="current-date">
                        <strong>Today: </strong>
                        {currentDate.toLocaleDateString()}
                    </div>
                </div>
            )}
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
                        ref={ganttRef}
                        tasks={displayTasks}
                        viewMode={view}
                        columnWidth={getColumnWidth()}
                        // You might need to add custom props for date highlighting based on the library's capabilities
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