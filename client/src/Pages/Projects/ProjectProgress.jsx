// src/pages/ProjectProgress.jsx
import { useParams } from 'react-router-dom'
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

const ProjectProgress = ({ projSched, projSchedIsLoading, taskPhotos, currentTask}) => {
    const { projId } = useParams()
    const numId = Number(projId)
    const projects = useStoreState(state => state.projects)
    
    // ADD GUARDS: Check if projects is loaded and find project safely
    const proj = projects && Array.isArray(projects) ? projects.find(p => p.id === numId) : null;
    
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
            {/* ADD GUARD for TaskList */}
            {projSched && taskPhotos && currentTask && (
                <TaskList projSched={projSched} taskPhotos={taskPhotos} currentTask={currentTask}/>
            )}
            
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
                        className={activeTab === 'accomplishment' ? 'active' : ''}
                        onClick={() => setActiveTab('accomplishment')}
                    >
                        AccomplishmentReport
                    </button>
                </div>
            </div>

            <div className="progress-content">
                {activeTab === 'gantt' && (
                    <ViewSchedule 
                        projSched={projSched || []} 
                        projSchedIsLoading={projSchedIsLoading} 
                    />
                )}
                {activeTab === 'accomplishment' && <AccomplishmentReport proj={proj}/>}
            </div>
        </div>
    )
}

export default ProjectProgress