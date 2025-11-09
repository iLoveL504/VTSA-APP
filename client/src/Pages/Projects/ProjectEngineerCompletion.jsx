import React, { useMemo } from 'react';

const ProjectEngineerCompletion = ({ currentTask, handleTaskComplete, proj, values, handleContractChange, updatePhotos }) => {
  // Base approval requirements
  const approvalRequirements = {
    'Template Setting': ['Foreman', 'QAQC'],
    'Installation of Pit Ladder / Hoistway Lighting': ['QAQC', 'TNC'],
    'Final Cleaning / Hand over': ['QAQC', 'TNC', 'PMS'],
    'Final Testing / Hand over': ['QAQC', 'TNC', 'PMS'], // Explicitly included
  };
  console.log(approvalRequirements)
  console.log(currentTask)
  // Determine required approvals
  const requiredApprovals = useMemo(() => {
    console.log(currentTask)
    if (!(currentTask?.task_parent >= 600 || currentTask?.task_parent >= 500)) {
      console.log('not installation')
      if (proj.qaqc_approval) {
        return ['QAQC']
      } else return []
    }
    // ✅ If under "Testing and Commissioning" parent (task_parent = 600)
    if (currentTask?.task_parent === 600) {
      if (currentTask.task_name === 'Final Testing / Hand over' || currentTask.task_name === 'Final Cleaning / Hand over') {
        return ['QAQC', 'TNC', 'PMS']; // Exception case
      }

      return ['TNC']; // Otherwise, only TNC approval needed
    }

    // ✅ Otherwise, use default mapping (or default to Foreman only)
    return approvalRequirements[currentTask?.task_name] || ['Foreman'];
  }, [currentTask]);
  console.log(requiredApprovals)
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
  
  console.log(proj)
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

    // Check if uploads are complete
    const isUploadComplete = () => {

        console.log(getHandoverFiles().length > 0)
        return getHandoverFiles().length > 0
    }
console.log(isUploadComplete())


    const removeFile = (fileToRemove) => {
        const updated = values.photos?.filter(f => f !== fileToRemove)
        updatePhotos(updated)
    }

  return (
    <>
    {console.log(proj)}
      {proj.qaqc_punchlist ? (
        <div className="punchlist-section">
          <div className="punchlist-header">
            <i className="fas fa-exclamation-triangle"></i>
            <h4>Punch List Items to be rectified</h4>
          </div>
          <div className="punchlist-content">
              <i className="fas fa-info-circle"></i>
              <span>Please address all items before proceeding with task completion.</span>
            </div>
        </div>
      ) : (<></>)}
      <div className="completion-section emphasized">
        <div className="section-header">
          <h4>
            {currentTask.task_name === 'Final Cleaning / Hand over' ? (
              <>
                {!currentTask.task_done ? (
                  <>Prepare for Project Hand Over</>
                ) : (
                  <>Project Completed</>
                )}
              </>
            )
            : currentTask?.task_done === 1 ? "Task Completion Status" : "Proof of Completion"}
          </h4>
        </div>
        <div className="completion-content">
          {currentTask?.task_done === 1 ? (
            <div className="task-completed-state">
              <div className="completion-success">
                <div className="success-message">
                  <h5>Task Fully Completed</h5>
                  <p>This task has been completed and approved.</p>
                </div>
              </div>
              <div className="completion-details">
                <div className="detail-row">
                  <span className="detail-label">Final Status:</span>
                  <span className="status-badge completed">Completed & Approved</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Progress:</span>
                  <span className="detail-value">100% Complete</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="approval-pending">
              <div className="pending-info">
                <div className="pending-message">
                  <h5>Awaiting Completion</h5>
                  <p>This task is pending completion approvals.</p>
                </div>
              </div>

              {currentTask.task_name === 'Final Cleaning / Hand over' && (
                                  <div className="document-upload-card">
                                      <div className="document-header">
                                          <span className="document-label">Supporting Evidence</span>
                                          <span className="upload-optional">Optional</span>
                                      </div>

                                      <div className="upload-area document-upload">
                                          <input 
                                              type="file"
                                              id="handover_document"
                                              multiple
                                              accept="image/*"
                                              onChange={(e) => handleFileUpload(e, 'handover_document')}
                                          />
                                          <div className="upload-hint">
                                              <i className="fas fa-camera"></i>
                                              <span>Click to upload evidence photos</span>
                                              <small>Attach supporting photos documenting the QAQC inspection</small>
                                          </div>
                                      </div>

                                      <div className="uploaded-files-list">
                                          {getHandoverFiles().map((file, index) => (
                                              <div key={index} className="uploaded-file-item">
                                                  <span className="file-name">{file.name.replace('handover_document_', '')}</span>
                                                  <button
                                                      type="button"
                                                      className="remove-file-btn"
                                                      onClick={() => removeFile(file)}
                                                  >
                                                      <i className="fas fa-times"></i>
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
              )}
              <button
                onClick={handleTaskComplete(currentTask, 'Project Engineer')}
                disabled={!(canConfirmCompletion && (currentTask.task_name !== 'Final Testing / Hand over' || isUploadComplete()))}
                className={`confirm-completion-btn ${canConfirmCompletion ? 'ready' : 'disabled'}`}
              >
                {(canConfirmCompletion && (currentTask.task_name !== 'Final Testing / Hand over' || isUploadComplete())) ? (
                  <>
                    <i className="fas fa-clipboard-check"></i>
                    Confirm Task Completion
                  </>
                ) : (
                  <>
                  {console.log(pendingApprovals)}
                    <i className="fas fa-clock"></i>
                    Waiting for {pendingApprovals.join(', ')} Approval and Evidence Uplaod
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default ProjectEngineerCompletion;
