import React, { useEffect } from 'react';
import { useSharedSocket } from '../../Context/SocketContext';
import { useParams } from 'react-router-dom';
import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CameraAlt as CameraIcon
} from '@mui/icons-material';

const TNCCompletion = ({
  proj,
  currentTask,
  values,
  handleContractChange,
  handleTaskComplete,
  updatePhotos,
  setTncChecklistType,
  tncChecklistType
}) => {
  const { utilitiesSocket } = useSharedSocket();
  const { projId } = useParams();

  const beginInspection = () => {
    utilitiesSocket.emit('begin_tnc_inspection', Number(projId), (response) => {
      console.log('Server acknowledged:', response);
      window.location.reload();
    });
  };

  const findtncChecklistType = {
    'Final Cleaning / Handover': 'Checklist Prior Hand-Over',
    'Load Test': 'Load Test Procedure Checklist'
  };

  useEffect(() => {
    setTncChecklistType(findtncChecklistType[currentTask.task_name] || 'TNC Checklist');
  }, [currentTask.task_name, setTncChecklistType]);

  const isFinalCleaning = currentTask?.task_name?.toLowerCase().includes('final cleaning') ||
                          currentTask?.task_name?.toLowerCase().includes('handover');

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

  const allUploadsComplete = () => {
    const hasEvidence = getFilesByType('photo').length > 0;
    const hasDocuments = getFilesByType('document').length > 0;
    return isFinalCleaning ? (hasEvidence && hasDocuments) : hasEvidence;
  };

  return (
    <div className="TaskDetails__completion-section TaskDetails__completion-section--emphasized">
      <div className="TaskDetails__section-header">
        <AssignmentIcon className="TaskDetails__section-icon" />
        <h4>
          {!proj.tnc_ongoing 
            ? "TNC Inspection to Begin Shortly"
            : "Ongoing TNC Inspection"
          }
        </h4>
      </div>

      <div className="TaskDetails__completion-content">
        {!proj.tnc_ongoing ? (
          <div className="TaskDetails__inspection-start">
            <div className="TaskDetails__start-content">
              <PlayArrowIcon className="TaskDetails__start-icon" />
              <h5>Ready to Begin TNC Inspection</h5>
              <p>Start the Testing and Commissioning inspection process for this task.</p>
            </div>
            <button
              className="TaskDetails__begin-inspection-btn"
              onClick={beginInspection}
            >
              <PlayArrowIcon className="TaskDetails__btn-icon" />
              Begin TNC Inspection
            </button>
          </div>
        ) : currentTask.task_approval === 0 ? (
          <>
            <div className="TaskDetails__documents-section">
              <div className="TaskDetails__section-subheader">
                <DescriptionIcon className="TaskDetails__subheader-icon" />
                <h5>TNC Required Uploads</h5>
                <p>
                  {isFinalCleaning
                    ? "For Final Cleaning / Handover, please upload both evidence and document pictures."
                    : "Please upload at least the photo evidence for this TNC task."}
                </p>
              </div>

              <div className="TaskDetails__documents-grid">
                {/* Evidence Pictures */}
                <div className="TaskDetails__document-upload-card">
                  <div className="TaskDetails__document-header">
                    <span className="TaskDetails__document-label">Evidence Pictures</span>
                    <span className="TaskDetails__upload-required">* Required</span>
                  </div>

                  <div className="TaskDetails__upload-area TaskDetails__document-upload">
                    <input
                      type="file"
                      id="evidence-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                    />
                    <div className="TaskDetails__upload-hint">
                      <CameraIcon className="TaskDetails__upload-icon" />
                      <span>Click to upload photo evidence</span>
                      <small>Attach images showing testing, installation, or commissioning work</small>
                    </div>
                  </div>

                  <div className="TaskDetails__uploaded-files-list">
                    {getFilesByType('photo').map((file, index) => (
                      <div key={index} className="TaskDetails__uploaded-file-item">
                        <span className="TaskDetails__file-name">
                          {file.name.replace('photo_', '')}
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

                {/* Document Pictures */}
                <div className="TaskDetails__document-upload-card">
                  <div className="TaskDetails__document-header">
                    <span className="TaskDetails__document-label">
                      Document Pictures ({tncChecklistType})
                    </span>
                    {isFinalCleaning && <span className="TaskDetails__upload-required">* Required</span>}
                    {!isFinalCleaning && <span className="TaskDetails__upload-optional">Optional</span>}
                  </div>

                  <div className="TaskDetails__upload-area TaskDetails__document-upload">
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'document')}
                    />
                    <div className="TaskDetails__upload-hint">
                      <CloudUploadIcon className="TaskDetails__upload-icon" />
                      <span>Click to upload document images or files</span>
                      <small>
                        {isFinalCleaning
                          ? "Attach signed checklists, reports, or completion documents"
                          : "Optional: attach relevant TNC documents if available"}
                      </small>
                    </div>
                  </div>

                  <div className="TaskDetails__uploaded-files-list">
                    {getFilesByType('document').map((file, index) => (
                      <div key={index} className="TaskDetails__uploaded-file-item">
                        <span className="TaskDetails__file-name">
                          {file.name.replace('document_', '')}
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

              <button
                className="TaskDetails__complete-task-btn TaskDetails__complete-task-btn--primary"
                onClick={handleTaskComplete(currentTask, 'tnc')}
                disabled={!allUploadsComplete()}
              >
                <CheckCircleIcon className="TaskDetails__btn-icon" />
                Mark TNC Inspection Complete
              </button>
            </div>
          </>
        ) : (
          <div className="TaskDetails__completed-state">
            <div className="TaskDetails__completion-success">
              <div className="TaskDetails__success-message">
                <CheckCircleIcon className="TaskDetails__success-icon" />
                <h5>TNC Inspection Successfully Completed</h5>
                <p>Testing and Commissioning inspection has been completed and all required uploads are submitted.</p>
              </div>
            </div>
            <div className="TaskDetails__completion-details">
              <div className="TaskDetails__detail-row">
                <span className="TaskDetails__detail-label">Inspection Date:</span>
                <span className="TaskDetails__detail-value">
                  {new Date().toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="TaskDetails__detail-row">
                <span className="TaskDetails__detail-label">Status:</span>
                <span className="TaskDetails__status-badge TaskDetails__status-badge--completed">
                  TNC Inspection Complete
                </span>
              </div>
              <div className="TaskDetails__detail-row">
                <span className="TaskDetails__detail-label">Files Submitted:</span>
                <span className="TaskDetails__detail-value">
                  {values.photos?.length || 0} files
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TNCCompletion;