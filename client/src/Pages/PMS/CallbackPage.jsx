import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Axios } from '../../api/axios';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import '../../css/InspectionPage.css';

const CallbackPage = () => {
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const { clientId } = useParams();
    const { data: status } = useAxiosFetch(`${backendURL}/api/pms/callback-status/${clientId}`);
    const { data: client } = useAxiosFetch(`${backendURL}/api/pms/callback-clients/${clientId}`);
    console.log(client);
    console.log(status);
    
    const [completionStatus, setCompletionStatus] = useState('');
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    // Check if callback can be started (date condition)
    const canBeginCallback = () => {
        if (!client || !client.pms_inspection_date) return false;
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const callbackDate = new Date(client.pms_inspection_date).toISOString().split('T')[0];
            return today >= callbackDate;
        } catch (error) {
            console.error('Error parsing dates:', error);
            return false;
        }
    };

    console.log('can begin callback:', canBeginCallback());
    
    // Check if callback is ongoing
    const isCallbackOngoing = client?.inspection_ongoing === 1;

    const handleFileUpload = (event, type) => {
        const uploadedFiles = Array.from(event.target.files);
        const typedFiles = uploadedFiles.map(file => {
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
        
        setFiles(prev => [...prev, ...typedFiles]);
        setErrors({}); // Clear errors when files are added
    };

    const removeFile = (fileToRemove) => {
        setFiles(prev => prev.filter(f => f !== fileToRemove));
    };

    const getFilesByType = (type) => {
        return files.filter(file => {
            const fileType = file.fileType || (file.name?.startsWith(`${type}_`) ? type : null);
            return fileType === type;
        });
    };

    const getServiceReportFiles = () => getFilesByType('service_report');
    const getEvidenceFiles = () => getFilesByType('evidence');
    const isUploadComplete = () => getServiceReportFiles().length > 0;

    const handleBeginCallback = async () => {
        console.log('starting callback...........');
        try {
            setCompletionStatus('starting');
            const response = await Axios.put(`/api/pms/begin-callback/${clientId}`);
            
            if (response.data.success) {
                setCompletionStatus('callback_started');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                console.log(response);
                setCompletionStatus('Failed to begin callback');
            }
        } catch (error) {
            console.error('Error beginning callback:', error);
            setCompletionStatus('Error beginning callback');
        }
    };

    const handleCompleteCallback = async () => {
        if (!isUploadComplete()) {
            setErrors({ photos: "Service report is required" });
            return;
        }

        try {
            setCompletionStatus('completing');
            const formData = new FormData();
            
            // Add required service report files
            getServiceReportFiles().forEach(file => formData.append('service_reports', file));
            
            // Add optional evidence files
            getEvidenceFiles().forEach(file => formData.append('evidence', file));
            
            formData.append('callback_id', client.callback_id || client.id);
            formData.append('client_id', clientId);
            
            console.log(Object.fromEntries(formData.entries()));
            const response = await Axios.post(`/api/pms/complete-callback/${clientId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setCompletionStatus('success');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setCompletionStatus('Failed to complete callback');
            }
        } catch (error) {
            console.error('Error completing callback:', error);
            setCompletionStatus('Error completing callback');
        }
        navigate('/pms/inspections');
    };

    if (!client) {
        return (
            <div className="InspectionPage loading">
                <div className="loading-spinner">Loading callback data...</div>
            </div>
        );
    }

    return (
        <div className="Content InspectionPage CallbackPage">
            <div className="inspection-header callback-header">
                <h1>Callback Inspection</h1>
                <div className="client-info">
                    <h2>{client.project_name || client.lift_name}</h2>
                    <p>{client.book_name || client.client} • {client.project_location || `${client.location}, ${client.island_group}`}</p>
                    <div className="inspection-details">
                        <span><strong>Project Name:</strong> {client.project_name}</span>
                        <span><strong>Scheduled Date:</strong> {new Date(client.pms_inspection_date).toLocaleDateString('en-GB')}</span>
                        <span><strong>Contract Type:</strong> {client.free_pms ? 'Free PMS' : 'Paid PMS'}</span>
                        <span><strong>Status:</strong> {isCallbackOngoing ? 'In Progress' : 'Not Started'}</span>
                    </div>
                </div>
            </div>

            {completionStatus && completionStatus !== 'starting' && completionStatus !== 'completing' && completionStatus !== 'success' && completionStatus !== 'callback_started' && (
                <div className="status-message error">{completionStatus}</div>
            )}

            {completionStatus === 'success' && (
                <div className="status-message success">Callback completed successfully!</div>
            )}

            {completionStatus === 'callback_started' && (
                <div className="status-message success">Callback started successfully!</div>
            )}

            <div>
                {status?.callback_done ? (
                    <div className="completion-status">
                        <div className="completion-badge">
                            <i className="fas fa-check-circle"></i>
                            <span>Callback Completed</span>
                        </div>
                        <p>This callback inspection has been completed and submitted.</p>
                    </div>
                ) : (
                    <>
                        {/* Begin Callback Section - Show when callback is not ongoing */}
                        {!isCallbackOngoing && (
                            <div className="begin-inspection-section callback-section">
                                <div className="section-header">
                                    <h3>Begin Callback Inspection</h3>
                                    <p>Start the callback inspection process to address previous issues or follow-up work</p>
                                </div>
                                
                                <div className="inspection-status-info">
                                    <div className="status-card callback">
                                        <div className="status-indicator pending"></div>
                                        <div className="status-content">
                                            <h4>Callback Pending</h4>
                                            <p>
                                                {canBeginCallback() 
                                                    ? 'You can now begin the callback inspection' 
                                                    : `Callback can be started on ${new Date(client.pms_inspection_date).toLocaleDateString('en-GB')}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="begin-actions">
                                    <button 
                                        className="begin-inspection-btn callback-btn"
                                        onClick={handleBeginCallback}
                                        disabled={!canBeginCallback() || completionStatus === 'starting' || completionStatus === 'callback_started'}
                                    >
                                        {completionStatus === 'starting' ? 'Starting...' : `${canBeginCallback() ? 'Begin Callback' : 'Cannot begin callback'}`}
                                    </button>
                                    
                                    {!canBeginCallback() && (
                                        <div className="date-restriction-notice">
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>Callback cannot be started before the scheduled date</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Service Report Upload Section - Show when callback is ongoing */}
                        {isCallbackOngoing && (
                            <div className="service-report-section callback-section">
                                <div className="section-header">
                                    <h3>Callback Documentation</h3>
                                    <p>Upload required service reports and optional evidence photos to complete the callback inspection</p>
                                </div>

                                <div className="documents-grid">
                                    {/* Required Service Report Upload */}
                                    <div className="document-upload-card required callback">
                                        <div className="document-header">
                                            <span className="document-label">Callback Service Report</span>
                                            <span className="upload-required">* Required</span>
                                        </div>

                                        <div className="upload-area document-upload">
                                            <input 
                                                type="file"
                                                id="service-report-upload"
                                                multiple
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                                                onChange={(e) => handleFileUpload(e, 'service_report')}
                                            />
                                            <div className="upload-hint">
                                                <i className="fas fa-file-alt"></i>
                                                <span>Click to upload callback service report</span>
                                                <small>Upload callback checklists, repair reports, or follow-up documentation</small>
                                            </div>
                                        </div>

                                        <div className="uploaded-files-list">
                                            {getServiceReportFiles().map((file, index) => (
                                                <div key={index} className="uploaded-file-item">
                                                    <span className="file-name">{file.name.replace('service_report_', '')}</span>
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

                                        {errors.photos && (
                                            <div className="error-message">
                                                <i className="fas fa-exclamation-circle"></i>
                                                {errors.photos}
                                            </div>
                                        )}
                                    </div>

                                    {/* Optional Evidence Upload */}
                                    <div className="document-upload-card optional callback">
                                        <div className="document-header">
                                            <span className="document-label">Evidence Photos</span>
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
                                                <small>Upload photos of repairs, resolved issues, or completed work</small>
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

                                {!isUploadComplete() && (
                                    <div className="upload-requirement-notice">
                                        <i className="fas fa-info-circle"></i>
                                        <span>Service report is required before completing callback</span>
                                    </div>
                                )}

                                <div className="completion-actions">
                                    <button 
                                        className="complete-inspection-btn callback-btn"
                                        onClick={handleCompleteCallback}
                                        disabled={!isUploadComplete() || completionStatus === 'completing' || completionStatus === 'success'}
                                    >
                                        {completionStatus === 'completing' ? 'Completing...' : 'Complete Callback'}
                                    </button>
                                </div>
                            </div>
                        )}                
                    </>
                )}
            </div>
        </div>
    );
};

export default CallbackPage;