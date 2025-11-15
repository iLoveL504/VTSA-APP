// src/pages/ProjectProgress.jsx
import { useState } from 'react'
import { useStoreState } from 'easy-peasy'
import MyGanttComponent from '../../outComponent/GANTT_CHART/GanttChart.jsx'
import DailyTasks from './DailyTasks.jsx'
import UniverSpreadsheet from '../../spreadsheet-components/spreadsheet.jsx'
import "wx-react-gantt/dist/gantt.css";
import ViewSchedule from './ViewSchedule.jsx'
import AccomplishmentReport from './AccomplishmentReport.jsx'
import TaskList from './TaskList.jsx'
import { Grid } from 'ldrs/react'
import TaskOverviewSection from '../../components/Project/TaskOverviewSection.jsx'

const ProjectProgress = ({ 
    projId, 
    projSched, 
    projSchedIsLoading,
    taskPhotos,
    currentTask,
    holidays,
    // Add these new props
    proj,
}) => {
    console.log(holidays)
    const projects = useStoreState(state => state.projects)
    
    // ADD GUARDS: Check if projects is loaded and find project safely
    // const proj = projects && Array.isArray(projects) ? projects.find(p => p.id === numId) : null;
    
    const [activeTab, setActiveTab] = useState('gantt')
    
    console.log(projId)

    // ADD LOADING STATE
    if (!projects || !Array.isArray(projects)) {
        return (
            <div className="Content ProjectProgress">
                <div className="loading-state">
                    <Grid size="60" speed="1.5" color="#315a95"></Grid>
                    <p>Loading projects...</p>
                </div>
            </div>
        )
    }

    if (!proj) {
        return (
            <div className="Content ProjectProgress">
                <div className="error-state">
                    <p>Project not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="Content ProjectProgress">
            {/* <TaskOverviewSection
                onHold={onHold}
                isBehindSchedule={isBehindSchedule}
                projectedTask={projectedTask}
                currentParentTask={currentParentTask}
                proj={proj}
                onResumeProject={onResumeProject}
                onTaskDetails={onTaskDetails}
                role={sessionStorage.getItem('roles')}
                projectCompleted={projectCompleted}
                projectExists={projectExists}
                currentTask={currentTask}
                currentTaskPhase={currentTaskPhase}
                onCreateSchedule={onCreateSchedule}
                isLoaded={isLoaded}
            /> */}
            <div className="progress-header">
                <h2>Project Progress - {proj.lift_name}</h2>
                <div className="tabs">
                    <button 
                        className={activeTab === 'gantt' ? 'active' : ''}
                        onClick={() => setActiveTab('gantt')}
                    >
                        Gantt Chart
                    </button>
                    <button 
                        className={activeTab === 'tasklist' ? 'active' : ''}
                        onClick={() => setActiveTab('tasklist')}
                    >
                        Task List
                    </button>
                    <button 
                        className={activeTab === 'accomplishment' ? 'active' : ''}
                        onClick={() => setActiveTab('accomplishment')}
                    >
                        Accomplishment Report
                    </button>
                </div>
            </div>

            <div className="progress-content">
                {activeTab === 'gantt' && (
                    <ViewSchedule 
                        projSched={projSched || []} 
                        projSchedIsLoading={projSchedIsLoading} 
                        holidays={holidays}
                    />
                )}
                {activeTab === 'tasklist' && projSched && taskPhotos && currentTask && (
                    <TaskList 
                        projSched={projSched} 
                        taskPhotos={taskPhotos} 
                        currentTask={currentTask}
                    />
                )}
                {activeTab === 'accomplishment' && <AccomplishmentReport proj={proj}/>}
            </div>
        </div>
    )
}

export default ProjectProgress