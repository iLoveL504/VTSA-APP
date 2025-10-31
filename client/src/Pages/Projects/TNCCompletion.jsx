import React, {useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext'
import { useParams } from 'react-router-dom'

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
  const { utilitiesSocket } = useSharedSocket()
  const { projId } = useParams()

  const beginInspection = () => {
    console.log('emit TNC inspection')
    utilitiesSocket.emit('begin_tnc_inspection', Number(projId), (response) => {
      console.log('Server acknowledged:', response)
      window.location.reload()
    })
  }

  const findtncChecklistType = {
    'Final Cleaning / Handover': 'Checklist Prior Hand-Over',
    'Load Test': 'Load Test Procedure Checklist'
  }
  console.log(currentTask)
  useEffect(() => {
    setTncChecklistType(findtncChecklistType[currentTask.task_name] || 'TNC Checklist')
  }, [])

  // ✅ Determine if current task is Final Cleaning / Handover
  const isFinalCleaning = currentTask?.task_name?.toLowerCase().includes('final cleaning') ||
                          currentTask?.task_name?.toLowerCase().includes('handover')

  // Upload handler
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

  const removeFile = (fileToRemove) => {
    const updated = values.photos?.filter(f => f !== fileToRemove)
    updatePhotos(updated)
  }

  const getFilesByType = (type) => {
    return values.photos?.filter(file => {
      const fileType = file.fileType || (file.name?.startsWith(`${type}_`) ? type : null)
      return fileType === type
    }) || []
  }

  // ✅ Adjust validation rule based on task
  const allUploadsComplete = () => {
    const hasEvidence = getFilesByType('photo').length > 0
    const hasDocuments = getFilesByType('document').length > 0
    return isFinalCleaning ? (hasEvidence && hasDocuments) : hasEvidence
  }

  return (
    <div className="completion-section emphasized">
      <div className="section-header">
        <h4>
          {proj.tnc_is_assigned === 1
            ? "Begin TNC Inspection"
            : proj.tnc_ongoing === 1
              ? "Ongoing TNC Inspection"
              : "TNC Inspection Status"}
        </h4>
      </div>

      <div className="completion-content">
        {proj?.tnc_is_assigned === 1 ? (
          <div>
            <button
              className="begin-inspection-btn primary-action"
              onClick={beginInspection}
            >
              <i className="fas fa-play-circle"></i>
              Begin TNC Inspection
            </button>
          </div>
        ) : (currentTask.task_approval === 0) ? (
          <>
            <div className="tnc-documents-section">
              <div className="section-subheader">
                <h5>TNC Required Uploads</h5>
                <p>
                  {isFinalCleaning
                    ? "For Final Cleaning / Handover, please upload both evidence and document pictures."
                    : "Please upload at least the photo evidence for this TNC task."}
                </p>
              </div>

              <div className="documents-grid">
                {/* EVIDENCE PICTURES */}
                <div className="document-upload-card">
                  <div className="document-header">
                    <span className="document-label">Evidence Pictures</span>
                    <span className="upload-required">* Required</span>
                  </div>
                <button
                  className="complete-task-btn primary-action"
                  onClick={handleTaskComplete(currentTask, 'tnc')}
                  disabled={!allUploadsComplete()}
                >
                  <i className="fas fa-clipboard-check"></i>
                  Mark TNC Inspection Complete
                </button>
                  <div className="upload-area document-upload">
                    <input
                      type="file"
                      id="evidence-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                    />
                    <div className="upload-hint">
                      <i className="fas fa-camera"></i>
                      <span>Click to upload photo evidence</span>
                      <small>Attach images showing testing, installation, or commissioning work.</small>
                    </div>
                  </div>

                  <div className="uploaded-files-list">
                    {getFilesByType('photo').map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <span className="file-name">{file.name.replace('photo_', '')}</span>
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

                {/* DOCUMENT PICTURES */}
                <div className="document-upload-card">
                  <div className="document-header">
                    <span className="document-label">Document Pictures ({tncChecklistType})</span>
                    {isFinalCleaning && <span className="upload-required">* Required</span>}
                  </div>

                  <div className="upload-area document-upload">
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'document')}
                    />
                    <div className="upload-hint">
                      <i className="fas fa-file-upload"></i>
                      <span>Click to upload document images or files</span>
                      <small>
                        {isFinalCleaning
                          ? "Attach signed checklists, reports, or completion documents."
                          : "Optional: attach relevant TNC documents if available."}
                      </small>
                    </div>
                  </div>

                  <div className="uploaded-files-list">
                    {getFilesByType('document').map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <span className="file-name">{file.name.replace('document_', '')}</span>
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
            </div>

            {/* COMPLETE BUTTON */}

          </>
        ) : (
          <div className="task-completed-state">
            <div className="completion-success">
              <div className="success-message">
                <h5>TNC Inspection Successfully Completed</h5>
                <p>Testing and Commissioning inspection has been completed and all required uploads are submitted.</p>
              </div>
            </div>
            <div className="completion-details">
              <div className="detail-row">
                <span className="detail-label">Inspection Date:</span>
                <span className="detail-value">{new Date().toLocaleDateString("en-GB")}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="status-badge completed">TNC Inspection Complete</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Files Submitted:</span>
                <span className="detail-value">{values.photos?.length || 0} files</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TNCCompletion
