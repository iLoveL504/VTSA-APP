import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStoreState } from 'easy-peasy'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import 'ldrs/react/Grid.css'
import { Axios } from '../../api/axios.js'
import useFormValidate from '../../hooks/useFormValidate'
import useFindProjectTask from '../../hooks/useFindProjectTask.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"
import ProjectDetails from './ProjectDetails.jsx'
import ProjectProgress from './ProjectProgress.jsx'
import ScheduleProject from './ScheduleProject.jsx'
import '../../css/ProjectPage.css'
import tasks from '../../data/TasksData'

const ProjectInfo = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [activePage, setActivePage] = useState('details')
    const { projId } = useParams()
    const numId = Number(projId)
    const projects = useStoreState(state => state.projects)
    const proj = projects.find(p => p.id === numId)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const {currentTask, currentParentTask, isLoading: currentIsLoading, fetchError: tasksFetchError, projectExists} = useFindProjectTask(projId)
    const isProjectsReady = Array.isArray(projects) && projects.length > 0;
    const fetchUrl = proj && isProjectsReady ? `${backendURL}/teams/${proj.id}` : null;
    const {data: teamInfo} = useAxiosFetch(fetchUrl);
     const validate = (values) => {
        let errors = {}

        if(values.lift_name === '') {
            errors.lift_name = 'Lift name is missing'
        }
        if(values.cap === '') {
            errors.cap = 'Capacity is missing'
        }
        if(values.speed === '') {
            errors.speed = 'Speed is missing'
        }
        if(values.stops === '') {
            errors.stops = 'Stops is missing'
        }
        if(values.travel === '') {
            errors.travel = 'Travel is missing'
        }
        if(values.overhead_height === '') {
            errors.overhead_height = 'Overhead height is missing'
        }
        if(values.pit_depth === '') {
            errors.pit_depth = 'Pit depth is missing'
        }

        return errors
    }
        const {
            errors,
            handleInputChange,
            handleNumberInputChange,
            handleBlur,
            handleSubmit,
            values,
            saveStatus,
            setSaveStatus,
            setValues,
            setErrors
         } = useFormValidate(formData, validate)

    const handleSave = async () => {
        try {
            setSaveStatus('saving')
            await Axios.put(`/projects/${numId}`, values)
            setSaveStatus('success')
            setTimeout(() => setSaveStatus(''), 2000)
            setIsEditing(false)
            window.location.reload()
            // Optionally refresh the project data here
        } catch (error) {
            console.error('Error updating project:', error)
            setSaveStatus('error')
            setTimeout(() => setSaveStatus(''), 2000)
        }
    }

    const schedOnClick = () => {
        setActivePage('schedule')
    }


    const handleCancel = () => {
        setValues(proj)
        setErrors({})
        setIsEditing(false)
        setSaveStatus('')
    }

    const progressOnClick = () => {
         setActivePage(`progress`)
    }


   
    return (
        
        <div className="Content ProjectPage">
            <div className="project-header">
                <h2>{values.lift_name}</h2>
                <div className="action-buttons">
                    <button onClick={() => setActivePage('details')}>Details</button>
                    <button onClick={progressOnClick}>Progress</button>

                </div>
            </div>
            {
                activePage === 'details' && 
                <ProjectDetails 
                    currentTask={currentTask}
                    currentParentTask={currentParentTask}
                    currentIsLoading={currentIsLoading}
                    tasksFetchError={tasksFetchError}
                    projectExists={projectExists}
                    proj={proj}
                    setFormData={setFormData}
                    setIsLoading={setIsLoading}
                    formData={formData}
                    teamInfo={teamInfo}
                    isLoading={isLoading}
                   
                    saveStatus={saveStatus}
                    handleSave={handleSave}
                    isEditing={isEditing}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleNumberInputChange={handleNumberInputChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
               
                    values={values}
                    setIsEditing={setIsEditing}
                    handleCancel={handleCancel}
                />
            }
            {
                activePage === 'progress' &&
                <ProjectProgress allTaskDates={tasks} projId={projId}/>
            }
        {}
            
        </div>
    )
}


export default ProjectInfo