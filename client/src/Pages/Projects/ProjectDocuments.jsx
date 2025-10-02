import React, { useState } from 'react';
import '../../css/ProjectDocuments.css';
import useAxiosFetch from "../../hooks/useAxiosFetch.js"
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDocuments = () => {
    const navigate = useNavigate()
     const {projId} = useParams()
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [activeTab, setActiveTab] = useState('dailyReports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Fetch actual daily reports data from API
  const {data: reportsData, fetchError: fetchReportError, isLoading: reportsIsLoading} = useAxiosFetch(`${backendURL}/projects/report/${projId}`) // Adjust endpoint as needed
  
  // Use actual data from API or fallback to mock data
  const dailyReports = reportsData || [
    {
      "id": 7,
      "project_id": 1,
      "workCompleted": "Work completed for today",
      "workPlannedNextDay": "work planned for the next day",
      "delaysIssues": "describe any delays, issues",
      "remarks": "Any additional remarks or notes",
      "report_date": "2025-09-30T16:00:00.000Z",
      "author": "Foreman"
    },
    {
      "id": 13,
      "project_id": 1,
      "workCompleted": "Set work completed",
      "workPlannedNextDay": "set planned work for next day",
      "delaysIssues": "Here are some issues and delays",
      "remarks": "nah no additional notes",
      "report_date": "2025-10-01T16:00:00.000Z",
      "author": "Spongebob Squarepants"
    }
  ];

  const checklistDocuments = [
    {
      id: 1,
      title: 'Pre-Installation Safety Checklist',
      category: 'Safety',
      lastUpdated: '2024-01-10',
      status: 'approved',
      required: true,
      description: 'Comprehensive safety inspection before equipment installation',
      itemsCompleted: 15,
      totalItems: 18,
      dueDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Equipment Inspection Checklist',
      category: 'Quality',
      lastUpdated: '2024-01-12',
      status: 'pending',
      required: true,
      description: 'Daily equipment maintenance and inspection log',
      itemsCompleted: 8,
      totalItems: 12,
      dueDate: '2024-01-15'
    },
    {
      id: 3,
      title: 'Site Safety Assessment',
      category: 'Safety',
      lastUpdated: '2024-01-08',
      status: 'approved',
      required: false,
      description: 'Weekly site safety compliance assessment',
      itemsCompleted: 22,
      totalItems: 22,
      dueDate: '2024-01-25'
    },
    {
      id: 4,
      title: 'Quality Control Checklist',
      category: 'Quality',
      lastUpdated: '2024-01-09',
      status: 'pending',
      required: true,
      description: 'Quality assurance for completed work phases',
      itemsCompleted: 5,
      totalItems: 15,
      dueDate: '2024-01-18'
    }
  ];

  const filteredDailyReports = dailyReports.filter(report =>
    report.workCompleted?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.delaysIssues?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.report_date?.includes(selectedDate)
  );

  const filteredChecklists = checklistDocuments.filter(checklist =>
    checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.description.toLowerCase().includes(searchTerm.toLowerCase())
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

const handleRowClick = (reportId) => {
  navigate(`daily-reports/${reportId}`);
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

  const handleCreateReport = () => {
    // Navigate to report creation page or open modal
    console.log('Create new daily report');
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

  const handleEdit = (document, type) => {
    console.log(`Edit ${type}:`, document);
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className='Content ProjectDocuments'>

      {/* Navigation Tabs */}
      <div className="documents-tabs">
        <button 
          className={`tab-button ${activeTab === 'dailyReports' ? 'active' : ''}`}
          onClick={() => setActiveTab('dailyReports')}
        >
          <i className="fas fa-file-alt"></i>
          Daily Reports
          <span className="tab-count">{dailyReports.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'checklists' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklists')}
        >
          <i className="fas fa-clipboard-check"></i>
          Checklists
          <span className="tab-count">{checklistDocuments.length}</span>
        </button>
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
        
        {activeTab === 'dailyReports' && (
          <div className="date-filter">
            <i className="fas fa-calendar"></i>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}

        <div className="toolbar-actions">
          {activeTab === 'dailyReports' ? (
            <button className="btn-primary" onClick={handleCreateReport}>
              <i className="fas fa-plus"></i>
              Create Daily Report
            </button>
          ) : (
            <button className="btn-primary" onClick={handleUploadChecklist}>
              <i className="fas fa-upload"></i>
              Upload Checklist
            </button>
          )}
        </div>
      </div>

      {console.log(dailyReports)}
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
                    <th>Actions</th>
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
                      <td>
                        <div className="table-actions">
                          <button 
                            className="icon-btn"
                            onClick={() => handlePreview(report, 'report')}
                            title="View Full Report"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="icon-btn"
                            onClick={() => handleDownload(report, 'report')}
                            title="Download Report"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            className="icon-btn"
                            onClick={() => handleEdit(report, 'report')}
                            title="Edit Report"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
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
                <button className="btn-primary" onClick={handleCreateReport}>
                  Create Daily Report
                </button>
              </div>
            )}
          </div>
        ) : (
          // CHECKLISTS - CARD/GRID FORM
          <div className="checklists-grid">
            {filteredChecklists.length > 0 ? (
              filteredChecklists.map(checklist => {
                const progressPercentage = getProgressPercentage(checklist.itemsCompleted, checklist.totalItems);
                
                return (
                  <div key={checklist.id} className="checklist-card">
                    <div className="card-header">
                      <div className="card-title-section">
                        <h3>{checklist.title}</h3>
                        <span className={`status-badge ${getStatusBadge(checklist.status).class}`}>
                          {getStatusBadge(checklist.status).text}
                        </span>
                      </div>
                      {checklist.required && (
                        <span className="required-badge">Required</span>
                      )}
                    </div>
                    
                    <div className="card-content">
                      <p className="checklist-description">{checklist.description}</p>
                      
                      <div className="checklist-meta">
                        <div className="meta-item">
                          <i className="fas fa-folder"></i>
                          <span>{checklist.category}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-calendar"></i>
                          <span>Due: {new Date(checklist.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-sync"></i>
                          <span>Updated: {new Date(checklist.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="progress-section">
                        <div className="progress-header">
                          <span>Completion Progress</span>
                          <span className="progress-text">{progressPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-stats">
                          {checklist.itemsCompleted} of {checklist.totalItems} items completed
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
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
                        Download
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => handleEdit(checklist, 'checklist')}
                      >
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
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
        )}
      </div>

      {/* Quick Stats */}
      <div className="documents-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyReports.length}</h3>
            <p>Daily Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="stat-info">
            <h3>{checklistDocuments.length}</h3>
            <p>Checklists</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyReports.filter(r => r.status === 'completed').length}</h3>
            <p>Completed Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-info">
            <h3>{checklistDocuments.filter(c => c.status === 'approved').length}</h3>
            <p>Approved Checklists</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDocuments;