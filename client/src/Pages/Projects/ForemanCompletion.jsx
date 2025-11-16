import React from 'react';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';

const ForemanCompletion = ({ currentTask, values, handleContractChange, handleApproval, proj }) => {
  return (
    <>
      {(currentTask.task_parent >= 500 || currentTask.task_parent >= 600) ? (
        <>
          {proj.qaqc_punchlist && (
            <div className="TaskDetails__punchlist-section">
              <div className="TaskDetails__punchlist-header">
                <WarningIcon className="TaskDetails__punchlist-icon" />
                <h4>Punch List Items to be Rectified</h4>
              </div>
              <div className="TaskDetails__punchlist-content">
                <WarningIcon className="TaskDetails__punchlist-info-icon" />
                <span>Please address all items before proceeding with task completion.</span>
              </div>
            </div>
          )}
          
          <div className="TaskDetails__completion-section TaskDetails__completion-section--emphasized">
            <div className="TaskDetails__section-header">
              <EngineeringIcon className="TaskDetails__section-icon" />
              <h4>
                {currentTask?.task_done === 1 
                  ? "Task Completed" 
                  : currentTask.task_approval === 1 
                    ? 'Task Pending for Completion' 
                    : "Complete Current Task"
                }
              </h4>
            </div>
            
            <div className="TaskDetails__completion-content">
              {currentTask?.task_done === 1 ? (
                <div className="TaskDetails__completed-state">
                  <div className="TaskDetails__completion-success">
                    <div className="TaskDetails__success-message">
                      <CheckCircleIcon className="TaskDetails__success-icon" />
                      <h5>Task Confirmed and Complete</h5>
                      <p>This task has been successfully completed and approved.</p>
                    </div>
                  </div>
                </div>
              ) : currentTask.task_approval === 1 ? (
                <div className="TaskDetails__completed-state">
                  <div className="TaskDetails__completion-success">
                    <div className="TaskDetails__success-message">
                      <ScheduleIcon className="TaskDetails__success-icon" />
                      <h5>Task Successfully Completed</h5>
                      <p>This task has been marked as complete and is awaiting final approval.</p>
                    </div>
                  </div>
                  <div className="TaskDetails__completion-details">
                    <div className="TaskDetails__detail-row">
                      <span className="TaskDetails__detail-label">Completion Date:</span>
                      <span className="TaskDetails__detail-value">
                        {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <div className="TaskDetails__detail-row">
                      <span className="TaskDetails__detail-label">Status:</span>
                      <span className="TaskDetails__status-badge TaskDetails__status-badge--pending-approval">
                        Awaiting Approval
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="TaskDetails__file-upload-section">
                    <div className="TaskDetails__upload-header">
                      <span className="TaskDetails__upload-label">Attach Completion Evidence</span>
                      <span className="TaskDetails__upload-required">* Required</span>
                    </div>
                    
                    <div className="TaskDetails__upload-area">
                      <input 
                        type="file"
                        id="photos"
                        name="photos"
                        multiple
                        accept="image/*"
                        onChange={handleContractChange}    
                      />
                      <div className="TaskDetails__upload-hint">
                        <CloudUploadIcon className="TaskDetails__upload-icon" />
                        <span>Click to upload photos or drag and drop</span>
                        <small>Document task completion with visual evidence</small>
                      </div>
                      
                      {values.photos.length > 0 && (
                        <div className="TaskDetails__uploaded-files-list">
                          {values.photos.map((p, index) => (
                            <div key={index} className="TaskDetails__uploaded-file-item">
                              <span className="TaskDetails__file-name">{p.name}</span>
                              <span className="TaskDetails__file-size">
                                ({(p.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="TaskDetails__complete-task-btn TaskDetails__complete-task-btn--primary"
                    onClick={handleApproval(currentTask, values.photos, 'foreman')}
                    disabled={values.photos.length === 0 || proj.qaqc_punchlist}
                  >
                    <CheckCircleIcon className="TaskDetails__btn-icon" />
                    Mark Task Complete
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="TaskDetails__info-card">
          <div className="TaskDetails__card-header">
            <ScheduleIcon className="TaskDetails__card-icon" />
            <h3>Project Status</h3>
          </div>
          <div className="TaskDetails__card-content">
            <p>Project not in mechanical installation phase yet.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ForemanCompletion;