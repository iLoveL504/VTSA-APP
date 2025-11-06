import React, {useEffect} from 'react'
import { useSharedSocket } from '../../Context/SocketContext'
import { useParams } from 'react-router-dom'
import { Axios } from '../../api/axios'

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
    const { utilitiesSocket } = useSharedSocket()
    const {projId} = useParams()
    console.log(utilitiesSocket.connected)
    console.log('hiii')
    

    const qaqcChecklists = {
        'Template Setting': 'Checklist Prior Template Setting',
        'Prior Testing and Commissioning': 'Checklist Prior Testing and Commissioning',
        'Handover': 'Handover Checklist',
        'Shaft Inspection': 'Shaft Checklist'
    }

    

    useEffect(() => {
        setQaqcChecklistType(qaqcChecklists[proj.qaqc_inspection_reason] || 'QAQC Checklist')
    }, [proj.qaqc_inspection_reason, setQaqcChecklistType])

    // Upload handler with file type
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

    // Get checklist files specifically
    const getChecklistFiles = () => {
        return getFilesByType('checklist')
    }

    // Get evidence files specifically
    const getEvidenceFiles = () => {
        return getFilesByType('evidence')
    }

    const getPunchlistFiles = () => {
        return getFilesByType('punchlist')
    }

    // Get evidence files specifically
    const getPunchlistEvidenceFiles = () => {
        return getFilesByType('punchlist_evidence')
    }

    // Check if uploads are complete
    const isUploadComplete = () => {
        return (getChecklistFiles().length > 0 && !proj.qaqc_punchlist)
    }

    const isPunchlistUploadComplete = () => {
        return getPunchlistFiles().length > 0
    }

    const handleRectify = async () => {
        await Axios.put(`/api/projects/qaqc/rectified/${projId}`)
        window.alert('Items rectified')
        window.location.reload()
    }

    return (
        <>
        {console.log(proj)}
        <div className="completion-section emphasized">
            <div className="section-header">
                {/* <h4>
                    {proj.qaqc_is_assigned === 1 ? "Begin Inspection" : 
                     proj.qaqc_ongoing === 1 ? `Ongoing QAQC Inspection for ${proj.qaqc_inspection_reason}` : "Inspection Status"}
                </h4> */}
                <h4>
                    {!proj.qaqc_ongoing 
                        ? "QAQC Inspection to begin shortly"
                        : "Ongoing QAQC Inspection"
                    }        
                </h4>
            </div>
            
            <div className="completion-content">
                {!proj.qaqc_ongoing ? (
                    <div>

                    </div>
                ) : proj?.qaqc_ongoing === 1 ? (
                    <>
                        <div className="qaqc-documents-section">
                            <div className="section-subheader">
                                <h5>QAQC Required Uploads</h5>
                                <p>
                                    Please upload the completed checklist document and any supporting evidence photos.
                                </p>
                            </div>
                            <button 
                                className="complete-task-btn primary-action"
                                onClick={handleTaskComplete(currentTask, 'qaqc')}
                                disabled={!isUploadComplete()}
                            >
                                <i className="fas fa-clipboard-check"></i>
                                {!isUploadComplete ? `Mark Inspection Complete ` 
                                    : `Upload Files${proj.qaqc_punchlist ? ' and rectify punchlist items' : ''}`
                                }
                            </button>
                            <div className="documents-grid">
                                {/* CHECKLIST DOCUMENT */}
                                <div className="document-upload-card">
                                    <div className="document-header">
                                        <span className="document-label">
                                            {qaqcChecklists[proj.qaqc_inspection_reason] || 'QAQC Checklist'}
                                        </span>
                                        <span className="upload-required">* Required</span>
                                    </div>

                                    <div className="upload-area document-upload">
                                        <input 
                                            type="file"
                                            id="checklist-upload"
                                            multiple
                                            accept=".pdf,.doc,.csv,.docx,.xls,.xlsx,image/*"
                                            onChange={(e) => handleFileUpload(e, 'checklist')}
                                        />
                                        <div className="upload-hint">
                                            <i className="fas fa-file-upload"></i>
                                            <span>Click to upload checklist document</span>
                                            <small>Upload the completed QAQC checklist in PDF, Word, Excel, or image format</small>
                                        </div>
                                    </div>

                                    <div className="uploaded-files-list">
                                        {getChecklistFiles().map((file, index) => (
                                            <div key={index} className="uploaded-file-item">
                                                <span className="file-name">{file.name.replace('checklist_', '')}</span>
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

                                {/* EVIDENCE PHOTOS */}
                                <div className="document-upload-card">
                                    <div className="document-header">
                                        <span className="document-label">Supporting Evidence</span>
                                        <span className="upload-optional">Optional</span>
                                    </div>

                                    <div className="upload-area document-upload">
                                        <input 
                                            type="file"
                                            id="evidence-upload"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'evidence')}
                                        />
                                        <div className="upload-hint">
                                            <i className="fas fa-camera"></i>
                                            <span>Click to upload evidence photos</span>
                                            <small>Attach supporting photos documenting the QAQC inspection</small>
                                        </div>
                                    </div>

                                    <div className="uploaded-files-list">
                                        {getEvidenceFiles().map((file, index) => (
                                            <div key={index} className="uploaded-file-item">
                                                <span className="file-name">{file.name.replace('evidence_', '')}</span>
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


                    </>
                ) : (
                    <div className="task-completed-state">
                        <div className="completion-success">
                            <div className="success-message">
                                <h5>Inspection Successfully Completed</h5>
                                <p>This QAQC inspection has been completed and documented.</p>
                            </div>
                        </div>
                        <div className="completion-details">
                            <div className="detail-row">
                                <span className="detail-label">Inspection Date:</span>
                                <span className="detail-value">
                                    {new Date().toLocaleDateString("en-GB")}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className="status-badge completed">
                                    Inspection Complete
                                </span>
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
        {/* QAQC Punchlisting */}
        <div className="completion-section emphasized">
            {!proj.qaqc_punchlist ? (
                <>
                <div className="section-header">
                <h4>
                    Punchlisting
                </h4>
            </div>
            
            <div className="completion-content">
                {!proj.qaqc_ongoing ? (
                    <div>
     
                    </div>
                ) : proj?.qaqc_ongoing === 1 ? (
                    <>
                        <div className="qaqc-documents-section">
                            <div className="section-subheader">
                                <h5>QAQC Required Uploads</h5>
                                <p>
                                    Please upload the completed checklist document and any supporting evidence photos.
                                </p>
                            </div>
                        <button 
                            className="complete-task-btn primary-action"
                            onClick={handleApproval(currentTask, values.photos, 'punchlisting')}
                            disabled={!isPunchlistUploadComplete()}
                        >
                            <i className="fas fa-clipboard-check"></i>
                            Submit Punchlist
                        </button>
                            <div className="documents-grid">
                                {/* CHECKLIST DOCUMENT */}
                                <div className="document-upload-card">
                                    <div className="document-header">
                                        <span className="document-label">
                                            QAQC Punchlist
                                        </span>
                                        <span className="upload-required">* Required</span>
                                    </div>

                                    <div className="upload-area document-upload">
                                        <input 
                                            type="file"
                                            id="punchlist-upload"
                                            multiple
                                            accept=".pdf,.doc,.csv,.docx,.xls,.xlsx,image/*"
                                            onChange={(e) => handleFileUpload(e, 'punchlist')}
                                        />
                                        <div className="upload-hint">
                                            <i className="fas fa-file-upload"></i>
                                            <span>Click to upload checklist document</span>
                                            <small>Upload the completed QAQC punchlist in PDF, Word, Excel, or image format</small>
                                        </div>
                                    </div>

                                    <div className="uploaded-files-list">
                                        {getPunchlistFiles().map((file, index) => (
                                            <div key={index} className="uploaded-file-item">
                                                <span className="file-name">{file.name.replace('punchlist_', '')}</span>
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

                                {/* EVIDENCE PHOTOS */}
                                <div className="document-upload-card">
                                    <div className="document-header">
                                        <span className="document-label">Supporting Evidence</span>
                                        <span className="upload-optional">Optional</span>
                                    </div>

                                    <div className="upload-area document-upload">
                                        <input 
                                            type="file"
                                            id="pevidence-upload"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'punchlist_evidence')}
                                        />
                                        <div className="upload-hint">
                                            <i className="fas fa-camera"></i>
                                            <span>Click to upload punchlist evidence photos</span>
                                            <small>Attach supporting photos documenting the QAQC inspection</small>
                                        </div>
                                    </div>

                                    <div className="uploaded-files-list">
                                        {getPunchlistEvidenceFiles().map((file, index) => (
                                            <div key={index} className="uploaded-file-item">
                                                <span className="file-name">{file.name.replace('punchlist_evidence_', '')}</span>
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


                    </>
                ) : (
                    <div className="task-completed-state">
                        <div className="completion-success">
                            <div className="success-message">
                                <h5>Inspection Successfully Completed</h5>
                                <p>This QAQC inspection has been completed and documented.</p>
                            </div>
                        </div>
                        <div className="completion-details">
                            <div className="detail-row">
                                <span className="detail-label">Inspection Date:</span>
                                <span className="detail-value">
                                    {new Date().toLocaleDateString("en-GB")}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className="status-badge completed">
                                    Inspection Complete
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Files Submitted:</span>
                                <span className="detail-value">{values.photos?.length || 0} files</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
                </>
            ) : (
                <div>
                    Punchlist Item to be rectified
                    <button
                        onClick={handleRectify}
                    >All Items Rectified</button>
                </div>
            )}


            
            
        </div>
        </>
    )
}

export default QAQCCompletion