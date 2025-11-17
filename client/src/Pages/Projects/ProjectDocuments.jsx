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
    const [expandedChecklist, setExpandedChecklist] = useState(null);
    const { qaqcHistory } = useStoreState(state => state)
    console.log(qaqcHistory)
    // Fetch actual daily reports data from API
    const {data: reportsData, fetchError: fetchReportError, isLoading: reportsIsLoading} = useAxiosFetch(`${backendURL}/api/projects/report/${projId}`)
    
    // Use actual data from API or fallback to mock data
    const dailyReports = reportsData || [];

    // Sequential checklist documents - ordered by project phase
    const sequentialChecklists = [
        {
            id: 4,
            title: 'Pre-Inspection Checklist',
            link: 'preinspection-checklist',
            category: 'Prerequisite',
            phase: 1,
            phaseName: 'Pre-Construction',
            lastUpdated: '2024-01-09',
            status: 'pending',
            required: true,
            description: 'Site assessment and preliminary safety checks before construction begins',
            itemsCompleted: 5,
            totalItems: 15,
            dueDate: '2024-01-18',
            dependencies: [],
            icon: 'fas fa-clipboard-list',
            color: '#8B5CF6'
        },
        {
            id: 1,
            title: 'Kick-Off Meeting Agenda Checklist',
            link: 'kickoff',
            category: 'Planning',
            phase: 2,
            phaseName: 'Project Kickoff',
            lastUpdated: '2024-01-10',
            status: 'approved',
            required: true,
            description: 'Comprehensive project initiation and team alignment documentation',
            itemsCompleted: 15,
            totalItems: 18,
            dueDate: '2024-01-20',
            dependencies: ['Pre-Inspection Checklist'],
            icon: 'fas fa-handshake',
            color: '#3B82F6'
        },
        {
            id: 2,
            title: 'Safety Compliance Checklist',
            link: 'safety-checklist',
            category: 'Safety',
            phase: 3,
            phaseName: 'Safety & Compliance',
            lastUpdated: '2024-01-12',
            status: 'pending',
            required: true,
            description: 'Daily equipment maintenance and safety compliance verification',
            itemsCompleted: 8,
            totalItems: 12,
            dueDate: '2024-01-15',
            dependencies: ['Kick-Off Meeting Agenda Checklist'],
            icon: 'fas fa-shield-alt',
            color: '#10B981'
        },
        {
            id: 5,
            title: 'QAQC Checklist',
            link: 'qaqc',
            category: 'Quality',
            phase: 4,
            phaseName: 'Quality Assurance',
            lastUpdated: '2024-01-08',
            status: 'approved',
            required: false,
            description: 'Quality assurance and control checks for completed work phases',
            itemsCompleted: 22,
            totalItems: 22,
            dueDate: '2024-01-25',
            dependencies: ['Safety Compliance Checklist'],
            icon: 'fas fa-check-double',
            color: '#F59E0B'
        },
        {
            id: 3,
            title: 'Pre-Handover Checklist',
            link: 'handover-checklist',
            category: 'Completion',
            phase: 5,
            phaseName: 'Project Handover',
            lastUpdated: '2024-01-12',
            status: 'pending',
            required: true,
            description: 'Final verification and documentation before project handover',
            itemsCompleted: 8,
            totalItems: 12,
            dueDate: '2024-01-15',
            dependencies: ['QAQC Checklist'],
            icon: 'fas fa-clipboard-check',
            color: '#EF4444'
        }
    ];

    const filteredDailyReports = dailyReports.filter(report =>
        report.workCompleted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.delaysIssues?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredChecklists = sequentialChecklists.filter(checklist =>
        checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.phaseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { class: 'status-completed', text: 'Completed' },
            pending: { class: 'status-pending', text: 'Pending' },
            approved: { class: 'status-approved', text: 'Approved' },
            rejected: { class: 'status-rejected', text: 'Rejected' }
        };
        return statusConfig[status] || { class: 'status-default', text: status };
    };

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


  const handleUploadChecklist = () => {
    // Handle checklist upload
    console.log('Upload new checklist');
  };

  const handleDownload = (document, type) => {
    console.log(`Download ${type}:`, document);
  };

  const handlePreview = (document, type) => {
    console.log(`Preview ${type}:`, document);
  };


  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };


    const handleRowClick = (reportId) => {
        navigate(`daily-reports/${reportId}`);
    };

    const toggleChecklistExpand = (checklistId) => {
        setExpandedChecklist(expandedChecklist === checklistId ? null : checklistId);
    };

    const isChecklistLocked = (checklist) => {
        if (checklist.dependencies.length === 0) return false;
        
        // Check if all dependencies are completed/approved
        return checklist.dependencies.some(depTitle => {
            const depChecklist = sequentialChecklists.find(c => c.title === depTitle);
            return depChecklist && !['completed', 'approved'].includes(depChecklist.status);
        });
    };

    return (
        <div className='Content ProjectDocuments'>
            {/* Navigation Tabs */}
            <div className="documents-tabs">
                <button 
                    className={`tab-button ${activeTab === 'QAQC History' ? 'active' : ''}`}
                    onClick={() => setActiveTab('qaqcHistory')}
                >
                    <i className="fas fa-file-alt"></i>
                    QAQC Inspection History
                    <span className="tab-count">{dailyReports.length}</span>
                </button>
                <button 
                    className={`tab-button ${activeTab === 'dailyReports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dailyReports')}
                >
                    <i className="fas fa-file-alt"></i>
                    Daily Reports
                    <span className="tab-count">{dailyReports.length}</span>
                </button>
                {/* <button 
                    className={`tab-button ${activeTab === 'checklists' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklists')}
                >
                    <i className="fas fa-clipboard-check"></i>
                    Project Checklists
                    <span className="tab-count">{sequentialChecklists.length}</span>
                </button> */}
            </div>

            {/* Search and Filter Bar */}
            <div className="documents-toolbar">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'dailyReports' ? 'reports' : 'checklists'}...`}
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
                ) : activeTab === 'checklists' ? (
                    // SEQUENTIAL CHECKLISTS - TIMELINE VIEW
                    <div className="sequential-checklists">
                        <div className="checklists-timeline">
                            {filteredChecklists.length > 0 ? (
                                filteredChecklists.map((checklist, index) => {
                                    const progressPercentage = getProgressPercentage(checklist.itemsCompleted, checklist.totalItems);
                                    const isLocked = isChecklistLocked(checklist);
                                    const isExpanded = expandedChecklist === checklist.id;
                                    
                                    return (
                                        <div 
                                            key={checklist.id} 
                                            className={`timeline-item ${isLocked ? 'locked' : ''} ${checklist.status === 'approved' ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}
                                        >
                                            {/* Phase Connector */}
                                            {index > 0 && (
                                                <div className="phase-connector"></div>
                                            )}
                                            
                                            {/* Phase Number */}
                                            <div 
                                                className="phase-marker"
                                                style={{ backgroundColor: checklist.color }}
                                            >
                                                <i className={checklist.icon}></i>
                                                <span className="phase-number">Phase {checklist.phase}</span>
                                            </div>

                                            {/* Checklist Card */}
                                            <div 
                                              className="timeline-card"
                                              onClick={() => {
                                                navigate(checklist.link)
                                              }}
                                            >
                                                <div className="card-header">
                                                    <div className="phase-info">
                                                        <h3 className="phase-name">{checklist.phaseName}</h3>
                                                        <span className="phase-step">Step {checklist.phase} of {sequentialChecklists.length}</span>
                                                    </div>
                                                    <div className="card-status">
                                                        <span className={`status-badge ${getStatusBadge(checklist.status).class}`}>
                                                            {getStatusBadge(checklist.status).text}
                                                        </span>
                                                        {checklist.required && (
                                                            <span className="required-badge">Required</span>
                                                        )}
                                                        {isLocked && (
                                                            <span className="locked-badge">
                                                                <i className="fas fa-lock"></i>
                                                                Locked
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="card-content">
                                                    <h4 className="checklist-title">{checklist.title}</h4>
                                                    <p className="checklist-description">{checklist.description}</p>
                                                    
                                                    {/* Dependencies */}
                                                    {checklist.dependencies.length > 0 && (
                                                        <div className="dependencies">
                                                            <span className="dependencies-label">
                                                                <i className="fas fa-link"></i>
                                                                Requires: 
                                                            </span>
                                                            {checklist.dependencies.map((dep, depIndex) => {
                                                                const depChecklist = sequentialChecklists.find(c => c.title === dep);
                                                                const isDepComplete = depChecklist && ['completed', 'approved'].includes(depChecklist.status);
                                                                
                                                                return (
                                                                    <span 
                                                                        key={depIndex} 
                                                                        className={`dependency ${isDepComplete ? 'completed' : 'pending'}`}
                                                                    >
                                                                        {dep}
                                                                        {isDepComplete ? ' ✓' : ' ⏱️'}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Progress Section */}
                                                    <div className="progress-section">
                                                        <div className="progress-header">
                                                            <span>Completion Progress</span>
                                                            <span className="progress-text">{progressPercentage}%</span>
                                                        </div>
                                                        <div className="progress-bar">
                                                            <div 
                                                                className="progress-fill"
                                                                style={{ 
                                                                    width: `${progressPercentage}%`,
                                                                    backgroundColor: checklist.color
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="progress-stats">
                                                            {checklist.itemsCompleted} of {checklist.totalItems} items completed
                                                        </div>
                                                    </div>

                                                    {/* Meta Information */}
                                                    <div className="checklist-meta">
                                                        <div className="meta-item">
                                                            <i className="fas fa-calendar"></i>
                                                            <span>Due: {formatDate(checklist.dueDate)}</span>
                                                        </div>
                                                        <div className="meta-item">
                                                            <i className="fas fa-sync"></i>
                                                            <span>Updated: {formatDate(checklist.lastUpdated)}</span>
                                                        </div>
                                                        <div className="meta-item">
                                                            <i className="fas fa-folder"></i>
                                                            <span>{checklist.category}</span>
                                                        </div>
                                                    </div>

                                                    {/* Expandable Actions */}
                                                    <div className="expandable-actions">
                                                        <button 
                                                            className="expand-toggle"
                                                            onClick={() => toggleChecklistExpand(checklist.id)}
                                                        >
                                                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                                            {isExpanded ? 'Show Less' : 'Show Actions'}
                                                        </button>
                                                        
                                                        {isExpanded && (
                                                            <div className="action-buttons">
                                                                <button 
                                                                    className={`btn-primary ${isLocked ? 'disabled' : ''}`}
                                                                    disabled={isLocked}
                                                                    onClick={() => !isLocked && navigate(checklist.link)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                    {isLocked ? 'Complete Previous Steps' : 'Start Checklist'}
                                                                </button>
                                                                <button 
                                                                    className="btn-outline"
                                                                    onClick={() => handlePreview(checklist, 'checklist')}
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                    Preview
                                                                </button>
                                                                <button 
                                                                    className="btn-outline"
                                                                    onClick={() => handleDownload(checklist, 'checklist')}
                                                                >
                                                                    <i className="fas fa-download"></i>
                                                                    Download Template
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-clipboard-check"></i>
                                    <h3>No checklists found</h3>
                                    <p>Upload your first checklist document</p>
                                    <button className="btn-primary" onClick={handleUploadChecklist}>
                                        Upload Checklist
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Progress Overview */}
                        <div className="progress-overview">
                            <h3>Project Completion Progress</h3>
                            <div className="overview-stats">
                                <div className="overview-stat">
                                    <span className="stat-value">
                                        {sequentialChecklists.filter(c => ['completed', 'approved'].includes(c.status)).length}
                                    </span>
                                    <span className="stat-label">Checklists Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                  <div>
                    QAQC Inspection History
                  </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDocuments;