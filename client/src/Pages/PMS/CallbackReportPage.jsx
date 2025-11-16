import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useStoreState, useStoreActions } from 'easy-peasy'
import '../../css/CallbackReportPage.css'

const CallbackReportPage = () => {
    const { callbackId } = useParams()
    const serviceReports = useStoreState(state => state.serviceReports)
    const addServiceReport = useStoreActions(actions => actions.addServiceReport)
    const deleteServiceReport = useStoreActions(actions => actions.deleteServiceReport)
    
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [documentName, setDocumentName] = useState('')
    const [reportDetails, setReportDetails] = useState('')
    const fileInputRef = useRef(null)

    console.log('callbackId:', callbackId)
    console.log('All service reports:', serviceReports)

    // Filter callback reports by callback_history_id
    const filteredReports = serviceReports?.filter(
        report => report.callback_history_id?.toString() === callbackId
    ) || []

    console.log('Filtered callback reports:', filteredReports)

    // Function to get file type from URL
    const getFileType = (url) => {
        if (!url) return 'unknown';
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
            return 'image';
        } else if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['doc', 'docx'].includes(extension)) {
            return 'word';
        } else if (['xls', 'xlsx'].includes(extension)) {
            return 'excel';
        } else {
            return 'document';
        }
    }

    // Function to get file icon
    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'image':
                return '🖼️';
            case 'pdf':
                return '📄';
            case 'word':
                return '📝';
            case 'excel':
                return '📊';
            default:
                return '📎';
        }
    }

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = [
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            
            if (!validTypes.includes(file.type)) {
                setUploadError('Please select a valid file (Images, PDF, Word, Excel)');
                setSelectedFile(null);
                return;
            }
            
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setUploadError('File size must be less than 10MB');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setUploadError('');
            
            // Set default document name if not already set
            if (!documentName) {
                setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
            }
        }
    }

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('callback_history_id', callbackId);
            formData.append('document_name', documentName || selectedFile.name);
            formData.append('report_details', reportDetails);
            formData.append('completion_date', new Date().toISOString());

            // Simulate API call - replace with your actual API endpoint
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';
            const response = await fetch(`${backendURL}/api/callback-reports/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

            // Add to store
            const newReport = {
                id: result.id || Date.now(),
                callback_history_id: parseInt(callbackId),
                doc_url: result.fileUrl || `/uploads/${selectedFile.name}`,
                document_name: documentName || selectedFile.name,
                report_details: reportDetails,
                completion_date: new Date().toISOString(),
                lift_name: filteredReports[0]?.lift_name || 'Unknown Lift'
            };

            addServiceReport(newReport);

            // Reset form
            setSelectedFile(null);
            setDocumentName('');
            setReportDetails('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setUploadSuccess('File uploaded successfully!');
            
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }

    // Handle delete document
    const handleDelete = async (reportId, reportName) => {
        if (!window.confirm(`Are you sure you want to delete "${reportName}"?`)) {
            return;
        }

        try {
            // Simulate API call - replace with your actual API endpoint
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';
            const response = await fetch(`${backendURL}/api/callback-reports/${reportId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            // Remove from store
            deleteServiceReport(reportId);
            
            setUploadSuccess('Document deleted successfully!');
            
        } catch (error) {
            console.error('Delete error:', error);
            setUploadError('Failed to delete document. Please try again.');
        }
    }

    // Get backend URL from environment or use default
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';

    return (
        <div className='Content CallbackReportPage'>
            <div className="callback-report-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1>Callback Report</h1>
                        <div className="callback-badge">
                            <span className="badge-icon">🔄</span>
                            Callback #{callbackId}
                        </div>
                    </div>
                    {filteredReports.length > 0 && (
                        <div className="callback-info">
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Lift Name:</span>
                                    <span className="info-value">{filteredReports[0].lift_name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Completion Date:</span>
                                    <span className="info-value">
                                        {filteredReports[0].completion_date 
                                            ? formatDate(filteredReports[0].completion_date)
                                            : 'Not Completed'
                                        }
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Total Documents:</span>
                                    <span className="info-value count-badge">{filteredReports.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Section */}
            <div className="upload-section callback-upload">
                <div className="section-header">
                    <h2>Add Callback Document</h2>
                    <p>Upload service reports, evidence photos, or related documents for this callback</p>
                </div>
                <div className="upload-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="file-upload" className="file-upload-label">
                                <span className="upload-icon">📤</span>
                                <span>Select File</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={handleFileSelect}
                                    ref={fileInputRef}
                                />
                            </label>
                            {selectedFile && (
                                <div className="file-info">
                                    <span className="file-name">{selectedFile.name}</span>
                                    <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="document-name">Document Name</label>
                            <input
                                id="document-name"
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                placeholder="Enter document name"
                                className="document-input"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="report-details">Report Details</label>
                        <textarea
                            id="report-details"
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Describe the work done, issues resolved, or any important details..."
                            rows="4"
                            className="details-textarea"
                        />
                    </div>
                    
                    <div className="upload-actions">
                        <button 
                            onClick={handleUpload}
                            disabled={isUploading || !selectedFile}
                            className={`upload-button ${isUploading ? 'uploading' : ''}`}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner"></span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <span className="upload-icon">🚀</span>
                                    Upload Document
                                </>
                            )}
                        </button>
                    </div>

                    {uploadError && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {uploadError}
                        </div>
                    )}
                    {uploadSuccess && (
                        <div className="success-message">
                            <span className="success-icon">✅</span>
                            {uploadSuccess}
                        </div>
                    )}
                </div>
            </div>

            {filteredReports.length === 0 ? (
                <div className="no-documents callback-empty">
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No Callback Documents Yet</h3>
                        <p>Start by uploading your first callback report or evidence document above.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Documents Grid */}
                    <div className="documents-container callback-documents">
                        <div className="section-header">
                            <h2>Callback Documents</h2>
                            <p>All documents and evidence related to this callback inspection</p>
                        </div>
                        <div className="documents-grid">
                            {filteredReports.map((report, index) => {
                                const fileType = getFileType(report.doc_url);
                                const isImage = fileType === 'image';
                                
                                return (
                                    <div key={`${report.id}-${index}`} className={`document-card ${isImage ? 'image-document' : 'file-document'}`}>
                                        <div className="document-preview">
                                            {isImage ? (
                                                <div className="image-preview">
                                                    <img 
                                                        src={`${backendURL}${report.doc_url}`} 
                                                        alt={report.document_name || `Callback image ${index + 1}`}
                                                        className="preview-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="image-placeholder" style={{display: 'none'}}>
                                                        <div className="placeholder-icon">🖼️</div>
                                                        <p>Image preview not available</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="file-preview">
                                                    <div className="file-icon">
                                                        {getFileIcon(fileType)}
                                                    </div>
                                                    <div className="file-type">{fileType.toUpperCase()}</div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="document-content">
                                            <h4 className="document-title">
                                                {report.document_name || 'Callback Document'}
                                            </h4>
                                            <div className="document-meta">
                                                <span className="upload-date">
                                                    📅 {formatDate(report.completion_date)}
                                                </span>
                                                {report.report_details && (
                                                    <div className="document-details">
                                                        <p>{report.report_details}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="document-actions">
                                            <a 
                                                href={`${backendURL}${report.doc_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="view-button"
                                            >
                                                <span className="button-icon">👁️</span>
                                                View
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(report.id, report.document_name)}
                                                className="delete-button"
                                                title="Delete document"
                                            >
                                                <span className="button-icon">🗑️</span>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Evidence Gallery Section */}
                    {filteredReports.some(report => getFileType(report.doc_url) === 'image') && (
                        <div className="evidence-gallery">
                            <div className="section-header">
                                <h2>Evidence Gallery</h2>
                                <p>Visual evidence and photos from the callback inspection</p>
                            </div>
                            <div className="gallery-grid">
                                {filteredReports
                                    .filter(report => getFileType(report.doc_url) === 'image')
                                    .map((report, index) => (
                                        <div key={`evidence-${report.id}-${index}`} className="evidence-card">
                                            <div className="evidence-image-container">
                                                <img 
                                                    src={`${backendURL}${report.doc_url}`} 
                                                    alt={report.document_name || `Evidence image ${index + 1}`}
                                                    className="evidence-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="evidence-placeholder" style={{display: 'none'}}>
                                                    <div className="evidence-icon">📷</div>
                                                    <p>Image not available</p>
                                                </div>
                                                <div className="evidence-overlay">
                                                    <div className="overlay-content">
                                                        <h4>{report.document_name || `Evidence ${index + 1}`}</h4>
                                                        {report.report_details && (
                                                            <p className="evidence-details">{report.report_details}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="evidence-actions">
                                                <a 
                                                    href={`${backendURL}${report.doc_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="view-button full-size-button"
                                                >
                                                    <span className="button-icon">🔍</span>
                                                    Full Size
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(report.id, report.document_name)}
                                                    className="delete-button evidence-delete"
                                                >
                                                    <span className="button-icon">🗑️</span>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default CallbackReportPage