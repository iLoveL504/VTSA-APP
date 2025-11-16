import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Axios } from '../../api/axios';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CameraAlt as CameraIcon,
  Schedule as ScheduleIcon     // ✅ Add this
} from '@mui/icons-material';


const QAQCCompletion = ({ 
  proj, 
  currentTask, 
  values, 
  handleContractChange, 
  handleTaskComplete, 
  setQaqcChecklistType,
  updatePhotos,
  handleApproval
}) => {
  const { projId } = useParams();

  const qaqcChecklists = {
    'Template Setting': 'Checklist Prior Template Setting',
    'Prior Testing and Commissioning': 'Checklist Prior Testing and Commissioning',
    'Handover': 'Handover Checklist',
    'Shaft Inspection': 'Shaft Checklist'
  };

  useEffect(() => {
    setQaqcChecklistType(qaqcChecklists[proj.qaqc_inspection_reason] || 'QAQC Checklist');
  }, [proj.qaqc_inspection_reason, setQaqcChecklistType]);

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

  const getChecklistFiles = () => getFilesByType('checklist');
  const getEvidenceFiles = () => getFilesByType('evidence');
  const getPunchlistFiles = () => getFilesByType('punchlist');
  const getPunchlistEvidenceFiles = () => getFilesByType('punchlist_evidence');

  const isUploadComplete = () => getChecklistFiles().length > 0 && !proj.qaqc_punchlist;
  const isPunchlistUploadComplete = () => getPunchlistFiles().length > 0;

  const handleRectify = async () => {
    await Axios.put(`/api/projects/qaqc/rectified/${projId}`);
    window.alert('Items rectified');
    window.location.reload();
  };

  return (
    <>
      {/* Main QAQC Inspection Section */}
      <div className="TaskDetails__completion-section TaskDetails__completion-section--emphasized">
        <div className="TaskDetails__section-header">
          <AssignmentIcon className="TaskDetails__section-icon" />
          <h4>
            {!proj.qaqc_ongoing 
              ? "QAQC Inspection to Begin Shortly"
              : "Ongoing QAQC Inspection"
            }
          </h4>
        </div>
        
        <div className="TaskDetails__completion-content">
          {!proj.qaqc_ongoing ? (
            <div className="TaskDetails__pending-state">
              <ScheduleIcon className="TaskDetails__pending-icon" />
              <p>QAQC inspection will begin once scheduled.</p>
            </div>
          ) : proj?.qaqc_ongoing === 1 ? (
            <>
              <div className="TaskDetails__documents-section">
                <div className="TaskDetails__section-subheader">
                  <DescriptionIcon className="TaskDetails__subheader-icon" />
                  <h5>QAQC Required Uploads</h5>
                  <p>Please upload the completed checklist document and any supporting evidence photos.</p>
                </div>
                
                <div className="TaskDetails__documents-grid">
                  {/* Checklist Document */}
                  <div className="TaskDetails__document-upload-card">
                    <div className="TaskDetails__document-header">
                      <span className="TaskDetails__document-label">
                        {qaqcChecklists[proj.qaqc_inspection_reason] || 'QAQC Checklist'}
                      </span>
                      <span className="TaskDetails__upload-required">* Required</span>
                    </div>

                    <div className="TaskDetails__upload-area TaskDetails__document-upload">
                      <input 
                        type="file"
                        id="checklist-upload"
                        multiple
                        accept=".pdf,.doc,.csv,.docx,.xls,.xlsx,image/*"
                        onChange={(e) => handleFileUpload(e, 'checklist')}
                      />
                      <div className="TaskDetails__upload-hint">
                        <CloudUploadIcon className="TaskDetails__upload-icon" />
                        <span>Click to upload checklist document</span>
                        <small>Upload the completed QAQC checklist in PDF, Word, Excel, or image format</small>
                      </div>
                    </div>

                    <div className="TaskDetails__uploaded-files-list">
                      {getChecklistFiles().map((file, index) => (
                        <div key={index} className="TaskDetails__uploaded-file-item">
                          <span className="TaskDetails__file-name">
                            {file.name.replace('checklist_', '')}
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

                  {/* Evidence Photos */}
                  <div className="TaskDetails__document-upload-card">
                    <div className="TaskDetails__document-header">
                      <span className="TaskDetails__document-label">Supporting Evidence</span>
                      <span className="TaskDetails__upload-optional">Optional</span>
                    </div>

                    <div className="TaskDetails__upload-area TaskDetails__document-upload">
                      <input 
                        type="file"
                        id="evidence-upload"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'evidence')}
                      />
                      <div className="TaskDetails__upload-hint">
                        <CameraIcon className="TaskDetails__upload-icon" />
                        <span>Click to upload evidence photos</span>
                        <small>Attach supporting photos documenting the QAQC inspection</small>
                      </div>
                    </div>

                    <div className="TaskDetails__uploaded-files-list">
                      {getEvidenceFiles().map((file, index) => (
                        <div key={index} className="TaskDetails__uploaded-file-item">
                          <span className="TaskDetails__file-name">
                            {file.name.replace('evidence_', '')}
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
                  onClick={handleTaskComplete(currentTask, 'qaqc')}
                  disabled={!isUploadComplete()}
                >
                  <CheckCircleIcon className="TaskDetails__btn-icon" />
                  Mark Inspection Complete
                </button>
              </div>
            </>
          ) : (
            <div className="TaskDetails__completed-state">
              <div className="TaskDetails__completion-success">
                <div className="TaskDetails__success-message">
                  <CheckCircleIcon className="TaskDetails__success-icon" />
                  <h5>Inspection Successfully Completed</h5>
                  <p>This QAQC inspection has been completed and documented.</p>
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
                    Inspection Complete
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

      {/* QAQC Punchlisting Section */}
      <div className="TaskDetails__completion-section">
        <div className="TaskDetails__section-header">
          <WarningIcon className="TaskDetails__section-icon" />
          <h4>Punchlisting</h4>
        </div>
        
        <div className="TaskDetails__completion-content">
          {!proj.qaqc_punchlist ? (
            proj?.qaqc_ongoing === 1 && (
              <>
                <div className="TaskDetails__documents-section">
                  <div className="TaskDetails__section-subheader">
                    <DescriptionIcon className="TaskDetails__subheader-icon" />
                    <h5>QAQC Punchlist Uploads</h5>
                    <p>Upload punchlist documentation and supporting evidence.</p>
                  </div>
                  
                  <div className="TaskDetails__documents-grid">
                    {/* Punchlist Document */}
                    <div className="TaskDetails__document-upload-card">
                      <div className="TaskDetails__document-header">
                        <span className="TaskDetails__document-label">QAQC Punchlist</span>
                        <span className="TaskDetails__upload-required">* Required</span>
                      </div>

                      <div className="TaskDetails__upload-area TaskDetails__document-upload">
                        <input 
                          type="file"
                          id="punchlist-upload"
                          multiple
                          accept=".pdf,.doc,.csv,.docx,.xls,.xlsx,image/*"
                          onChange={(e) => handleFileUpload(e, 'punchlist')}
                        />
                        <div className="TaskDetails__upload-hint">
                          <CloudUploadIcon className="TaskDetails__upload-icon" />
                          <span>Click to upload punchlist document</span>
                          <small>Upload the completed QAQC punchlist in PDF, Word, Excel, or image format</small>
                        </div>
                      </div>

                      <div className="TaskDetails__uploaded-files-list">
                        {getPunchlistFiles().map((file, index) => (
                          <div key={index} className="TaskDetails__uploaded-file-item">
                            <span className="TaskDetails__file-name">
                              {file.name.replace('punchlist_', '')}
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

                    {/* Punchlist Evidence */}
                    <div className="TaskDetails__document-upload-card">
                      <div className="TaskDetails__document-header">
                        <span className="TaskDetails__document-label">Punchlist Evidence</span>
                        <span className="TaskDetails__upload-optional">Optional</span>
                      </div>

                      <div className="TaskDetails__upload-area TaskDetails__document-upload">
                        <input 
                          type="file"
                          id="pevidence-upload"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'punchlist_evidence')}
                        />
                        <div className="TaskDetails__upload-hint">
                          <CameraIcon className="TaskDetails__upload-icon" />
                          <span>Click to upload punchlist evidence photos</span>
                          <small>Attach supporting photos documenting punchlist items</small>
                        </div>
                      </div>

                      <div className="TaskDetails__uploaded-files-list">
                        {getPunchlistEvidenceFiles().map((file, index) => (
                          <div key={index} className="TaskDetails__uploaded-file-item">
                            <span className="TaskDetails__file-name">
                              {file.name.replace('punchlist_evidence_', '')}
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
                    onClick={handleApproval(currentTask, values.photos, 'punchlisting')}
                    disabled={!isPunchlistUploadComplete()}
                  >
                    <AssignmentIcon className="TaskDetails__btn-icon" />
                    Submit Punchlist
                  </button>
                </div>
              </>
            )
          ) : (
            <div className="TaskDetails__punchlist-rectify">
              <div className="TaskDetails__punchlist-header">
                <WarningIcon className="TaskDetails__punchlist-icon" />
                <h5>Punchlist Items to be Rectified</h5>
              </div>
              <p>Please ensure all punchlist items have been addressed before proceeding.</p>
              <button
                className="TaskDetails__rectify-btn"
                onClick={handleRectify}
              >
                <CheckCircleIcon className="TaskDetails__btn-icon" />
                All Items Rectified
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QAQCCompletion;