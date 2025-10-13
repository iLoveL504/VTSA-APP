    import React, { useState, useMemo } from 'react';
    import { useLocation, useParams } from "react-router-dom";

    import Queue from '../../DataStructs/Queue'
    import { Axios } from '../../api/axios';

    const CustomGanttChart = () => {
    const {projId} = useParams()
    const location = useLocation()
    console.log(location.state)
    const [isCalendarDays] = useState(location.state.toggle);
    const [holidays] = useState([

        ])

    const [expandedTasks, setExpandedTasks] = useState(new Set([100, 200, 300, 400, 500]));
   
    // Generate schedule using LinkedList
    const processedTasks = useMemo(() => {
        
 
        return location.state.schedule
   

    }, [location.state.schedule]);

    const fullRange = useMemo(() => {
    if (processedTasks.length === 0) return [];

    const minDate = new Date(Math.min(...processedTasks.map(t => new Date(t.start))));
    const maxDate = new Date(Math.max(...processedTasks.map(t => new Date(t.end))));
    const dates = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
    }, [processedTasks]);

    // Generate date range (only show working days for private, all days for government)
// Shown timeline (changes based on Calendar Days toggle)
const dateRange = useMemo(() => {
  const normalizedHolidays = holidays.map(h => new Date(h).toDateString());
  return fullRange.filter(d => {
    const isSunday = d.getDay() === 0;
    const isHoliday = normalizedHolidays.includes(d.toDateString());
    // Hide Sundays/holidays for private (non-calendar) projects
    return isCalendarDays || (!isSunday && !isHoliday);
  });
}, [fullRange, isCalendarDays, holidays]);



    // Calculate task bar position and width
const getTaskBarStyle = (task) => {
  const taskStart = new Date(task.start);

  // Find position relative to *full range*, not visible range
//   const fullStartIndex = fullRange.findIndex(
//     d => d.toDateString() === taskStart.toDateString()
//   );

  // The bar width is always fixed: duration × 40px
  const width = task.duration * 40;

  // The left offset should align to the visible range, even if some dates are hidden
  const visibleStartIndex = dateRange.findIndex(
    d => d.toDateString() === taskStart.toDateString()
  );

  // If the start date isn't visible (e.g., it was a Sunday/holiday), find the next visible day
  let leftIndex = visibleStartIndex;
  if (leftIndex === -1) {
    leftIndex = dateRange.findIndex(d => d > taskStart);
    if (leftIndex === -1) leftIndex = 0;
  }

  return {
    left: `${leftIndex * 40}px`,
    width: `${width}px`,
    dayCount: task.duration,
  };
};


    const toggleTask = (taskId) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
        } else {
        newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const formatDate = (date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
    };

    const getDayName = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    const visibleTasks = processedTasks.filter(task => {
        if (task.parent === 0) return true;
        return expandedTasks.has(task.parent);
    });

    const handleMakeSchedule = async () => {
        try {
            // Add your save logic here
            let valuesArray = [];
            //console.log("Saving schedule:", schedule);
            const values = new Queue()
            location.state.schedule.map(s => {

                let value = {
                    task_id: s.id,
                    task_name: s.text,
                    task_start: s.start.toISOString().split('T')[0],
                    task_end: s.end.toISOString().split('T')[0],
                    task_duration: s.duration,
                    task_type: s.type,
                    task_parent: s.parent,
                    task_percent: s.percent_progress,
                    section_title: s.section_title || null,
                    item_code: s.item_code || null,
                    wt: s.wt || null
                }
                values.enqueue(value)
            })
            valuesArray = values.elements
            const payload = {id: 801, tasks: valuesArray}
            console.log(payload)
            const response = await Axios.post(`/api/projects/schedule/${Number(projId)}`, payload);
            if (response.data?.success) {
                alert(response.data.message); // "Schedule saved successfully!"
            } else {
                alert("Unexpected server response. Please try again.");
            }
            //setShowConfirmModal(false);
            console.log('done')
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("Error saving schedule. Please try again.");
        } finally {
            console.log('done')
            // setIsSaving(false);
        }
    }

    return (
        <div style={styles.container}>
        <div style={styles.header}>
            <h2 style={styles.title}>Project Schedule</h2>
            <div style={styles.controls}>
            <button onClick={handleMakeSchedule}>Make Schedule</button>
            <div style={styles.legend}>
                <div style={styles.legendItem}>
                <div style={{...styles.legendBox, ...styles.legendSummary}}></div>
                <span>Summary Task</span>
                </div>
                <div style={styles.legendItem}>
                <div style={{...styles.legendBox, ...styles.legendTask}}></div>
                <span>Task</span>
                </div>
            </div>
            </div>
        </div>

        <div style={styles.wrapper}>
            <div style={styles.leftPanel}>
            <div style={styles.leftHeader}>
                <div style={styles.headerCell}>Task Name</div>
                <div style={styles.headerCellSmall}>Duration</div>
            </div>
            <div style={styles.leftBody}>
                {visibleTasks.map(task => (
                <div 
                    key={task.id} 
                    style={{
                    ...styles.taskRow,
                    ...(task.type === 'summary' ? styles.summaryRow : {}),
                    paddingLeft: task.parent === 0 ? '10px' : '30px'
                    }}
                >
                    <div style={styles.taskName}>
                    {task.type === 'summary' && (
                        <button 
                        style={styles.expandBtn}
                        onClick={() => toggleTask(task.id)}
                        >
                        {expandedTasks.has(task.id) ? '−' : '+'}
                        </button>
                    )}
                    <span>{task.text}</span>
                    </div>
                    <div style={styles.taskDuration}>{task.duration}d</div>
                </div>
                ))}
            </div>
            </div>

            <div style={styles.rightPanel}>
            <div style={styles.timelineHeader}>
                {dateRange.map((date, idx) => (
                <div key={idx} style={styles.timelineDate}>
                    <div style={styles.dateMonth}>{formatDate(date)}</div>
                    <div style={{
                    ...styles.dateDay,
                    ...(date.getDay() === 0 ? styles.sunday : {})
                    }}>
                    {getDayName(date)}
                    </div>
                </div>
                ))}
            </div>
            
            <div style={styles.chartBody}>
                {visibleTasks.map(task => {
                const barStyle = getTaskBarStyle(task);
                return (
                    <div key={task.id} style={styles.chartRow}>
                    <div style={styles.timelineGrid}>
                        {dateRange.map((_, idx) => (
                        <div key={idx} style={styles.gridCell}></div>
                        ))}
                    </div>
                    <div 
                        style={{
                        ...styles.taskBar,
                        ...(task.type === 'summary' ? styles.summaryBar : styles.taskBarRegular),
                        left: barStyle.left,
                        width: barStyle.width
                        }}
                    >
                        {Array.from({ length: barStyle.dayCount }).map((_, idx) => (
                        <div key={idx} style={styles.daySquare}>
                            <div style={styles.dayDot}></div>
                        </div>
                        ))}
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        </div>
    );
    };

    const styles = {
    container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
        background: '#f8f9fa',
        minHeight: '100vh',
    },
    header: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 15px 0',
        color: '#1a1a1a',
        fontSize: '24px',
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
    },
    toggleLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#4a5568',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    },
    legend: {
        display: 'flex',
        gap: '20px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#4a5568',
    },
    legendBox: {
        width: '30px',
        height: '20px',
        borderRadius: '3px',
    },
    legendSummary: {
        background: 'linear-gradient(135deg, #1a579e 0%, #2563eb 100%)',
    },
    legendTask: {
        background: 'linear-gradient(135deg, #63b6cb 0%, #3b82f6 100%)',
    },
    wrapper: {
        display: 'flex',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    leftPanel: {
        minWidth: '350px',
        borderRight: '2px solid #e2e8f0',
    },
    leftHeader: {
        display: 'flex',
        background: '#f1f5f9',
        borderBottom: '2px solid #e2e8f0',
        fontWeight: '600',
        color: '#1e293b',
    },
    headerCell: {
        flex: 1,
        padding: '12px 15px',
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    headerCellSmall: {
        width: '80px',
        padding: '12px 10px',
        fontSize: '13px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    leftBody: {
        maxHeight: '600px',
        overflowY: 'auto',
    },
    taskRow: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
        borderBottom: '1px solid #e2e8f0',
        transition: 'background 0.2s',
    },
    summaryRow: {
        background: '#f1f5f9',
        fontWeight: '600',
    },
    taskName: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 15px',
        fontSize: '14px',
        color: '#334155',
    },
    expandBtn: {
        width: '20px',
        height: '20px',
        border: '1px solid #cbd5e1',
        background: 'white',
        borderRadius: '3px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#64748b',
    },
    taskDuration: {
        width: '80px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b',
        fontWeight: '500',
    },
    rightPanel: {
        flex: 1,
        overflowX: 'auto',
    },
    timelineHeader: {
        display: 'flex',
        background: '#f1f5f9',
        borderBottom: '2px solid #e2e8f0',
    },
    timelineDate: {
        width: '40px',
        minWidth: '40px',
        textAlign: 'center',
        borderRight: '1px solid #e2e8f0',
        padding: '8px 4px',
    },
    dateMonth: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '4px',
    },
    dateDay: {
        fontSize: '10px',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    sunday: {
        color: '#ef4444',
        fontWeight: '600',
    },
    chartBody: {
        maxHeight: '600px',
        overflowY: 'auto',
    },
    chartRow: {
        height: '50px',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
    },
    timelineGrid: {
        display: 'flex',
        height: '100%',
        position: 'absolute',
        width: '100%',
    },
    gridCell: {
        width: '40px',
        minWidth: '40px',
        borderRight: '1px solid #f1f5f9',
    },
    taskBar: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '32px',
        borderRadius: '4px',
        display: 'flex',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        zIndex: 2,
    },
    taskBarRegular: {
        background: 'linear-gradient(135deg, #63b6cb 0%, #3b82f6 100%)',
    },
    summaryBar: {
        background: 'linear-gradient(135deg, #1a579e 0%, #2563eb 100%)',
        height: '36px',
    },
    daySquare: {
        width: '40px',
        height: '100%',
        borderRight: '2px solid rgba(255,255,255,0.4)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayDot: {
        width: '8px',
        height: '8px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
    },
    };

    export default CustomGanttChart;