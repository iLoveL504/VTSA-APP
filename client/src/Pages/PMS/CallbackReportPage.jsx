import React from 'react'
import { useParams } from 'react-router-dom'
import { useStoreState } from 'easy-peasy'
import '../../css/CallbackReportPage.css'

const CallbackReportPage = () => {
    const { callbackId } = useParams()
    const {callbackReports} = useStoreState(state => state)

    console.log('callbackId:', callbackId)
    // Filter callback reports by callback_history_id
    const filteredReports = callbackReports?.filter(
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


    // Handle file upload


    // Handle delete document

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
                                                View
                                            </a>
                                            {/* <button 
                                                onClick={() => handleDelete(report.id, report.document_name)}
                                                className="delete-button"
                                                title="Delete document"
                                            >
                                                <span className="button-icon">🗑️</span>
                                                Delete
                                            </button> */}
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
                                                    Full Size
                                                </a>
                                                {/* <button 
                                                    onClick={() => handleDelete(report.id, report.document_name)}
                                                    className="delete-button evidence-delete"
                                                >
                                                    <span className="button-icon">🗑️</span>
                                                    Delete
                                                </button> */}
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