import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react' // Added useEffect
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
import ProjectDocuments from './ProjectDocuments.jsx'
import PMS_Entry from './PMS_Entry.jsx'

const ProjectInfo = () => {
    const navigate = useNavigate()
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [activePage, setActivePage] = useState('details')
    const { projId } = useParams()
    const numId = Number(projId)
    const projects = useStoreState(state => state.projects)
    const {data: proj, isLoading: projIsLoading} = useAxiosFetch(`${backendURL}/api/projects/${projId}`)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const {currentTask, currentParentTask, isLoading: currentIsLoading, fetchError: tasksFetchError, projectExists, fetchedData, projectCompleted} = useFindProjectTask(projId)
    const isProjectsReady = Array.isArray(projects) && projects.length > 0;
    const fetchUrl = proj && isProjectsReady ? `${backendURL}/api/teams/${proj.id}` : null;
    const {data: teamInfo, isLoading: teamIsLoading} = useAxiosFetch(fetchUrl);
    console.log(teamInfo)
    // Get user role from session storage with debugging
    const [role, setRole] = useState(null)
    
    useEffect(() => {
        const userRole = sessionStorage.getItem('roles');
        //console.log('Current role from sessionStorage:', userRole);
        setRole(userRole);
    }, []);

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
            await Axios.put(`/api/projects/${numId}`, values)
            setSaveStatus('success')
            setTimeout(() => setSaveStatus(''), 2000)
            setIsEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('Error updating project:', error)
            setSaveStatus('error')
            setTimeout(() => setSaveStatus(''), 2000)
        }
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

    const documentsOnClick = () => {
        setActivePage(`documents`)
    }

    const pmsOnClick = () => {
        setActivePage('pms_entry')
    }

    // Function to handle daily report button click
    const handleDailyReportClick = () => {
        //console.log('Daily report button clicked for project:', projId);
        // You can implement navigation logic here
        navigate(`report`)
    }

    //console.log('Rendering ProjectInfo - Role:', role, 'Should display button:', role === 'Foreman');

    return (
        <div className="Content ProjectPage">
            <div className="project-header">
                <h2>{values.lift_name}</h2>
                <div className="action-buttons">
                    <button onClick={() => setActivePage('details')}>Details</button>
                    <button onClick={progressOnClick}>Progress</button>
                    <button onClick={documentsOnClick}>Documents</button>
                    <button onClick={pmsOnClick}>Register to PMS</button>
                </div>
            </div>
            
            {
                activePage === 'details' && 
                <ProjectDetails 
                    projectCompleted={projectCompleted}
                    currentTask={currentTask}
                    currentParentTask={currentParentTask}
                    currentIsLoading={currentIsLoading}
                    tasksFetchError={tasksFetchError}
                    projectExists={projectExists}
                    fetchedData={fetchedData}
                    proj={proj}
                    setFormData={setFormData}
                    projIsLoading={projIsLoading}
                    formData={formData}
                    teamInfo={teamInfo}
                    teamIsLoading={teamIsLoading}
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
            {
                activePage === 'documents' &&
                <ProjectDocuments/>
            }
            {
                activePage === 'pms_entry' &&
                <PMS_Entry />
            }
            
            {/* Floating Daily Report Button - Test without role restriction first */}
            
     
                <button 
                    className="floating-daily-report-btn" 
                    onClick={handleDailyReportClick}
                    style={{ display: role === 'Foreman' ? 'flex' : 'none' }}
                >
                    <i className="fas fa-file-alt"></i>
                    Make Daily Project Report
                    {console.log(role)}
                </button>
            

            {/* Keep this for testing - will help see if button renders at all */}
            {/* <div style={{ position: 'fixed', bottom: '100px', right: '20px', background: 'red', color: 'white', padding: '10px', zIndex: 1001 }}>
                Debug: Role = {role}, Show = {role === 'Foreman' ? 'YES' : 'NO'}
            </div> */}
        </div>
    )
}

export default ProjectInfo