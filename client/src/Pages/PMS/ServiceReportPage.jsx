import React from 'react'
import { useParams } from 'react-router-dom'
import { useStoreState} from 'easy-peasy'
import '../../css/ServiceReportPage.css'

const ServiceReportPage = () => {
    const { inspectionId } = useParams()
    const serviceReports = useStoreState(state => state.serviceReports)


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


    // Handle file upload

    // Handle delete document


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
                                            {/* <button 
                                                onClick={() => handleDelete(report.id, report.inspection_document_name)}
                                                className="delete-button"
                                                title="Delete document"
                                            >
                                                Delete
                                            </button> */}
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
                                                    {/* <button 
                                                        onClick={() => handleDelete(report.id, report.inspection_document_name)}
                                                        className="delete-button"
                                                        title="Delete image"
                                                    >
                                                        Delete
                                                    </button> */}
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