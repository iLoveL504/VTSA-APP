import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useStoreState, useStoreActions } from 'easy-peasy'
import '../../css/ServiceReportPage.css'

const ServiceReportPage = () => {
    const { inspectionId } = useParams()
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

    console.log('inspectionId:', inspectionId)
    console.log('All service reports:', serviceReports)

    // Filter service reports by inspection_history_id
    const filteredReports = serviceReports?.filter(
        report => report.inspection_history_id?.toString() === inspectionId
    ) || []

    console.log('Filtered reports:', filteredReports)

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
            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
            if (!validImageTypes.includes(file.type)) {
                setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP, BMP)');
                setSelectedFile(null);
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File size must be less than 5MB');
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
            formData.append('inspection_history_id', inspectionId);
            formData.append('inspection_document_name', documentName || selectedFile.name);
            formData.append('report_details', reportDetails);
            formData.append('date_conducted', new Date().toISOString());

            // Simulate API call - replace with your actual API endpoint
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';
            const response = await fetch(`${backendURL}/api/service-reports/upload`, {
                method: 'POST',
                body: formData,
                // Add headers like authorization if needed
                // headers: {
                //     'Authorization': `Bearer ${yourAuthToken}`
                // }
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

            // Add to store
            const newReport = {
                id: result.id || Date.now(), // Use server ID or generate temporary ID
                inspection_history_id: parseInt(inspectionId),
                doc_url: result.fileUrl || `/uploads/${selectedFile.name}`,
                inspection_document_name: documentName || selectedFile.name,
                report_details: reportDetails,
                date_conducted: new Date().toISOString(),
                lift_name: filteredReports[0]?.lift_name || 'Unknown Lift' // Use existing lift name if available
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
            const response = await fetch(`${backendURL}/api/service-reports/${reportId}`, {
                method: 'DELETE',
                // headers: {
                //     'Authorization': `Bearer ${yourAuthToken}`
                // }
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
        <div className='Content ServiceReportPage'>
            <div className="service-report-header">
                <h1>Service Reports</h1>
                <p>Inspection ID: {inspectionId}</p>
                {filteredReports.length > 0 && (
                    <div className="inspection-info">
                        <p><strong>Lift Name:</strong> {filteredReports[0].lift_name}</p>
                        <p><strong>Date Conducted:</strong> {formatDate(filteredReports[0].date_conducted)}</p>
                        <p><strong>Total Documents:</strong> {filteredReports.length}</p>
                    </div>
                )}
            </div>

            {/* Upload Section */}
            <div className="upload-section">
                <h2>Add New Document</h2>
                <div className="upload-form">
                    <div className="form-group">
                        <label htmlFor="file-upload">Select Image File:</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                        />
                        {selectedFile && (
                            <div className="file-info">
                                <p>Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="document-name">Document Name:</label>
                        <input
                            id="document-name"
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Enter document name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="report-details">Report Details (Optional):</label>
                        <textarea
                            id="report-details"
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Enter any additional details about this report"
                            rows="3"
                        />
                    </div>
                    
                    <button 
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className="upload-button"
                    >
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                    </button>

                    {uploadError && <div className="error-message">{uploadError}</div>}
                    {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}
                </div>
            </div>

            {filteredReports.length === 0 ? (
                <div className="no-documents">
                    <p>No service reports found for inspection ID: {inspectionId}</p>
                </div>
            ) : (
                <>
                    {/* All Documents Section */}
                    <div className="documents-container">
                        <h2>All Service Report Documents</h2>
                        <div className="documents-grid">
                            {filteredReports.map((report, index) => {
                                const fileType = getFileType(report.doc_url);
                                const isImage = fileType === 'image';
                                
                                return (
                                    <div key={`${report.id}-${index}`} className={`document-card ${isImage ? 'image-document' : ''}`}>
                                        {isImage ? (
                                            // Image document with preview
                                            <>
                                                <div className="document-image-preview">
                                                    <img 
                                                        src={`${backendURL}${report.doc_url}`} 
                                                        alt={report.inspection_document_name || `Service report image ${index + 1}`}
                                                        className="document-preview-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="document-image-placeholder" style={{display: 'none'}}>
                                                        <div className="document-image-icon">🖼️</div>
                                                        <p>Image preview not available</p>
                                                    </div>
                                                </div>
                                                <div className="document-info">
                                                    <h4>{report.inspection_document_name || 'Service Report Image'}</h4>
                                                    <p className="document-type">IMAGE File</p>
                                                    <p className="document-date">
                                                        Uploaded: {formatDate(report.date_conducted)}
                                                    </p>
                                                    {report.report_details && (
                                                        <p className="document-details">
                                                            {report.report_details}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            // Non-image document
                                            <>
                                                <div className="document-icon">
                                                    {getFileIcon(fileType)}
                                                </div>
                                                <div className="document-info">
                                                    <h4>{report.inspection_document_name || 'Service Report Document'}</h4>
                                                    <p className="document-type">{fileType.toUpperCase()} File</p>
                                                    <p className="document-date">
                                                        Uploaded: {formatDate(report.date_conducted)}
                                                    </p>
                                                    {report.report_details && (
                                                        <p className="document-details">
                                                            {report.report_details}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        <div className="document-actions">
                                            <a 
                                                href={`${backendURL}${report.doc_url}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="view-button"
                                            >
                                                {isImage ? 'View Full Size' : 'View Document'}
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(report.id, report.inspection_document_name)}
                                                className="delete-button"
                                                title="Delete document"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Image Gallery Section for images only */}
                    {filteredReports.some(report => getFileType(report.doc_url) === 'image') && (
                        <div className="images-container">
                            <h2>Service Report Images Gallery</h2>
                            <div className="images-grid">
                                {filteredReports
                                    .filter(report => getFileType(report.doc_url) === 'image')
                                    .map((report, index) => (
                                        <div key={`image-${report.id}-${index}`} className="image-card">
                                            <img 
                                                src={`${backendURL}${report.doc_url}`} 
                                                alt={report.inspection_document_name || `Service report image ${index + 1}`}
                                                className="service-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            <div className="image-placeholder" style={{display: 'none'}}>
                                                <div className="image-icon">🖼️</div>
                                                <p>Image not available</p>
                                            </div>
                                            <div className="image-info">
                                                <p>{report.inspection_document_name || `Image ${index + 1}`}</p>
                                                <div className="image-actions">
                                                    <a 
                                                        href={`${backendURL}${report.doc_url}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="view-button"
                                                    >
                                                        View Full Size
                                                    </a>
                                                    <button 
                                                        onClick={() => handleDelete(report.id, report.inspection_document_name)}
                                                        className="delete-button"
                                                        title="Delete image"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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

export default ServiceReportPage