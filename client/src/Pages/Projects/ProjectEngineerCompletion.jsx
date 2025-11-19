import React, { useMemo } from 'react';
import { useStoreState } from 'easy-peasy';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';

const ProjectEngineerCompletion = ({ currentTask, handleTaskComplete, proj, values, handleContractChange, updatePhotos }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  // Base approval requirements
  const approvalRequirements = {
    'Template Setting': ['Foreman', 'QAQC'],
    'Installation of Pit Ladder / Hoistway Lighting': ['QAQC', 'TNC'],
    'Final Cleaning / Hand over': ['QAQC', 'TNC', 'PMS'],
    'Final Testing / Hand over': ['QAQC', 'TNC', 'PMS'],
  };
  
  const {taskPhotos} = useStoreState(state => state)
  console.log(taskPhotos)

  // Determine required approvals
  const requiredApprovals = useMemo(() => {
    if (!(currentTask?.task_parent >= 600 || currentTask?.task_parent >= 500)) {
      if (proj.qaqc_approval) {
        return ['QAQC']
      } else return []
    }
    
    if (currentTask?.task_parent === 600) {
      if (currentTask.task_name === 'Final Testing / Hand over' || currentTask.task_name === 'Final Cleaning / Hand over') {
        return ['QAQC', 'TNC', 'PMS'];
      }
      return ['TNC'];
    }

    return approvalRequirements[currentTask?.task_name] || ['Foreman'];
  }, [currentTask]);

  // Compute if all required approvals are met
  const canConfirmCompletion = useMemo(() => {
    const checks = {
      Foreman: currentTask.task_approval === 1,
      QAQC: !requiredApprovals.includes('QAQC') || proj.qaqc_approval !== 1,
      TNC: !requiredApprovals.includes('TNC') || currentTask.task_approval === 1,
      PMS: !requiredApprovals.includes('PMS') || proj.pms_approval !== 1,
    };
    return requiredApprovals.every(role => checks[role]);
  }, [currentTask, proj, requiredApprovals]);
  
  // Identify which roles are still pending
  const pendingApprovals = requiredApprovals.filter(role => {
    if (role === 'Foreman' && currentTask.task_approval !== 1) return true;
    if (role === 'QAQC' && proj.qaqc_approval === 1) return true;
    if (role === 'TNC' && currentTask.task_approval === 0) return true;
    if (role === 'PMS' && proj.pms_approval === 1) return true;
    return false;
  });

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files)
    const typedFiles = files.map(file => {
      const customFile = new File([file], `${type}_${file.name}`, {
        type: file.type,
        lastModified: file.lastModified
      })
      Object.defineProperty(customFile, 'fileType', {
        value: type,
        writable: false
      })
      return customFile
    })
    handleContractChange({
      target: { files: typedFiles }
    })
  }

  const getFilesByType = (type) => {
    return values.photos?.filter(file => {
      const fileType = file.fileType || (file.name?.startsWith(`${type}_`) ? type : null)
      return fileType === type
    }) || []
  }

  const getHandoverFiles = () => {
    return getFilesByType('handover_document')
  }

  const isUploadComplete = () => {
    return getHandoverFiles().length > 0
  }

  const removeFile = (fileToRemove) => {
    const updated = values.photos?.filter(f => f !== fileToRemove)
    updatePhotos(updated)
  }

  return (
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
          <AssignmentIcon className="TaskDetails__section-icon" />
          <h4>
            {currentTask.task_name === 'Final Cleaning / Hand over' ? (
              !currentTask.task_done ? 'Prepare for Project Hand Over' : 'Project Completed'
            ) : currentTask?.task_done === 1 ? "Task Completion Status" : "Proof of Completion"}
          </h4>
        </div>
        
        <div className="TaskDetails__completion-content">
          {currentTask?.task_done === 1 ? (
            <div className="TaskDetails__completed-state">
              <div className="TaskDetails__completion-success">
                <div className="TaskDetails__success-message">
                  <CheckCircleIcon className="TaskDetails__success-icon" />
                  <h5>Task Fully Completed</h5>
                  <p>This task has been completed and approved.</p>
                </div>
              </div>
              <div className="TaskDetails__completion-details">
                <div className="TaskDetails__detail-row">
                  <span className="TaskDetails__detail-label">Final Status:</span>
                  <span className="TaskDetails__status-badge TaskDetails__status-badge--completed">
                    Completed & Approved
                  </span>
                </div>
                <div className="TaskDetails__detail-row">
                  <span className="TaskDetails__detail-label">Progress:</span>
                  <span className="TaskDetails__detail-value">100% Complete</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="TaskDetails__approval-pending">
              <div className="TaskDetails__pending-info">
                <div className="TaskDetails__pending-message">
                  <ScheduleIcon className="TaskDetails__pending-icon" />
                  <h5>Awaiting Completion</h5>
                  <p>This task is pending completion approvals.</p>
                </div>
              </div>

              {currentTask.task_name === 'Final Cleaning / Hand over' && (
                <div className="TaskDetails__document-upload-card">
                  <div className="TaskDetails__document-header">
                    <span className="TaskDetails__document-label">Supporting Evidence</span>
                    <span className="TaskDetails__upload-optional">Optional</span>
                  </div>

                  <div className="TaskDetails__upload-area TaskDetails__document-upload">
                    <input 
                      type="file"
                      id="handover_document"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'handover_document')}
                    />
                    <div className="TaskDetails__upload-hint">
                      <CloudUploadIcon className="TaskDetails__upload-icon" />
                      <span>Click to upload evidence photos</span>
                      <small>Attach supporting photos documenting the handover process</small>
                    </div>
                  </div>

                  <div className="TaskDetails__uploaded-files-list">
                    {getHandoverFiles().map((file, index) => (
                      <div key={index} className="TaskDetails__uploaded-file-item">
                        <span className="TaskDetails__file-name">
                          {file.name.replace('handover_document_', '')}
                        </span>
                        <button
                          type="button"
                          className="TaskDetails__remove-file-btn"
                          onClick={() => removeFile(file)}
                        >
                          <DeleteIcon className="TaskDetails__remove-icon" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={handleTaskComplete(currentTask, 'Project Engineer')}
                disabled={!(canConfirmCompletion && (currentTask.task_name !== 'Final Testing / Hand over' || isUploadComplete()))}
                className={`TaskDetails__confirm-completion-btn ${
                  (canConfirmCompletion && (currentTask.task_name !== 'Final Testing / Hand over' || isUploadComplete())) 
                    ? 'TaskDetails__confirm-completion-btn--ready' 
                    : 'TaskDetails__confirm-completion-btn--disabled'
                }`}
              >
                <EngineeringIcon className="TaskDetails__btn-icon" />
                {(canConfirmCompletion && (currentTask.task_name !== 'Final Testing / Hand over' || isUploadComplete())) ? (
                  'Confirm Task Completion'
                ) : (
                  `Waiting for ${pendingApprovals.join(', ')} Approval${pendingApprovals.length > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          )}
          
        </div>

      </div>
        <div className="photos-section">
          <h3>Photo Attachments</h3>
          <div className="images-grid">
            {taskPhotos.filter(t => t.task_id === currentTask.task_id).length > 0 ? (
              <>
              {taskPhotos.filter(t => t.task_id === currentTask.task_id).map((photo, index) => (
                  <div key={index} className="image-card">
                      <img 
                          src={`${backendURL}${photo.photo_url}`} 
                          alt={`Task photo ${index + 1}`}
                          className="service-image"
                      />
                      <div className="photo-actions">
                          <div className="image-actions">
                              <a 
                                  href={`${backendURL}${photo.photo_url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="view-button"
                              >
                                  View Full Size
                              </a>
                          </div>
                      </div>
                  </div>
              ))}                
              </>
            ) : (
              <div>
                No photos at the moment
              </div>
            )}
         
          </div>
        </div>
    </>
  );
};

export default ProjectEngineerCompletion;