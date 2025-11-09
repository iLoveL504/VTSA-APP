import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import 'ldrs/react/Grid.css'
import { Axios } from '../../api/axios.js'
import useFormValidate from '../../hooks/useFormValidate'
import useFindProjectTask from '../../hooks/useFindProjectTask.js'
import "wx-react-gantt/dist/gantt.css";
import "../../gantt-custom.css"
import ProjectDetails from './ProjectDetails.jsx'
import ProjectProgress from './ProjectProgress.jsx'
import RequestQAQC from './RequestQAQC.jsx'
import '../../css/ProjectPage.css'
import tasks from '../../../../data/TasksData.js'
import ProjectDocuments from './ProjectDocuments.jsx'
import PMS_Entry from './PMS_Entry.jsx'
import TaskDetails from './TaskDetails.jsx'
import RequestHold from './RequestHold.jsx'
import ProjectTeam from './ProjectTeam.jsx'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {type === 'punchlisting' ? (
            <h3>Confirm Punchlisting?</h3>
        ) : (
            <h3>{(type === 'qaqc' || type === 'tnc') ? 'Confirm Inspection' : title}</h3>            
        )}

        <p>{type}</p>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectInfo = () => {
    const navigate = useNavigate()
    const { projId } = useParams()
    const numId = Number(projId)
    
    // EasyPeasy store state and actions - CORRECTED DESTRUCTURING
    const {
      projectData: proj,
      projectPhotos: photos,
      projectTeamTechs: teamTechs,
      projectSchedule: projSched,
      taskPhotos,
      teamInfo,
      isLoading,
      error,

      currentTask,
      currentParentTask,
      currentTaskPhase,
      projectedTask,
      projectExists,
      projectCompleted,
      isBehindSchedule,
      onHold,
      tasksIsLoading,
      fetchedData
    } = useStoreState(state => state); // Remove .projectStore since it's directly in root
    console.log(currentTask)
    const {
      fetchAllProjectData,
      fetchTeamInfo,
      clearProjectData,
      setProjectData,
      setProjectPhotos,
      setProjectTeamTechs,
      setProjectSchedule,
      setTaskPhotos,
      setTeamInfo,
      setLoading,
      setError,

        findProjectTasks,
      clearProjectTasks
    } = useStoreActions(actions => actions); // Remove .projectStore since it's directly in root

    const projects = useStoreState(state => state.projects)
    const [activePage, setActivePage] = useState('details')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    
    // const { 
    //     currentParentTask, 
    //     currentTaskPhase, 
    //     isLoading: currentIsLoading, 
    //     fetchError: tasksFetchError, 
    //     projectExists, 
    //     fetchedData, 
    //     projectCompleted,
    //     projectedTask,
    //     isBehindSchedule,
    //     onHold
    // } = useFindProjectTask(projId, proj)

    const isProjectsReady = Array.isArray(projects) && projects.length > 0;
    const [role, setRole] = useState(null)
    console.log(fetchedData)
    console.log(isBehindSchedule)
    
    useEffect(() => {
        const userRole = sessionStorage.getItem('roles');
        setRole(userRole);
    }, []);

    // Consolidated useEffect for all data fetching
    useEffect(() => {
      if (projId) {
        // Check if we already have the data to avoid refetching
        if (!proj || Object.keys(proj).length === 0) {
          fetchAllProjectData(projId);
        }
      }

      // Cleanup function - clear data when component unmounts
      return () => {
        // Only clear if we're actually leaving the project page
        // You might want to remove this or handle it differently
         //clearProjectData();
      };
    }, [projId, fetchAllProjectData, proj]);

    // Fetch team info when project data is available
    useEffect(() => {
      if (proj && proj.id && isProjectsReady) {
        fetchTeamInfo({ projId, projData: proj });
      }
    }, [proj, projId, isProjectsReady, fetchTeamInfo]);

    useEffect(() => {
      if (proj && proj.id) {
        findProjectTasks({ projectId: projId, projectData: proj });
      }
    }, [proj, projId, findProjectTasks]);

    // Initialize form data when project data loads
    useEffect(() => {
      if (proj && Object.keys(proj).length > 0) {
        setFormData(proj);
        setValues(proj);
      }
    }, [proj]);

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
            
            // Refresh project data after save
            fetchAllProjectData(projId);
            
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

    const teamsOnClick = () => {
        setActivePage(`teams`)
    }

    const documentsOnClick = () => {
        setActivePage(`documents`)
    }

    const holdOnClick = () => {
        setActivePage('hold')
    }

    const handleDailyReportClick = () => {
        navigate(`report`)
    }

    // Show loading state
    if (isLoading && !proj) {
      return (
        <div className="Content ProjectPage">
          <div className="loading-state">
            <l-grid size="60" speed="1.5" color="#315a95"></l-grid>
            <p>Loading project data...</p>
          </div>
        </div>
      );
    }

    // Show error state
    if (error && !proj) {
      return (
        <div className="Content ProjectPage">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Project</h3>
            <p>{error}</p>
            <button onClick={() => fetchAllProjectData(projId)}>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
        <div className="Content ProjectPage">
            <div className="project-header">
                <h2>{values.lift_name || proj?.lift_name}</h2>
                    <div className="action-buttons">
                        <div 
                            onClick={() => setActivePage('details')}
                            className={activePage === 'details' ? 'active' : ''}
                        >
                            Details
                        </div>
                        {(sessionStorage.getItem('roles') === 'Project Engineer' ||
                        sessionStorage.getItem('roles') === 'Project Manager') && (
                            <>
                            <div 
                                onClick={progressOnClick}
                                className={activePage === 'progress' ? 'active' : ''}
                            >
                                Progress
                            </div>
                            <div 
                                onClick={teamsOnClick}
                                className={activePage === 'teams' ? 'active' : ''}
                            >
                                Team
                            </div>
                            <div 
                                onClick={documentsOnClick}
                                className={activePage === 'documents' ? 'active' : ''}
                            >
                                Documents
                            </div>
                            <div 
                                onClick={holdOnClick}
                                className={activePage === 'hold' ? 'active' : ''}
                            >
                                Put on Hold
                            </div>                        
                            </>
                        )}
                    </div>
            </div>
            
            {
                activePage === 'details' && 
                <ProjectDetails 
                    projectCompleted={projectCompleted}
                    currentTask={currentTask}
                    currentParentTask={currentParentTask}
                    currentIsLoading={tasksIsLoading} // Use tasksIsLoading from store
                    tasksFetchError={null} // You can handle errors in the store if needed
                    projectExists={projectExists}
                    fetchedData={projSched} // Use projectSchedule from store
                    proj={proj}
                    setFormData={setFormData}
                    projIsLoading={isLoading}
                    formData={formData}
                    teamInfo={teamInfo}
                    teamIsLoading={isLoading}
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
                    photos={photos}
                    photosIsLoading={isLoading}
                    backendURL={import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}
                    setActivePage={setActivePage}
                    currentTaskPhase={currentTaskPhase}
                    projectedTask={projectedTask}
                    isBehindSchedule={isBehindSchedule}
                    onHold={onHold}
                />
            }
            {
                activePage === 'progress' &&
                <ProjectProgress 
                    allTaskDates={tasks} 
                    projId={projId} 
                    projSched={projSched} 
                    projSchedIsLoading={isLoading}
                    taskPhotos={taskPhotos}
                    currentTask={currentTask}
                />
            }
            {
                activePage === 'documents' &&
                <ProjectDocuments/>
            }
            {
                activePage === 'teams' &&
                <ProjectTeam teamInfo={teamInfo} proj={proj} teamTechs={teamTechs} projId={projId} />
            }
            {
                activePage === 'pms_entry' &&
                <PMS_Entry />
            }
            {
                activePage === 'qaqc' &&
                <RequestQAQC proj={proj} currentTask={currentTask}/>
            }       
            {
                activePage === 'hold' &&
                <RequestHold proj={proj} currentTask={currentTask}/>
            }       
            {
                activePage === 'task' &&
                <TaskDetails 
                    currentTask={currentTask} 
                    currentParentTask={currentParentTask} 
                    currentTaskPhase={currentTaskPhase}
                    proj={proj}
                    ConfirmationModal={ConfirmationModal}
                    fetchedData={fetchedData}
                />
            }
            
            {/* Floating Daily Report Button */}
            <button 
                className="floating-daily-report-btn" 
                onClick={handleDailyReportClick}
                style={{ display: role === 'Foreman' ? 'flex' : 'none' }}
            >
                <i className="fas fa-file-alt"></i>
                Make Daily Project Report
            </button>
        </div>
    )
}

export default ProjectInfo