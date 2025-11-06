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

const ProjectProgress = ({ projSched, projSchedIsLoading, taskPhotos, currentTask}) => {
    const { projId } = useParams()
    const numId = Number(projId)
    const projects = useStoreState(state => state.projects)
    const proj = projects.find(p => p.id === numId)
    const [activeTab, setActiveTab] = useState('gantt')
    console.log(projId)
    if (!proj) {
        return <div>Project not found</div>
    }

    return (
        <div className="Content ProjectProgress">
            <TaskList projSched={projSched} taskPhotos={taskPhotos} currentTask={currentTask}/>
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
                {activeTab === 'gantt' && <ViewSchedule projSched={projSched} projSchedIsLoading={projSchedIsLoading} />}
                {activeTab === 'accomplishment' && <AccomplishmentReport proj={proj}/>}
            </div>
        </div>
    )
}

export default ProjectProgress