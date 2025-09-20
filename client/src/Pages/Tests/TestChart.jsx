import React, { useState, useMemo, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import "./TestChart.css";
import ProjectTasks from '../../outComponent/GANTT_CHART/GanttData';
import useAxiosFetch from "../../hooks/useAxiosFetch";

const TestChart = ({ id }) => {
    const [view, setView] = useState(ViewMode.Day);
    const [projInfo, projFetchError, projIsLoading] = useAxiosFetch(`http://localhost:4000/projects/${id}`);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!projIsLoading) {
            console.log("Project Info:", projInfo);
        }
    }, [projInfo, projIsLoading]);

    const tasks = useMemo(() => {
        try {
            if (projIsLoading || !projInfo || !projInfo.manufacturing_end_date) {
                return [];
            }

            const d1 = new Date(projInfo.manufacturing_end_date);
            
            // Validate the date
            if (isNaN(d1.getTime())) {
                console.error("Invalid date:", projInfo.manufacturing_end_date);
                return [];
            }

            const project = new ProjectTasks(d1);
            
            return project.tasks.map(task => {
                const isParent = task.type === "summary";
                
                // Validate task dates
                const startDate = task.start instanceof Date ? task.start : new Date(task.start);
                let endDate;
                
                if (task.end instanceof Date) {
                    endDate = task.end;
                } else if (task.start && task.duration) {
                    endDate = new Date(startDate.getTime() + task.duration * 86400000);
                } else {
                    // Fallback: set end date to start date + 1 day
                    endDate = new Date(startDate.getTime() + 86400000);
                }

                // Validate dates are valid
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error("Invalid task dates:", task);
                    return null;
                }

                return {
                    id: String(task.id),
                    name: task.text || `Task ${task.id}`,
                    start: startDate,
                    end: endDate,
                    project: task.parent !== 0 ? String(task.parent) : undefined,
                    dependencies: task.parent !== 0 ? [String(task.parent)] : [],
                    type: isParent ? "project" : "task",
                    progress: task.progress || 0,
                    styles: {
                        progressColor: isParent ? "#1e3a8a" : "#15803d",
                        progressSelectedColor: isParent ? "#1d4ed8" : "#166534",
                        backgroundColor: isParent ? "#c7d2fe" : "#bbf7d0",
                        fontSize: isParent ? "15px" : "13px",
                        fontWeight: isParent ? "600" : "400",
                    }
                };
            }).filter(task => task !== null); // Remove any null tasks

        } catch (error) {
            console.error("Error processing tasks:", error);
            setHasError(true);
            return [];
        }
    }, [projInfo, projIsLoading]);

    // Show loading state
    if (projIsLoading) {
        return (
            <div className="gantt-container">
                <div className="loading">Loading project data...</div>
            </div>
        );
    }

    // Show error state
    if (projFetchError || hasError) {
        return (
            <div className="gantt-container">
                <div className="error">
                    Error loading project data. Please try again.
                </div>
            </div>
        );
    }

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
        <div className="gantt-container">
            <div className="btn-container">
                <button onClick={() => setView(ViewMode.Day)}>Day</button>
                <button onClick={() => setView(ViewMode.Week)}>Week</button>
                <button onClick={() => setView(ViewMode.Month)}>Month</button>
            </div>
            <Gantt
                tasks={tasks}
                viewMode={view}
                onDateChange={console.log}
            />
        </div>
    );
};

export default TestChart;