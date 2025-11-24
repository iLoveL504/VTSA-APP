import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Axios } from '../../api/axios';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import '../../css/InspectionPage.css'
import { useStoreState } from 'easy-peasy'
import dayjs from 'dayjs';

const InspectionPage = () => {
    const navigate = useNavigate()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const {clientId} = useParams()
    const { data:status } = useAxiosFetch(`${backendURL}/api/pms/inspection-status/${clientId}`)
    const { data: client } = useAxiosFetch(`${backendURL}/api/pms/clients/${clientId}`);
    const [completionStatus, setCompletionStatus] = useState('');
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const {date} = useStoreState(state => state)

    // Convert store date to dayjs object
    const currentDate = dayjs(date);

    // Check if inspection can be started (date condition)
    const canBeginInspection = () => {
        if (!client || !client.pms_inspection_date) return false;
        
        try {
            // Convert pms_inspection_date from UTC to Manila timezone by adding 1 day
            const inspectionDate = dayjs(client.pms_inspection_date)
            console.log(dayjs(client.pms_inspection_date))
            console.log('Current date:', currentDate.format('YYYY-MM-DD'));
            console.log('Adjusted inspection date:', inspectionDate.format('YYYY-MM-DD'));
            console.log('Can begin inspection:', currentDate.isSameOrAfter(inspectionDate, 'day'));
            
            return currentDate.isSameOrAfter(inspectionDate, 'day');
        } catch (error) {
            console.error('Error parsing dates:', error);
            return false;
        }
    };

    // Format date for display (compensates for UTC storage)
    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).add(1, 'day').format('DD/MM/YYYY');
    };

    // Get the actual inspection date (for display)
    const getActualInspectionDate = () => {
        if (!client?.pms_inspection_date) return null;
        return dayjs(client.pms_inspection_date).add(1, 'day');
    };

    console.log('Can begin inspection:', canBeginInspection());
    
    // Check if inspection is ongoing
    const isInspectionOngoing = client?.inspection_ongoing === 1;

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

    const handleBeginInspection = async () => {
        console.log('Starting inspection...')
        try {
            setCompletionStatus('starting');
            const response = await Axios.put(`/api/pms/begin-inspection/${clientId}`);
            
            if (response.data.success) {
                setCompletionStatus('inspection_started');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                console.log(response)
                setCompletionStatus('Failed to begin inspection');
            }
        } catch (error) {
            console.error('Error beginning inspection:', error);
            setCompletionStatus('Error beginning inspection');
        }
    };

    const handleCompleteInspection = async () => {
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
            
            formData.append('inspection_id', client.inspection_id);
            formData.append('client_id', clientId);
            
            console.log(Object.fromEntries(formData.entries()))
            const response = await Axios.post(`/api/pms/complete/${clientId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setCompletionStatus('success');
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setCompletionStatus('Failed to complete inspection');
            }
        } catch (error) {
            console.error('Error completing inspection:', error);
            setCompletionStatus('Error completing inspection');
        }
        navigate('/pms/inspections')
    };

    if (!client) {
        return (
            <div className="InspectionPage loading">
                <div className="loading-spinner">Loading client data...</div>
            </div>
        );
    }

    const actualInspectionDate = getActualInspectionDate();

    return (
        <div className="Content InspectionPage">
            <div className="inspection-header">
                <h1>PMS Inspection</h1>
                <div className="client-info">
                    <h2>{client.lift_name}</h2>
                    <p>{client.client} • {client.location}, {client.island_group}</p>
                    <div className="inspection-details">
                        <span><strong>Product Type:</strong> {client.product_type}</span>
                        <span><strong>Scheduled Date:</strong> {actualInspectionDate ? actualInspectionDate.format('DD/MM/YYYY') : 'N/A'}</span>
                        <span><strong>PMS Contract:</strong> {client.pms_contract}</span>
                        <span><strong>Status:</strong> {isInspectionOngoing ? 'In Progress' : 'Not Started'}</span>
                    </div>
                </div>
            </div>

            {completionStatus && completionStatus !== 'starting' && completionStatus !== 'completing' && completionStatus !== 'success' && completionStatus !== 'inspection_started' && (
                <div className="status-message error">{completionStatus}</div>
            )}

            {completionStatus === 'success' && (
                <div className="status-message success">Inspection completed successfully!</div>
            )}

            {completionStatus === 'inspection_started' && (
                <div className="status-message success">Inspection started successfully!</div>
            )}
            
            <div>
                {status?.inspection_done ? (
                    <div className="inspection-complete-section">
                        <div className="status-card success">
                            <div className="status-indicator complete"></div>
                            <div className="status-content">
                                <h4>Inspection Complete</h4>
                                <p>This PMS inspection has been completed and documented.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {!isInspectionOngoing && (
                            <div className="begin-inspection-section">
                                <div className="section-header">
                                    <h3>Begin Inspection</h3>
                                    <p>Start the PMS inspection process</p>
                                </div>
                                
                                <div className="inspection-status-info">
                                    <div className="status-card">
                                        <div className="status-indicator pending"></div>
                                        <div className="status-content">
                                            <h4>Inspection Pending</h4>
                                            <p>
                                                {canBeginInspection() 
                                                    ? 'You can now begin the inspection' 
                                                    : `Inspection can be started on ${actualInspectionDate ? actualInspectionDate.format('DD/MM/YYYY') : 'N/A'}`}
                                            </p>
                                            <small className="date-info">
                                                Today is {currentDate.format('DD/MM/YYYY')}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="begin-actions">
                                    <button 
                                        className="begin-inspection-btn"
                                        onClick={handleBeginInspection}
                                        disabled={!canBeginInspection() || completionStatus === 'starting' || completionStatus === 'inspection_started'}
                                    >
                                        {completionStatus === 'starting' ? 'Starting...' : `${canBeginInspection() ? 'Begin Inspection' : 'Cannot begin inspection'}`}
                                    </button>
                                    
                                    {!canBeginInspection() && actualInspectionDate && (
                                        <div className="date-restriction-notice">
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>
                                                Inspection cannot be started before {actualInspectionDate.format('DD/MM/YYYY')} 
                                                ({currentDate.isBefore(actualInspectionDate) ? 
                                                    `${actualInspectionDate.diff(currentDate, 'day')} day(s) from now` : 
                                                    'date restriction'}
                                                )
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Service Report Upload Section - Show when inspection is ongoing */}
                        {isInspectionOngoing && (
                            <div className="service-report-section">
                                <div className="section-header">
                                    <h3>Inspection Documentation</h3>
                                    <p>Upload required service reports and optional evidence photos to complete the PMS inspection</p>
                                </div>

                                <div className="documents-grid">
                                    {/* Required Service Report Upload */}
                                    <div className="document-upload-card required">
                                        <div className="document-header">
                                            <span className="document-label">Service Report (Checklist)</span>
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
                                                <span>Click to upload service report</span>
                                                <small>Upload inspection checklists, maintenance reports, or service documentation</small>
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
                                    <div className="document-upload-card optional">
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
                                                <small>Upload photos of equipment, maintenance work, or inspection findings</small>
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
                                        <span>Service report is required before completing inspection</span>
                                    </div>
                                )}

                                <div className="completion-actions">
                                    <button 
                                        className="complete-inspection-btn"
                                        onClick={handleCompleteInspection}
                                        disabled={!isUploadComplete() || completionStatus === 'completing' || completionStatus === 'success'}
                                    >
                                        {completionStatus === 'completing' ? 'Completing...' : 'Complete Inspection'}
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

export default InspectionPage;