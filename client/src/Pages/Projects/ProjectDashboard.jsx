import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/ProjectDashboard.css'
import {
  Schedule as ScheduleIcon,
  Task as TaskIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  Engineering as EngineeringIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  ListAlt as ListIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  BuildCircle as BuildCircleIcon
} from '@mui/icons-material';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid as LoaderGrid } from 'ldrs/react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { Axios } from '../../api/axios.js';
import { useSharedSocket } from '../../Context/SocketContext.js';

// Utility function
const formatLocalDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", { timeZone: "Asia/Manila" });
};

// Move SchedulingCard component outside the main component
const SchedulingCard = ({ 
  proj, 
  role, 
  QAQCCoordinatorId, 
  ProjectManagerId, 
  TNCCoordinatorId, 
  PMSCoordinatorId, 
  utilitiesSocket, 
  fetchAllProjectData,
  projId 
}) => {
  const [schedulingModal, setSchedulingModal] = useState({
    isOpen: false,
    type: '', // 'qaqc', 'tnc', or 'pms'
    data: null
  });
  const [saveStatus, setSaveStatus] = useState('');

  const qaqcReasons = ['Template Setting', 'Prior Testing and Commissioning', 'Handover'];

  const formatDateForMySQL = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const openSchedulingModal = (type) => {
    setSchedulingModal({
      isOpen: true,
      type: type,
      data: {
        date: new Date(),
        reason: type === 'qaqc' ? 'Template Setting' : 'Final Inspection'
      }
    });
  };

  const closeSchedulingModal = () => {
    setSchedulingModal({ isOpen: false, type: '', data: null });
  };

  const handleScheduleConfirm = async () => {
    setSaveStatus('saving');
    
    try {
      const payload = {
        scheduled_date: formatDateForMySQL(schedulingModal.data.date),
        project_id: proj.id
      };
      
      const Ids = schedulingModal.type === 'qaqc' 
        ? [QAQCCoordinatorId, ProjectManagerId] 
        : schedulingModal.type === 'tnc'
        ? [TNCCoordinatorId, ProjectManagerId]
        : [PMSCoordinatorId, ProjectManagerId];
      
      if (schedulingModal.type === 'qaqc') {
        payload.reason = schedulingModal.data.reason;
      }
     
      const response = await Axios.post(`/api/projects/${schedulingModal.type}/request/${proj.id}`, payload);
      
      if (!response.data?.success) {
        window.alert("Something went wrong during assignment.");
        return;
      }

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket emit timeout"));
        }, 5000); 

        utilitiesSocket.emit("new_notification", {
          subject: 'Request for Inspection',
          body: `Inspection to be conducted for ${proj.lift_name} (Client: ${proj.client}) at ${payload.scheduled_date}${schedulingModal.type === 'qaqc' ? ` for ${payload.reason}` : ''}`,
          Ids
        }, (ack) => {
          clearTimeout(timeout);
          if (ack?.success) {
            utilitiesSocket.emit("refresh_project_data");
            resolve();
          } else {
            reject(new Error("Server failed to process notification."));
          }
        });
      });
      
      window.alert("Request for Inspection sent");
      setSaveStatus('success');
      utilitiesSocket.emit('update_task_status');
      utilitiesSocket.emit('refresh_all_projects');
      closeSchedulingModal();
      
      // Refresh project data to get updated status
      await fetchAllProjectData(projId);
      
    } catch (error) {
      console.error(`Error scheduling ${schedulingModal.type.toUpperCase()}:`, error);
      setSaveStatus('error');
      window.alert("Failed to schedule inspection. Please try again.");
    }
  };

  const getInspectionStatus = (type) => {
    switch(type) {
      case 'qaqc':
        if (proj.qaqc_ongoing) return { status: 'ongoing', label: 'In Progress', date: proj.qaqc_inspection_date };
        if (proj.qaqc_is_assigned) return { status: 'scheduled', label: 'Scheduled', date: proj.qaqc_inspection_date };
        return { status: 'available', label: 'Not Scheduled', date: null };
      
      case 'tnc':
        if (proj.tnc_ongoing) return { status: 'ongoing', label: 'In Progress', date: proj.tnc_assign_date };
        if (proj.tnc_is_assigned) return { status: 'scheduled', label: 'Scheduled', date: proj.tnc_assign_date };
        return { status: 'available', label: 'Not Scheduled', date: null };
      
      case 'pms':
        if (proj.pms_ongoing) return { status: 'ongoing', label: 'In Progress', date: proj.pms_joint_inspection };
        if (proj.pms_is_assigned) return { status: 'scheduled', label: 'Scheduled', date: proj.pms_joint_inspection };
        return { status: 'available', label: 'Not Scheduled', date: null };
      
      default:
        return { status: 'available', label: 'Not Scheduled', date: null };
    }
  };

  const InspectionItem = ({ type, title, icon: Icon }) => {
    const status = getInspectionStatus(type);
    console.log(type)
    console.log(status)
    console.log(Icon)
    const canSchedule = status.status === 'available' && 
      ((type === 'tnc') || 
       (type === 'pms') || 
       type === 'qaqc');
    console.log(canSchedule)
    return (
      <div className="inspection-item">
        <div className="inspection-header">
          <Icon className="inspection-icon" />
          <div className="inspection-info">
            <h4>{title}</h4>
            <div className="inspection-status">
              <span className={`status-badge ${status.status}`}>
                {status.label}
              </span>
              {status.date && (
                <span className="scheduled-date">
                  {formatLocalDate(status.date)}
                </span>
              )}
            </div>
          </div>
        </div>
        {canSchedule && (
          <button 
            className="schedule-btn compact"
            onClick={() => openSchedulingModal(type)}
          >
            Schedule
          </button>
        )}
      </div>
    );
  };

  if (role !== 'Project Engineer') return null;

  return (
    <>
      <div className="dashboard-card scheduling-card compact">
        <div className="card-header">
          <ScheduleIcon className="card-icon" />
          <h3>Schedule Inspections</h3>
        </div>
        <div className="card-content">
          <InspectionItem 
            type="qaqc" 
            title="QAQC Inspection" 
            icon={BuildIcon} 
          />
          
      
            <InspectionItem 
              type="tnc" 
              title="Testing & Commissioning" 
              icon={SettingsIcon} 
            />
   
          
     
            <InspectionItem 
              type="pms" 
              title="PMS Final Inspection" 
              icon={BuildCircleIcon} 
            />
       
        </div>
      </div>

      {/* Scheduling Modal */}
      {schedulingModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content scheduling-modal">
            <div className="modal-header">
              <h3>Schedule {schedulingModal.type.toUpperCase()} Inspection</h3>
              <button className="modal-close" onClick={closeSchedulingModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="schedule-form">
                <div className="form-group">
                  <label>Inspection Date</label>
                  <input
                    type="date"
                    value={schedulingModal.data.date.toISOString().split('T')[0]}
                    onChange={(e) => setSchedulingModal(prev => ({
                      ...prev,
                      data: { ...prev.data, date: new Date(e.target.value) }
                    }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="date-input"
                  />
                </div>
                
                {schedulingModal.type === 'qaqc' && (
                  <div className="form-group">
                    <label>Inspection Reason</label>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={schedulingModal.data.reason}
                        onChange={(e) => setSchedulingModal(prev => ({
                          ...prev,
                          data: { ...prev.data, reason: e.target.value }
                        }))}
                      >
                        {qaqcReasons.map((reason, index) => (
                          <MenuItem key={index} value={reason}>{reason}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
                
                <div className="inspection-summary">
                  <h4>Summary</h4>
                  <div className="summary-item">
                    <strong>Type:</strong> {schedulingModal.type.toUpperCase()} Inspection
                  </div>
                  <div className="summary-item">
                    <strong>Date:</strong> {formatDisplayDate(schedulingModal.data.date)}
                  </div>
                  {schedulingModal.type === 'qaqc' && (
                    <div className="summary-item">
                      <strong>Reason:</strong> {schedulingModal.data.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeSchedulingModal} className="btn-cancel">
                Cancel
              </button>
              <button 
                onClick={handleScheduleConfirm} 
                className="btn-confirm" 
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main ProjectDashboard component
const ProjectDashboard = ({
    handleTaskDetails,
    handleCreateSchedule,
    progressOnClick,
    setActivePage,
    isLoaded
}) => {
  const { projId } = useParams();
  const { utilitiesSocket } = useSharedSocket();

  // EasyPeasy store state and actions
  const {
    projectData: proj,
    currentTask,
    currentParentTask,
    projectedTask,
    isBehindSchedule,
    onHold,
    isLoading,
    tasksIsLoading,
    error,
    employees,
    allTeams
  } = useStoreState(state => state);
  console.log(allTeams)
  const { fetchAllProjectData } = useStoreActions(action => action);

  // Get coordinators
  const QAQCCoordinator = employees?.find(e => e.job === 'QAQC Coordinator');
  const ProjectManager = employees?.find(e => e.job === 'Project Manager');
  const TNCCoordinator = employees?.find(e => e.job === 'TNC Coordinator');
  const PMSCoordinator = employees?.find(e => e.job === 'PMS Coordinator');
  
  const QAQCCoordinatorId = QAQCCoordinator?.employee_id;
  const ProjectManagerId = ProjectManager?.employee_id;
  const TNCCoordinatorId = TNCCoordinator?.employee_id;
  const PMSCoordinatorId = PMSCoordinator?.employee_id;

  const role = sessionStorage.getItem('roles');
  const omitPhases = [100, 200, 300, 400];
  const includeTncSchedule = !(omitPhases.includes(currentTask?.task_parent));

  // const handleResumeProject = async () => {
  //   console.log('Resuming project:', projId);
  // };

  // const handleNavigateToProgress = () => {
  //   navigate(`/projects/${projId}/progress`);
  // };

  const handleNavigateToDetails = () => {
    setActivePage('details')
  };

 // Loading state
  if (isLoaded || tasksIsLoading || isLoading) {
    return (
      <div className="Content ProjectDashboard">
        <div className="dashboard-loading">
          <LoaderGrid size="60" speed="1.5" color="#315a95" />
          <p>Loading project dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !proj) {
    return (
      <div className="Content ProjectDashboard">
        <div className="dashboard-error">
          <WarningIcon className="error-icon" />
          <h3>Error Loading Project</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={() => fetchAllProjectData(projId)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No project data
  if (!proj) {
    return (
      <div className="Content ProjectDashboard">
        <div className="dashboard-error">
          <WarningIcon className="error-icon" />
          <h3>Project Not Found</h3>
          <p>The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Content ProjectDashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>{proj?.lift_name}</h1>
        <p>Project Dashboard - Overview & Progress Tracking</p>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="dashboard-card progress-card">
          <div className="card-header">
            <TrendingUpIcon className="card-icon" />
            <h3>Project Progress</h3>
          </div>
          <div className="card-content">
            <div className="progress-section">
              <div className="progress-label">
                <span>Overall Completion</span>
                <span className="progress-percent">{proj?.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${proj?.progress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Contract Amount</span>
                <span className="stat-value">₱{proj?.contract_amount || '0.00'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`status-chip ${proj?.status?.toLowerCase().replace(' ', '-')}`}>
                  {proj?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      {console.log(onHold)}
        {/* Current Phase Card */}
        <div className="dashboard-card phase-card">
          <div className="card-header">
            <TimelineIcon className="card-icon" />
            <h3>Current Phase</h3>
          </div>
          <div className="card-content">
            {onHold ? (
              <div className="hold-state">
                <WarningIcon className="hold-icon" />
                <h4>Project On Hold</h4>
                <p>{proj?.hold_reason || 'No reason provided'}</p>
                {proj?.will_resume && (
                  <p className="resume-date">
                    Resuming on: {formatLocalDate(proj.resume_date)}
                  </p>
                )}
                {/* <button className="btn-resume" onClick={handleResumeProject}>
                  <PlayArrowIcon className="btn-icon" />
                  Resume Project
                </button> */}
              </div>
            ) : currentParentTask ? (
              <div className="phase-info">
                <h4>{currentParentTask.task_name}</h4>
                <div className="phase-dates">
                  <CalendarIcon className="date-icon" />
                  <span>
                    {formatLocalDate(currentParentTask.task_start)} - {formatLocalDate(currentParentTask.task_end)}
                  </span>
                </div>
                <div className="phase-duration">
                  Duration: {currentParentTask.task_duration} days
                </div>
              </div>
            ) : (
              <div className="no-phase">
                <p>No active phase</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Task Card */}
        <div className="dashboard-card task-card">
          <div className="card-header">
            <TaskIcon className="card-icon" />
            <h3>Current Task</h3>
            <span className="active-badge">ACTIVE</span>
          </div>
          <div className="card-content">
            {currentTask ? (
              <div className="task-info">
                <h4>{currentTask.task_name}</h4>
                <div className="task-dates">
                  <CalendarIcon className="date-icon" />
                  <span>
                    {formatLocalDate(currentTask.task_start)} - {formatLocalDate(currentTask.task_end)}
                  </span>
                </div>
                <div className="task-meta">
                  <span className="task-duration">Duration: {currentTask.task_duration} days</span>
                  <span className={`task-status ${currentTask.task_done ? 'completed' : 'in-progress'}`}>
                    {currentTask.task_done ? (
                      <>
                        <CheckCircleIcon className="status-icon" />
                        Completed
                      </>
                    ) : (
                      <>
                        <ScheduleIcon className="status-icon" />
                        In Progress
                      </>
                    )}
                  </span>
                </div>
                <div className="task-progress">
                  <span className="progress-label">Progress Contribution</span>
                  <div className="progress-bar small">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${currentTask.task_percent}%` }}
                    ></div>
                  </div>
                  <span className="progress-percent">{currentTask.task_percent}%</span>
                </div>
                <button onClick={handleTaskDetails}>More Info</button>
              </div>
            ) : (
              <div className="no-task">
                <p>No current task scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Use the external SchedulingCard component */}
        <SchedulingCard 
          proj={proj}
          role={role}
          includeTncSchedule={includeTncSchedule}
          QAQCCoordinatorId={QAQCCoordinatorId}
          ProjectManagerId={ProjectManagerId}
          TNCCoordinatorId={TNCCoordinatorId}
          PMSCoordinatorId={PMSCoordinatorId}
          utilitiesSocket={utilitiesSocket}
          fetchAllProjectData={fetchAllProjectData}
          projId={projId}
        />

        {/* Schedule Status Card */}
        <div className="dashboard-card schedule-card">
          <div className="card-header">
            <ScheduleIcon className="card-icon" />
            <h3>Schedule Status</h3>
          </div>
          <div className="card-content">
            {isBehindSchedule && projectedTask && (
              <div className="schedule-warning">
                <WarningIcon className="warning-icon" />
                <div className="warning-content">
                  <h4>Behind Schedule</h4>
                  <p>Projected: {projectedTask.task_name}</p>
                  <p className="warning-dates">
                    {formatLocalDate(projectedTask.task_start)} - {formatLocalDate(projectedTask.task_end)}
                  </p>
                </div>
              </div>
            )}

            {!proj?.schedule_created ? (
              <div className="no-schedule">
                <p>No schedule created</p>
                <button className="btn-create-schedule" onClick={handleCreateSchedule}>
                  <AssignmentIcon className="btn-icon" />
                  Create Schedule
                </button>
              </div>
            ) : (
              <div className="schedule-created">
                <div className="schedule-status success">
                  <CheckCircleIcon className="status-icon" />
                  Schedule Created
                </div>
                <p>Project is properly scheduled</p>
                <button className="btn-view-schedule" onClick={() => setActivePage('progress')}>
                  View Schedule
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Info Card */}
        <div className="dashboard-card info-card">
          <div className="card-header">
            <EngineeringIcon className="card-icon" />
            <h3>Project Details</h3>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Lift Name</span>
                <span className="info-value">{proj?.lift_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Client</span>
                <span className="info-value">{proj?.client}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Capacity</span>
                <span className="info-value">{proj?.cap} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Speed</span>
                <span className="info-value">{proj?.speed} m/s</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Location</span>
                <span className="info-value">
                  {proj?.['city/municipality']}, {proj?.province}
                </span>
              </div>
            </div>
            <button className="btn-view-details" onClick={handleNavigateToDetails}>
              <InfoIcon className="btn-icon" />
              View Full Details
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <div className="card-header">
            <ListIcon className="card-icon" />
            <h3>Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="actions-list">
              <button className="action-btn" onClick={progressOnClick}>
                <TrendingUpIcon className="action-icon" />
                View Progress
              </button>
              <button className="action-btn" onClick={() => setActivePage('details')}>
                <EngineeringIcon className="action-icon" />
                Project Details
              </button>
              <button className="action-btn" onClick={() => setActivePage('documents')}>
                <AssignmentIcon className="action-icon" />
                Documents
              </button>
              <button className="action-btn" onClick={() => setActivePage('teams')}>
                <EngineeringIcon className="action-icon" />
                Project Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;