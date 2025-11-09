import React, { useEffect, useMemo, useState } from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch'
import {useParams, useNavigate} from 'react-router-dom'
import '../css/ClientBabyBook.css'
import { ServerIcon } from 'lucide-react'
import { useStoreActions } from 'easy-peasy'

const ClientBabyBook = () => {
    const navigate = useNavigate()
    const {clientId} = useParams()
    console.log(clientId)
    const setServiceReports = useStoreActions(actions => actions.setServiceReports)
    const [babyBook, setBabyBook] = useState()
    
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://localhost:4000';
    const { data: babyBookData } = useAxiosFetch(`${backendURL}/api/pms/baby-book/${clientId}`)
    const { data: projectData } = useAxiosFetch(`${backendURL}/api/pms/clients/${clientId}`)
    console.log(projectData)
    console.log(babyBook)

    useEffect(() => {
        setBabyBook(babyBookData)
        setServiceReports(babyBookData.service_reports)
    }, [babyBookData])

const inspectionHistory = useMemo(() => {
    console.log(babyBook === undefined)
    
    // Add proper null/undefined checks
    if (babyBook && babyBook.service_reports && Array.isArray(babyBook.service_reports)) {
        // Fixed the arrow function syntax - added return statement
        const inspectionByIds = Array.from(
            new Map(
                babyBook.service_reports.map(s => [s.inspection_history_id, s])
            ).values()
        )
        return inspectionByIds            
    }
    
    // Return empty array as fallback
    return []
}, [babyBook])
    console.log(inspectionHistory)
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

    // Function to format contract amount
    const formatCurrency = (amount) => {
        if (!amount) return 'Not specified';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(parseFloat(amount));
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

    // Group service reports by inspection_history_id
    const groupServiceReports = (reports) => {
        if (!reports || !Array.isArray(reports)) return {};
        
        const grouped = {};
        
        reports.forEach((report) => {
            const key = report.inspection_history_id || 'unknown';
            if (!grouped[key]) {
                grouped[key] = {
                    inspection_id: report.inspection_history_id,
                    date_conducted: report.date_conducted,
                    lift_name: report.lift_name,
                    reports: []
                };
            }
            grouped[key].reports.push(report);
        });
        
        return grouped;
    }

    if (!babyBook || !projectData) {
        return (
            <div className="baby-book-loading">
                <div className="loading-spinner"></div>
                <p>Loading baby book data...</p>
            </div>
        );
    }

    // Group the service reports
    const groupedServiceReports = groupServiceReports(babyBook.service_reports);

    return (
        <div className="baby-book-container">
            {/* Header Section */}
            <div className="baby-book-header" style={{textAlign: 'left'}}>
                <h1>Baby Book - {projectData.lift_name || 'Project Documents'}</h1>
                <div className="contract-info" style={{textAlign:'left'}}>
                    <h3>Client Information</h3>
                    <div className="contract-info-grid">
                        <div style={{
                            textAlign:'left'
                        }}>
                            <p><strong>Contract Amount:</strong> {formatCurrency(projectData.contract_amount)}</p>
                            <p><strong>Client:</strong> {projectData.client || 'N/A'}</p>
                            <p><strong>Location:</strong> {[projectData['city/municipality'], projectData.province, projectData.region].filter(Boolean).join(', ') || 'N/A'}</p>         
                            <p><strong>PMS Contract:</strong> {projectData.pms_contract || 'N/A'}</p>            
                        </div>
                        <div style={{
                            textAlign:'left'
                        }}>
                            
                            <p><strong>PMS Cycle:</strong> {projectData.contract_type || 'N/A'}</p>                            
                            <p><strong>Handover Date:</strong> {new Date(projectData.handover_date).toLocaleDateString() || 'N/A'}</p>
                            <p><strong>Free PMS End:</strong> {new Date(projectData.free_pms_end).toLocaleDateString() || 'N/A'}</p>
                        </div>                
                    </div>
                </div>
                <h3>Inspection Dates</h3>
                <p><strong>Last Inspection:</strong>{new Date(projectData.last_inspection_date).toLocaleDateString()}</p>
                <p><strong>Upcoming Inspection:</strong>{new Date(projectData.pms_inspection_date).toLocaleDateString()}</p>
            </div>
            
            {/* Handover Documents Section */}
            <div className="documents-section">
                <h2>Handover Documents</h2>
                {babyBook.handOverDocs && babyBook.handOverDocs.length > 0 ? (
                    <div className="documents-grid">
                        {babyBook.handOverDocs.map((doc) => {
                            const fileType = getFileType(doc.doc_url);
                            return (
                                <div key={`handover-${doc.id}`} className="document-card">
                                    <div className="document-icon">
                                        {getFileIcon(fileType)}
                                    </div>
                                    <div className="document-info">
                                        <h4>{doc.document_name || 'Handover Document'}</h4>
                                        <p className="document-type">{fileType.toUpperCase()} File</p>
                                    </div>
                                    <a 
                                        href={`${backendURL}${doc.doc_url}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="view-button"
                                    >
                                        View Document
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="no-documents">No handover documents available.</p>
                )}
            </div>

            {/* Service Reports Section - Grouped */}
            <div className="documents-section">
                <h2>Service Reports</h2>
                {babyBook.service_reports && babyBook.service_reports.length > 0 ? (
                    <>
                        <div className="project-table-header">
                            <div className="table-row header-row">
                                <div className="table-cell">Project & Client</div>
                                <div className="table-cell">Date Conducted</div>
                                <div className="table-cell">Inspection ID</div>
                            </div>
                        </div>

                        <div className='ServiceList'>
                            {inspectionHistory.map((service, index) => (
                                <div className='ProjectInfo' onClick={() => navigate(`service-report/${service.inspection_history_id}`)}>
                                    <div className='proj-name'>{service.lift_name}</div>
                                    <div>{new Date(service.date_conducted).toLocaleDateString()}</div>
                                    <div>{service.inspection_history_id}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="no-documents">No service reports available.</p>
                )}
            </div>

            {/* Contract Documents Section */}
            <div className="documents-section">
                <h2>Contract Documents</h2>
                {babyBook.contract_documents && babyBook.contract_documents.length > 0 ? (
                    <div className="documents-grid">
                        {babyBook.contract_documents.map((doc) => {
                            const fileType = getFileType(doc.doc_url);
                            return (
                                <div key={`contract-${doc.id}`} className="document-card">
                                    <div className="document-icon">
                                        {getFileIcon(fileType)}
                                    </div>
                                    <div className="document-info">
                                        <h4>{doc.contract_document_name || 'Contract Document'}</h4>
                                        <p className="document-type">{fileType.toUpperCase()} File</p>
                                    </div>
                                    <a 
                                        href={`${backendURL}${doc.doc_url}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="view-button"
                                    >
                                        View Document
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="no-documents">No contract documents available.</p>
                )}
            </div>

            {/* Contract Photos Section */}
            <div className="documents-section">
                <h2>Project Photos</h2>
                {babyBook.contract_photo && babyBook.contract_photo.length > 0 ? (
                    <div className="photos-grid">
                        {babyBook.contract_photo.map((photo) => (
                            <div key={`photo-${photo.id}`} className="photo-card">
                                <img 
                                    src={`${backendURL}${photo.photo_url}`} 
                                    alt={`Project photo ${photo.id}`}
                                    className="photo-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <div className="photo-placeholder" style={{display: 'none'}}>
                                    <div className="photo-icon">🖼️</div>
                                    <p>Image not available</p>
                                </div>
                                <a 
                                    href={`${backendURL}${photo.photo_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-button"
                                >
                                    View Full Size
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-documents">No project photos available.</p>
                )}
            </div>
        </div>
    )
}

export default ClientBabyBook