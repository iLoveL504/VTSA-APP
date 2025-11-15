import React, { useState, useMemo, useEffect, useRef } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "../Tests/TestChart.css";
import { useParams } from "react-router-dom";
import '../../css/ViewSchedule.css'
import { useReactToPrint } from "react-to-print";
import { DatePickerInput } from '@mantine/dates';
import { Axios } from "../../api/axios";

const TestChart = ({projSched, projSchedIsLoading, holidays }) => {
    const { projId } = useParams()
    const [view, setView] = useState(ViewMode.Day);
    const [displayTasks, setDisplayTasks] = useState([])
    const [isPrinting, setIsPrinting] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [installationDate, setInstallationDate] = useState(null);
    const [isEditingInstallation, setIsEditingInstallation] = useState(false);
    const [tempInstallationDate, setTempInstallationDate] = useState(null);

    const currentDate = new Date()
    const contentRef = useRef();
    const ganttRef = useRef();
    
    // Initialize installation date from tasks
    useEffect(() => {
        if (projSched && projSched.length > 0) {
            const installationTask = projSched.find(task => task.task_id === 501);
            if (installationTask && installationTask.task_start) {
                setInstallationDate(new Date(installationTask.task_start));
            }
        }
    }, [projSched]);

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
                .control-panel {
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

    // Handle installation date adjustment
    const handleAdjustInstallation = async () => {
        if (!tempInstallationDate) {
            alert('Please select a valid installation start date');
            return;
        }

        try {
                console.log(tempInstallationDate)
                const response = await Axios.put(`/api/projects/installation-adjust/${projId}`, {date: tempInstallationDate})
                if (response?.data.success) {
                    window.alert('Installation date adjusted')
                } else {
                    window.alert('Something went wrong')
                    console.error('dfsd')
                }
                setIsEditingInstallation(false);
                alert('Installation start date updated successfully');
            
        } catch (error) {
            alert('Failed to update installation start date');
            console.error(error)
        }
    };

    const cancelEditInstallation = () => {
        setTempInstallationDate(installationDate);
        setIsEditingInstallation(false);
    };

    const startEditInstallation = () => {
        setTempInstallationDate(installationDate);
        setIsEditingInstallation(true);
    };

    // Group holidays by month for better display
    const groupedHolidays = useMemo(() => {
        if (!holidays || holidays.length === 0) return [];
        
        const grouped = holidays.reduce((acc, holiday) => {
            const date = new Date(holiday);
            const monthYear = date.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
            
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            
            acc[monthYear].push({
                date: date,
                formatted: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                })
            });
            
            return acc;
        }, {});
        
        // Sort holidays within each month
        Object.keys(grouped).forEach(month => {
            grouped[month].sort((a, b) => a.date - b.date);
        });
        
        return grouped;
    }, [holidays]);

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
            setCurrentTaskId(findCurrentTasks[0].id);
        } else if (findUpcomingTasks.length > 0) {
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

    // Calculate column width based on print state and view mode
    const getColumnWidth = () => {
        if (isPrinting) {
            switch(view) {
                case ViewMode.Day: return 20;
                case ViewMode.Week: return 40;
                case ViewMode.Month: return 80;
                default: return 20;
            }
        } else {
            switch(view) {
                case ViewMode.Day: return 60;
                case ViewMode.Week: return 120;
                case ViewMode.Month: return 200;
                default: return 60;
            }
        }
    };

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
        <>
            {/* Control Panel */}
            <div className="control-panel" style={{ marginBottom: '20px', padding: '20px', background: '#ffffffff', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Holidays Section */}
                    <div>
                        <h3 style={{ marginBottom: '10px' }}>Project Holidays</h3>
                        {holidays && holidays.length > 0 ? (
                            <div>
                                {Object.entries(groupedHolidays).map(([month, monthHolidays]) => (
                                    <div key={month} style={{ marginBottom: '10px' }}>
                                        <strong style={{ color: '#666' }}>{month}</strong>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                            {monthHolidays.map((holiday, index) => (
                                                <span 
                                                    key={index}
                                                    style={{
                                                        background: '#50b1edff',
                                                        border: '1px solid #50b1edff',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        color: '#ffffffff'
                                                    }}
                                                >
                                                    {holiday.formatted}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#666' }}>No holidays scheduled for this project</p>
                        )}
                    </div>

                    {/* Installation Date Section */}
                    <div>
                        {/* Query here to be added where it checks if project is in installation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3>Installation Start Date</h3>
                            {!isEditingInstallation && (
                                <button 
                                    onClick={startEditInstallation}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #007bff',
                                        color: '#007bff',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        
                        {isEditingInstallation ? (
                            <div>
                                <DatePickerInput
                                    label="New Installation Start Date"
                                    value={tempInstallationDate}
                                    onChange={setTempInstallationDate}
                                    placeholder="Select installation start date"
                                    clearable={false}
                                    minDate={new Date()}
                                    style={{ marginBottom: '10px' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={handleAdjustInstallation}
                                        style={{
                                            background: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Apply Changes
                                    </button>
                                    <button 
                                        onClick={cancelEditInstallation}
                                        style={{
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{
                                    background: '#e7f3ff',
                                    border: '1px solid #007bff',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}>
                                    {installationDate ? installationDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Not set'}
                                </div>
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                    Adjust this date to reschedule installation phase tasks
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
        </>
    );
};

export default TestChart;