import React from 'react';

const PMSCompletion = ({ 
  proj, 
  currentTask, 
  values, 
  handleContractChange, 
  handleTaskComplete, 
  updatePhotos 
}) => {
  
  // Upload handler with file type
  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const typedFiles = files.map(file => {
      const customFile = new File([file], `${type}_${file.name}`, {
        type: file.type,
        lastModified: file.lastModified
      });
      Object.defineProperty(customFile, 'fileType', {
        value: type,
        writable: false
      });
      return customFile;
    });
    handleContractChange({
      target: { files: typedFiles }
    });
  };

  const removeFile = (fileToRemove) => {
    const updated = values.photos?.filter(f => f !== fileToRemove);
    updatePhotos(updated);
  };

  const getFilesByType = (type) => {
    return values.photos?.filter(file => {
      const fileType = file.fileType || (file.name?.startsWith(`${type}_`) ? type : null);
      return fileType === type;
    }) || [];
  };

  // Get completion evidence files specifically
  const getCompletionEvidenceFiles = () => {
    return getFilesByType('completion_evidence');
  };


  // Check if required uploads are complete
  const isUploadComplete = () => {
    return getCompletionEvidenceFiles().length > 0;
  };

  // Determine if PMS approval is required for this task
  // const isPMSApprovalRequired = useMemo(() => {
  //   // PMS approval is typically required for final handover tasks
  //   const pmsApprovalTasks = [
  //     'Final Cleaning / Hand over',
  //     'Final Testing / Hand over',
  //     'Project Handover',
  //     'Final Inspection'
  //   ];
    
  //   return pmsApprovalTasks.includes(currentTask?.task_name) || 
  //          currentTask?.task_parent === 600; // Testing and Commissioning parent
  // }, [currentTask]);

  // Check if PMS has already approved
  console.log(proj)
  return (
    <div className="completion-section emphasized">
      <div className="section-header">
        <h4>
          {!proj.pms_approval ? "PMS Approved" : 
           (!proj.pms_ongoing) ? "PMS Final Inspection to be conducted" : "PMS Review"}
        </h4>
      </div>
      {proj.pms_approval ? (
        <button 
          className="complete-task-btn primary-action"
          onClick={handleTaskComplete(currentTask, 'pms')}
          disabled={!isUploadComplete()}
        >
          <i className="fas fa-stamp"></i>
          Grant PMS Approval
        </button>        
      ) : (<></>)}

      <div className="completion-content">
        {!proj.pms_approval ? (
          <div className="task-completed-state">
            <div className="completion-success">
              <div className="success-message">
                <h5>PMS Approval Granted</h5>
                <p>This task has been approved by Project Management Services.</p>
              </div>
            </div>
            <div className="completion-details">
              <div className="detail-row">
                <span className="detail-label">Approval Status:</span>
                <span className="status-badge completed">Approved by PMS</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Approval Date:</span>
                <span className="detail-value">
                  {proj.pms_approval_date ? 
                    new Date(proj.pms_approval_date).toLocaleDateString("en-GB") : 
                    'Not specified'}
                </span>
              </div>
            </div>
          </div>
        ) : proj.pms_approval ? (
          <>
            <div className="pms-documents-section">
              <div className="section-subheader">
                <h5>PMS Completion Evidence</h5>
                <p>
                  Please upload completion evidence and supporting documents before granting PMS approval.
                </p>
              </div>

              <div className="documents-grid">
                {/* COMPLETION EVIDENCE */}
                <div className="document-upload-card">
                  <div className="document-header">
                    <span className="document-label">
                      Completion Evidence
                    </span>
                    <span className="upload-required">* Required</span>
                  </div>

                  <div className="upload-area document-upload">
                    <input 
                      type="file"
                      id="completion-evidence-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,.zip,.rar"
                      onChange={(e) => handleFileUpload(e, 'completion_evidence')}
                    />
                    <div className="upload-hint">
                      <i className="fas fa-file-certificate"></i>
                      <span>Click to upload completion evidence</span>
                      <small>Upload final inspection reports, completion certificates, or verification documents</small>
                    </div>
                  </div>

                  <div className="uploaded-files-list">
                    {getCompletionEvidenceFiles().map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <span className="file-name">{file.name.replace('completion_evidence_', '')}</span>
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
                </div>
     
            {!isUploadComplete() && (
              <div className="upload-requirement-notice">
                <i className="fas fa-info-circle"></i>
                <span>Completion evidence is required before granting PMS approval</span>
              </div>
            )}   
            </div>

          </>
        ) : (
            <>
            <div>
                PMS Final Joint Inspection to be conducted at {new Date(proj.pms_joint_inspection).toLocaleDateString('en-GB')}
            </div>
            </>
        )}
      </div>

       

    </div>
  );
};

export default PMSCompletion;