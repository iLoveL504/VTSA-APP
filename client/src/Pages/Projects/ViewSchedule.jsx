import React, { useState, useMemo, useEffect, useRef } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "../Tests/TestChart.css";
import { useParams } from "react-router-dom";
import '../../css/ViewSchedule.css'
import { useReactToPrint } from "react-to-print";
import { DatePickerInput } from '@mantine/dates';
import { Axios } from "../../api/axios";

// MUI Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
                .current-task-panel {
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
                    <CalendarMonthIcon style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '16px' }} />
                    <p>No tasks available for this project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="Content GanttChart">
            {/* Control Panel */}
            <div className="control-panel">
                <div className="panel-grid">
                    {/* Holidays Section */}
                    <div className="panel-card">
                        <div className="panel-header">
                            <EventBusyIcon style={{ marginRight: '8px' }} />
                            <h3>Project Holidays</h3>
                        </div>
                        <div className="panel-content">
                            {holidays && holidays.length > 0 ? (
                                <div className="holidays-list">
                                    {Object.entries(groupedHolidays).map(([month, monthHolidays]) => (
                                        <div key={month} className="holiday-month">
                                            <strong className="month-label">{month}</strong>
                                            <div className="holiday-tags">
                                                {monthHolidays.map((holiday, index) => (
                                                    <span key={index} className="holiday-tag">
                                                        {holiday.formatted}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-holidays">
                                    <p>No holidays scheduled for this project</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Installation Date Section */}
                    <div className="panel-card">
                        <div className="panel-header">
                            <ScheduleIcon style={{ marginRight: '8px' }} />
                            <h3>Installation Start Date</h3>
                            {!isEditingInstallation && (
                                <button 
                                    onClick={startEditInstallation}
                                    className="edit-button"
                                >
                                    <EditIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                    Edit
                                </button>
                            )}
                        </div>
                        
                        <div className="panel-content">
                            {isEditingInstallation ? (
                                <div className="date-edit-form">
                                    <DatePickerInput
                                        label="New Installation Start Date"
                                        value={tempInstallationDate}
                                        onChange={setTempInstallationDate}
                                        placeholder="Select installation start date"
                                        clearable={false}
                                        style={{ marginBottom: '16px', width: '100%' }}
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            onClick={handleAdjustInstallation}
                                            className="btn-primary"
                                        >
                                            <CheckCircleIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                            Apply Changes
                                        </button>
                                        <button 
                                            onClick={cancelEditInstallation}
                                            className="btn-secondary"
                                        >
                                            <CancelIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="installation-date-display">
                                        {installationDate ? installationDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Not set'}
                                    </div>
                                    <p className="date-help-text">
                                        Adjust this date to reschedule installation phase tasks
                                    </p>
                                </div>
                            )}
                        </div>
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
                            <CalendarMonthIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                            Day View
                        </button>
                        <button 
                            className={`btn-view ${view === ViewMode.Week ? "active" : ""}`}
                            onClick={() => setView(ViewMode.Week)}
                        >
                            <TrendingUpIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                            Week View
                        </button>
                        <button 
                            className={`btn-view ${view === ViewMode.Month ? "active" : ""}`}
                            onClick={() => setView(ViewMode.Month)}
                        >
                            <ScheduleIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                            Month View
                        </button>
                    </div>
                    
                    <div className="action-controls">
                        <button 
                            className="btn-print"
                            onClick={handlePrint}
                        >
                            <PrintIcon style={{ fontSize: '16px', marginRight: '6px' }} />
                            Print Chart
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
                                <CalendarMonthIcon style={{ fontSize: '14px', marginRight: '4px' }} />
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
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading project schedule...</p>
                        </div>
                    )
                    }
                </div>
            </div>        
        </div>
    );
};

export default TestChart;