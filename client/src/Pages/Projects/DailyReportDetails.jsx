import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import useAxiosFetch from '../../hooks/useAxiosFetch';
import '../../css/DailyReportDetails.css';

const DailyReportDetails = () => {
  const { projId, reportId } = useParams();
  const contentRef = useRef();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [attachments, setAttachments] = useState([])
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(backendURL)
  // Fetch the specific daily report
  const { data: reportData, fetchError } = useAxiosFetch(
    `${backendURL}/api/projects/report/${projId}`
  );

useEffect(() => {
  if (reportData && reportData.length > 0) {
    // Filter only the rows for this report ID
    const sameReportRows = reportData.filter(r => r.id === Number(reportId));
    
    if (sameReportRows.length > 0) {
      // Extract the first row for the main report details
      const mainReport = sameReportRows[0];

      // Collect all photo URLs for this report
      const photos = sameReportRows
        .map(r => r.photo_url)
        .filter(url => url); // remove nulls just in case
       console.log(photos)
      setReport(mainReport);
      setAttachments(photos);
    }

    setIsLoading(false);
  }

  if (fetchError) {
    setError(fetchError);
    setIsLoading(false);
  }
}, [reportData, fetchError, reportId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleEdit = () => {
    navigate(`/daily-reports/${reportId}/edit`);
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log('Downloading report:', reportId);
    // You can generate a PDF or download existing file
  };


const handlePrint = useReactToPrint({
  contentRef,
  documentTitle: `Daily Report - ${reportId}`,
});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="Content DailyReportDetails">
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading daily report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Content DailyReportDetails">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Error Loading Report</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="Content DailyReportDetails">
        
        <div className="not-found-container">
          <i className="fas fa-file-search"></i>
          <h2>Report Not Found</h2>
          <p>The requested daily report could not be found.</p>
          <button className="btn-primary" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="Content DailyReportDetails">
      {/* Header Section */}
      <div ref={contentRef}>
        <div className="dailyreport-header">
        <div className="header-actions">
          <button className="btn-back" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Back to Reports
          </button>
          <div className="action-buttons">
            {
                report && (
                 <button className="btn-outline" onClick={handlePrint}>
              <i className="fas fa-print"></i>
              Print
            </button>
                )
            }
           
            <button className="btn-outline" onClick={handleDownload}>
              <i className="fas fa-download"></i>
              Download PDF
            </button>
            <button className="btn-primary" onClick={handleEdit}>
              <i className="fas fa-edit"></i>
              Edit Report
            </button>
          </div>
        </div>
        
        <div className="header-content">
          <h1>Daily Progress Report</h1>
          <div className="report-meta">
            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              <span><strong>Report Date:</strong> {formatDate(report.report_date)}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-user"></i>
              <span><strong>Prepared By:</strong> {report.author || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-hashtag"></i>
              <span><strong>Report ID:</strong> #{report.id}</span>
            </div>
            {report.project_id && (
              <div className="meta-item">
                <i className="fas fa-project-diagram"></i>
                <span><strong>Project ID:</strong> #{report.project_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="report-content">
        {/* Work Completed Section */}
        <section className="content-section">
          <div className="section-header">
            <i className="fas fa-check-circle"></i>
            <h2>Work Completed Today</h2>
          </div>
          <div className="section-content">
            <div className="text-content">
              {report.workCompleted ? (
                <p>{report.workCompleted}</p>
              ) : (
                <p className="no-data">No work completed information provided.</p>
              )}
            </div>
          </div>
        </section>

        {/* Work Planned for Next Day Section */}
        <section className="content-section">
          <div className="section-header">
            <i className="fas fa-calendar-check"></i>
            <h2>Work Planned for Next Day</h2>
          </div>
          <div className="section-content">
            <div className="text-content">
              {report.workPlannedNextDay ? (
                <p>{report.workPlannedNextDay}</p>
              ) : (
                <p className="no-data">No work planned information provided.</p>
              )}
            </div>
          </div>
        </section>

        {/* Delays & Issues Section */}
        <section className="content-section">
          <div className="section-header">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Delays & Issues</h2>
          </div>
          <div className="section-content">
            <div className="text-content">
              {report.delaysIssues ? (
                <div className="issues-content">
                  <p>{report.delaysIssues}</p>
                </div>
              ) : (
                <p className="no-data">No delays or issues reported.</p>
              )}
            </div>
          </div>
        </section>

        {/* Remarks Section */}
        <section className="content-section">
          <div className="section-header">
            <i className="fas fa-sticky-note"></i>
            <h2>Additional Remarks</h2>
          </div>
          <div className="section-content">
            <div className="text-content">
              {report.remarks ? (
                <p>{report.remarks}</p>
              ) : (
                <p className="no-data">No additional remarks provided.</p>
              )}
            </div>
          </div>
        </section>

        {/* Attachments Section (if available) */}
        {(attachments && attachments.length > 0) && (
          <section className="content-section">
            <div className="section-header">
              <i className="fas fa-paperclip"></i>
              <h2>Attachments</h2>
            </div>
            <div className="section-content">
              <div className="attachments-list">
                {attachments.map((path, index) => (
                  <div key={index} className="attachment-item">
              
                    <img
                      src={`${backendURL}${path}`}
                      alt={`Attachment ${index + 1}`}
                      className="attachment-preview"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer Section */}
      <div className="report-footer">
        <div className="footer-content">
          <div className="signature-section">
            <div className="signature-field">
              <div className="signature-line"></div>
              <span className="signature-label">Prepared By</span>
            </div>
            <div className="signature-field">
              <div className="signature-line"></div>
              <span className="signature-label">Approved By</span>
            </div>
          </div>
          
          <div className="footer-meta">
            <p><strong>Generated On:</strong> {formatDateTime(new Date().toISOString())}</p>
            <p><strong>Report ID:</strong> {report.id}</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="floating-actions">
        <button className="fab btn-primary" onClick={handleEdit} title="Edit Report">
          <i className="fas fa-edit"></i>
        </button>
        <button className="fab btn-outline" onClick={handleDownload} title="Download PDF">
          <i className="fas fa-download"></i>
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default DailyReportDetails;
