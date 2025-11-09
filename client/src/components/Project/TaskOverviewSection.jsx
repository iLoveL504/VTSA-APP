import React from 'react';
import { Grid } from 'ldrs/react'
// 🕒 Utility
const formatLocalDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", { timeZone: "Asia/Manila" });
};

// Sub-components
const LaggingTaskInfo = ({ projectedTask }) => {
  if (!projectedTask) return null;
  
  return (
    <div className="lagging-task-info">
      <h2>Lagging behind schedule</h2>
      <div className="lagging-task-title">
        <strong>Projected Task:</strong> {projectedTask.task_name}
      </div>
      <div className="lagging-task-dates">
        {formatLocalDate(projectedTask.task_start)} - {formatLocalDate(projectedTask.task_end)}
        ({projectedTask.task_duration} days) •
      </div>
    </div>
  );
};

const ProjectProgress = ({ progress, contractAmount, status }) => (
  <div className="progress-container">
    <div className="progress-header">
      <span className="progress-label">Overall Completion</span>
      <span className="progress-percent">{progress}%</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
    <div className="progress-stats">
      <span className="stat-item">
        <strong>Contract Amount:</strong> ₱{contractAmount}
      </span>
      <span className="stat-item">
        <strong>Status:</strong> {status}
      </span>
    </div>
  </div>
);

const OverarchingTaskInfo = ({ 
  currentParentTask, 
  proj, 
  onHold, 
  onResumeProject 
}) => {
  if (!currentParentTask || Object.keys(currentParentTask).length === 0) return null;

  if (onHold) {
    return (
      <div className="overarching-task-info hold">
        <div>
          <div className="overarching-task-title">
            <strong>Last Task Completed Before Hold:</strong> {proj.current_task}
          </div>
          <div className="overarching-task-dates">
            Date on hold: 
            {currentParentTask?.task_start && (
              <>{formatLocalDate(currentParentTask.task_start)} - </>
            )}
            {proj.hold_date ? formatLocalDate(proj.hold_date) : "N/A"}
          </div>
        </div>
        <button onClick={onResumeProject}>Resume Project</button>
      </div>
    );
  }

  return (
    <div className="overarching-task-info">
      <div className="overarching-task-title">
        <strong>Current Phase:</strong> {currentParentTask.task_name}
      </div>
      <div className="overarching-task-dates">
        {formatLocalDate(currentParentTask.task_start)} - {formatLocalDate(currentParentTask.task_end)}
        ({currentParentTask.task_duration} days) •
      </div>
    </div>
  );
};

const QAQCInspection = ({ role, inspectionReason, inspectionDate, onInspect }) => {
  if (role === 'QAQC') {
    return (
      <div className="overarching-task-info">
        <h3>QAQC Inspection:</h3>
        {inspectionReason}
        <button onClick={onInspect}>
          Proceed with QAQC Inspection
        </button>
      </div>
    );
  }

  return inspectionDate ? (
    <div className="overarching-task-info">
      <h3>QAQC Inspection</h3>
      <p>Date: {formatLocalDate(inspectionDate)}</p>
    </div>
  ) : null;
};

// Task Cards Components
const CurrentTaskCard = ({ currentTask, role}) => {
  if (!currentTask || Object.keys(currentTask).length === 0) {
    return (
      <div className="task-empty-state">
        <i className="fas fa-check-circle"></i>
        <div className="empty-message">No current tasks scheduled</div>
        <div className="empty-submessage">All tasks are completed or not scheduled yet</div>
      </div>
    );
  }

  const renderCompleteButton = () => {
    if (role === 'Project Engineer') {
      return (
        <button 
          className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
          disabled={currentTask.task_done === 1 || currentTask.task_approval === 0} 
        >
          <i className="fas fa-check"></i>
          {currentTask.task_done === 1 ? 'Completed' : 'Mark Complete'}
        </button>
      );
    } else if (role === 'Foreman') {
      return (
        <button 
          className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}
          disabled={currentTask.task_approval === 1} 
        >
          <i className="fas fa-check"></i>
          {currentTask.task_done === 1 ? 'Completed' : currentTask.task_approval === 1 ? 'Confirmation Pending' : 'Task Done'}
        </button>
      );
    } else {
      return (
        <button className={`complete-btn ${currentTask.task_done === 1 ? 'completed' : ''}`}>
          <i className="fas fa-check"></i>
          {currentTask.task_done === 1 ? 'Completed' : 'Pending'}
        </button>
      );
    }
  };

  return (
    <div className="task-card-content">
      <div className="task-name">
        {currentTask.task_name}
        {renderCompleteButton()}
      </div>
      <div className="task-dates">
        <div className="task-date">
          <i className="fas fa-play-circle"></i>
          Start: {formatLocalDate(currentTask.task_start)}
        </div>
        <div className="task-date">
          <i className="fas fa-flag-checkered"></i>
          End: {formatLocalDate(currentTask.task_end)}
        </div>
        <div className="task-duration">
          <i className="fas fa-clock"></i>
          Duration: {currentTask.task_duration} days
        </div>
      </div>
      <div className="task-progress">
        <span>Progress Contribution: {currentTask.task_percent}%</span>
      </div>
    </div>
  );
};

const ParentTaskCard = ({ currentTaskPhase }) => {
  if (!currentTaskPhase || Object.keys(currentTaskPhase).length === 0) {
    return (
      <div className="task-empty-state">
        <i className="fas fa-project-diagram"></i>
        <div className="empty-message">No parent project</div>
        <div className="empty-submessage">This task is standalone</div>
      </div>
    );
  }

  return (
    <div className="task-card-content">
      <div className="task-name">{currentTaskPhase.task_name}</div>
      <div className="task-dates">
        <div className="task-date">
          <i className="fas fa-play-circle"></i>
          Start: {formatLocalDate(currentTaskPhase.task_start)}
        </div>
        <div className="task-date">
          <i className="fas fa-flag-checkered"></i>
          End: {formatLocalDate(currentTaskPhase.task_end)}
        </div>
        <div className="task-duration">
          <i className="fas fa-clock"></i>
          Duration: {currentTaskPhase.task_duration} days
        </div>
      </div>
    </div>
  );
};

const NoScheduleCard = ({ role, onCreateSchedule }) => {
  return (
    <div className='no-schedule-card'>
      {role === 'Project Engineer' ? (
        <button onClick={onCreateSchedule}>Create Schedule</button>
      ) : (
        <div>Schedule to be created</div>
      )}
    </div>
  );
};

const TaskCardsContainer = ({
  projectCompleted,
  projectExists,
  currentTask,
  currentTaskPhase,
  role,
  onTaskDetails,
  onCreateSchedule
}) => {
  console.log(projectExists)
  if (projectCompleted) {
    return <div>Project Completed</div>;
  }

  if (!projectExists) {
    return <NoScheduleCard role={role} onCreateSchedule={onCreateSchedule} />;
  }

  return (
    <div className="task-cards-container">
      <div className="task-card current-task-card" onClick={onTaskDetails}>
        <div className="task-card-header">
          <h4>Current Task</h4>
          <span className="priority-badge">ACTIVE</span>
        </div>
        <CurrentTaskCard currentTask={currentTask} role={role} onTaskDetails={onTaskDetails} />
      </div>

      <div className="task-card parent-task-card" onClick={onTaskDetails}>
        <div className="task-card-header">
          <h4>Parent Project</h4>
          <span className="project-badge">OVERVIEW</span>
        </div>
        <ParentTaskCard currentTaskPhase={currentTaskPhase} onTaskDetails={onTaskDetails} />
      </div>
    </div>
  );
};

const TaskOverviewSection = ({
  onHold,
  isBehindSchedule,
  projectedTask,
  currentParentTask,
  proj,
  onResumeProject,
  onTaskDetails,
  role,
  projectCompleted,
  projectExists,
  currentTask,
  currentTaskPhase,
  onCreateSchedule,
  taskIsLoading
}) => {
    if (taskIsLoading) {

        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }

  return (
    <div className="task-overview-section">
      <h3>{onHold ? 'Project is pending' : 'Task Overview'}</h3>
      
      {!onHold && isBehindSchedule && (
        <LaggingTaskInfo 
          projectedTask={projectedTask} 
          currentParentTask={currentParentTask} 
        />
      )}

      <OverarchingTaskInfo
        currentParentTask={currentParentTask}
        proj={proj}
        onHold={onHold}
        onResumeProject={onResumeProject}
      />

      <h3>Project Progress</h3>
      <ProjectProgress
        progress={proj.progress}
        contractAmount={proj.contract_amount}
        status={proj.status}
      />

      <QAQCInspection
        role={role}
        inspectionReason={proj.qaqc_inspection_reason}
        inspectionDate={proj.qaqc_inspection_date}
        onInspect={onTaskDetails}
      />

      {!onHold && (
        <TaskCardsContainer
          projectCompleted={projectCompleted}
          projectExists={projectExists}
          currentTask={currentTask}
          currentTaskPhase={currentTaskPhase}
          role={role}
          onTaskDetails={onTaskDetails}
          onCreateSchedule={onCreateSchedule}
        />
      )}
    </div>
  );
};

export default TaskOverviewSection;
