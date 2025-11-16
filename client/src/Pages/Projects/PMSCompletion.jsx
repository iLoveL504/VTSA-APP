import React from 'react';
import {
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const PMSCompletion = ({ 
  proj, 
  currentTask, 
  values, 
  handleContractChange, 
  handleTaskComplete, 
  updatePhotos 
}) => {
  
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

  const getCompletionEvidenceFiles = () => {
    return getFilesByType('completion_evidence');
  };

  const isUploadComplete = () => {
    return getCompletionEvidenceFiles().length > 0;
  };

  return (
    <div className="TaskDetails__completion-section TaskDetails__completion-section--emphasized">
      <div className="TaskDetails__section-header">
        <AssignmentIcon className="TaskDetails__section-icon" />
        <h4>
          {!proj.pms_approval 
            ? "PMS Approved" 
            : (!proj.pms_ongoing) 
              ? "PMS Final Inspection to be Conducted" 
              : "PMS Review"
          }
        </h4>
      </div>

      <div className="TaskDetails__completion-content">
        {!proj.pms_approval ? (
          <div className="TaskDetails__completed-state">
            <div className="TaskDetails__completion-success">
              <div className="TaskDetails__success-message">
                <CheckCircleIcon className="TaskDetails__success-icon" />
                <h5>PMS Approval Granted</h5>
                <p>This task has been approved by Project Management Services.</p>
              </div>
            </div>
            <div className="TaskDetails__completion-details">
              <div className="TaskDetails__detail-row">
                <span className="TaskDetails__detail-label">Approval Status:</span>
                <span className="TaskDetails__status-badge TaskDetails__status-badge--completed">
                  Approved by PMS
                </span>
              </div>
              <div className="TaskDetails__detail-row">
                <span className="TaskDetails__detail-label">Approval Date:</span>
                <span className="TaskDetails__detail-value">
                  {proj.pms_approval_date ? 
                    new Date(proj.pms_approval_date).toLocaleDateString("en-GB") : 
                    'Not specified'}
                </span>
              </div>
            </div>
          </div>
        ) : proj.pms_approval ? (
          <>
            <div className="TaskDetails__documents-section">
              <div className="TaskDetails__section-subheader">
                <DescriptionIcon className="TaskDetails__subheader-icon" />
                <h5>PMS Completion Evidence</h5>
                <p>
                  Please upload completion evidence and supporting documents before granting PMS approval.
                </p>
              </div>

              <div className="TaskDetails__documents-grid">
                {/* Completion Evidence */}
                <div className="TaskDetails__document-upload-card">
                  <div className="TaskDetails__document-header">
                    <span className="TaskDetails__document-label">Completion Evidence</span>
                    <span className="TaskDetails__upload-required">* Required</span>
                  </div>

                  <div className="TaskDetails__upload-area TaskDetails__document-upload">
                    <input 
                      type="file"
                      id="completion-evidence-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,.zip,.rar"
                      onChange={(e) => handleFileUpload(e, 'completion_evidence')}
                    />
                    <div className="TaskDetails__upload-hint">
                      <CloudUploadIcon className="TaskDetails__upload-icon" />
                      <span>Click to upload completion evidence</span>
                      <small>Upload final inspection reports, completion certificates, or verification documents</small>
                    </div>
                  </div>

                  <div className="TaskDetails__uploaded-files-list">
                    {getCompletionEvidenceFiles().map((file, index) => (
                      <div key={index} className="TaskDetails__uploaded-file-item">
                        <span className="TaskDetails__file-name">
                          {file.name.replace('completion_evidence_', '')}
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
              </div>

              {!isUploadComplete() && (
                <div className="TaskDetails__upload-requirement-notice">
                  <DescriptionIcon className="TaskDetails__requirement-icon" />
                  <span>Completion evidence is required before granting PMS approval</span>
                </div>
              )}

              <button 
                className="TaskDetails__complete-task-btn TaskDetails__complete-task-btn--primary"
                onClick={handleTaskComplete(currentTask, 'pms')}
                disabled={!isUploadComplete()}
              >
                <StampIcon className="TaskDetails__btn-icon" />
                Grant PMS Approval
              </button>
            </div>
          </>
        ) : (
          <div className="TaskDetails__pending-state">
            <div className="TaskDetails__pending-content">
              <AssignmentIcon className="TaskDetails__pending-icon" />
              <h5>PMS Final Joint Inspection</h5>
              <p>
                PMS Final Joint Inspection to be conducted at {' '}
                {proj.pms_joint_inspection ? 
                  new Date(proj.pms_joint_inspection).toLocaleDateString('en-GB') : 
                  'a future date'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PMSCompletion;