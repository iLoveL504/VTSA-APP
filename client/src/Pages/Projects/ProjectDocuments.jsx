import React, { useState } from 'react';
import '../../css/ProjectDocuments.css';
import useAxiosFetch from "../../hooks/useAxiosFetch.js"
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useStoreState } from 'easy-peasy';

const ProjectDocuments = () => {
    const navigate = useNavigate()
    const {projId} = useParams()
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [activeTab, setActiveTab] = useState('dailyReports');
    const [searchTerm, setSearchTerm] = useState('');
    const { qaqcHistory } = useStoreState(state => state)
    
    // Fetch actual daily reports data from API
    const {data: reportsData, fetchError: fetchReportError, isLoading: reportsIsLoading} = useAxiosFetch(`${backendURL}/api/projects/report/${projId}`)
    
    // Use actual data from API or fallback to mock data
    const dailyReports = reportsData || [];

    const filteredDailyReports = dailyReports.filter(report =>
        report.workCompleted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.delaysIssues?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredQAQC = qaqcHistory.filter(qaqc =>
        qaqc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qaqc.checklists?.[0]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qaqc.inspection_reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleRowClick = (reportId) => {
        navigate(`daily-reports/${reportId}`);
    };

    const handleQAQCRowClick = (qaqc) => {
        // Navigate to QAQC inspection details page
        console.log('QAQC inspection clicked:', qaqc);
        // navigate(`qaqc-inspections/${qaqc.qaqc_id}`);
    };



    return (
        <div className='Content ProjectDocuments'>
            {/* Navigation Tabs */}
            <div className="documents-tabs">
                <button 
                    className={`tab-button ${activeTab === 'qaqcHistory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('qaqcHistory')}
                >
                    <i className="fas fa-clipboard-check"></i>
                    QAQC Inspection History
                    <span className="tab-count">{qaqcHistory.length}</span>
                </button>
                <button 
                    className={`tab-button ${activeTab === 'dailyReports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dailyReports')}
                >
                    <i className="fas fa-file-alt"></i>
                    Daily Reports
                    <span className="tab-count">{dailyReports.length}</span>
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="documents-toolbar">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'dailyReports' ? 'reports' : 'inspections'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="documents-content">
                {activeTab === 'dailyReports' ? (
                    // DAILY REPORTS - TABULAR FORM
                    <div className="daily-reports-table">
                        {reportsIsLoading ? (
                            <div className="loading-state">
                                <i className="fas fa-spinner fa-spin"></i>
                                <p>Loading daily reports...</p>
                            </div>
                        ) : fetchReportError ? (
                            <div className="error-state">
                                <i className="fas fa-exclamation-triangle"></i>
                                <h3>Error Loading Reports</h3>
                                <p>{fetchReportError}</p>
                            </div>
                        ) : filteredDailyReports.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Report Date</th>
                                        <th>Author</th>
                                        <th>Work Completed</th>
                                        <th>Work Planned</th>
                                        <th>Delays & Issues</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDailyReports.map(report => (
                                        <tr onClick={() => handleRowClick(report.id)} style={{cursor: 'pointer'}} key={report.id} className="report-row">
                                            <td className="report-date">
                                                <div className="date-info">
                                                    <i className="fas fa-calendar"></i>
                                                    {formatDate(report.report_date)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="author-info">
                                                    <i className="fas fa-user"></i>
                                                    {report.author || 'Unknown'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="work-completed">
                                                    <span title={report.workCompleted}>
                                                        {truncateText(report.workCompleted, 60)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="work-planned">
                                                    <span title={report.workPlannedNextDay}>
                                                        {truncateText(report.workPlannedNextDay, 60)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="delays-issues">
                                                    {report.delaysIssues ? (
                                                        <span 
                                                            className={`issues-indicator ${report.delaysIssues ? 'has-issues' : 'no-issues'}`}
                                                            title={report.delaysIssues}
                                                        >
                                                            <i className="fas fa-exclamation-circle"></i>
                                                            {truncateText(report.delaysIssues, 40)}
                                                        </span>
                                                    ) : (
                                                        <span className="no-issues-text">No issues reported</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="remarks">
                                                    <span title={report.remarks}>
                                                        {truncateText(report.remarks, 40)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-file-alt"></i>
                                <h3>No daily reports found</h3>
                                <p>Create your first daily report to get started</p>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'qaqcHistory' ? (
                    // QAQC HISTORY - TABULAR FORM
                    <div className="qaqc-history-table">
                        {filteredQAQC.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Inspection Date</th>
                                        <th>Inspector</th>
                                        <th>Inspection Reason</th>
                                        <th>Checklist Type</th>
                                        <th>Status</th>
                                        <th>Photos</th>
                                        <th>Punchlists</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQAQC.map((qaqc, index) => (
                                        <tr 
                                            key={qaqc._key || index} 
                                            className="qaqc-row"
                                            onClick={() => handleQAQCRowClick(qaqc)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <td className="inspection-date">
                                                <div className="date-info">
                                                    <i className="fas fa-calendar-check"></i>
                                                    {formatDate(qaqc.inspection_date)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inspector-info">
                                                    <i className="fas fa-user-shield"></i>
                                                    {qaqc.full_name || 'Unknown Inspector'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inspection-reason">
                                                    <span title={qaqc.inspection_reason}>
                                                        {truncateText(qaqc.inspection_reason, 40)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="checklist-type">
                                                    {qaqc.checklists && qaqc.checklists.length > 0 ? (
                                                        <span className="checklist-tag">
                                                            <i className="fas fa-clipboard-list"></i>
                                                            {truncateText(qaqc.checklists[0], 30)}
                                                        </span>
                                                    ) : (
                                                        <span className="no-checklist">No checklist</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="inspection-status">
                                                    <span className={`status-badge ${qaqc.inspection_complete ? 'status-completed' : 'status-pending'}`}>
                                                        <i className={`fas ${qaqc.inspection_complete ? 'fa-check-circle' : 'fa-clock'}`}></i>
                                                        {qaqc.inspection_complete ? 'Completed' : 'In Progress'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="photos-count">
                                                    {qaqc.photos && qaqc.photos.length > 0 ? (
                                                        <span className="photos-badge">
                                                            <i className="fas fa-camera"></i>
                                                            {qaqc.photos.length} photo{qaqc.photos.length !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="no-photos">No photos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="punchlists-count">
                                                    {qaqc.punchlist_urls && qaqc.punchlist_urls.length > 0 ? (
                                                        <span className="punchlists-badge">
                                                            <i className="fas fa-list-alt"></i>
                                                            {qaqc.punchlist_urls.length} punchlist{qaqc.punchlist_urls.length !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="no-punchlists">No punchlists</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-clipboard-check"></i>
                                <h3>No QAQC inspections found</h3>
                                <p>No quality assurance inspections have been conducted yet</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ProjectDocuments;