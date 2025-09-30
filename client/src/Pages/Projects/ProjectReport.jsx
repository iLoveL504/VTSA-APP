import React, { useState } from "react";
import '../../css/DailyReport.css'

const ProjectReport = () => {
  const [reportData, setReportData] = useState({
    workCompleted: "",
    workPlannedNextDay: "",
    delaysIssues: "",
    photos: [],
    remarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting elevator project report:", reportData);
    alert("Elevator Project Report submitted successfully!");
  };

  return (
    <div className="Content ProjectReport">
      <div className="report-header">
        <h1>Elevator Project Daily Report</h1>
        <p>Submit work progress, issues, and additional details</p>
      </div>

      <form onSubmit={handleSubmit} className="report-form">
        {/* Work Progress */}
        <div className="form-section">
          <h2>Work Progress</h2>
          <div className="form-group">
            <label htmlFor="workCompleted">Work Completed Today</label>
            <textarea
              id="workCompleted"
              name="workCompleted"
              value={reportData.workCompleted}
              onChange={handleInputChange}
              placeholder="Describe elevator-related work completed today"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="workPlannedNextDay">Work Planned for Next Day</label>
            <textarea
              id="workPlannedNextDay"
              name="workPlannedNextDay"
              value={reportData.workPlannedNextDay}
              onChange={handleInputChange}
              placeholder="Describe elevator-related work planned for tomorrow"
              rows="4"
              required
            />
          </div>
        </div>

        {/* Issues */}
        <div className="form-section">
          <h2>Issues & Quality</h2>
          <div className="form-group">
            <label htmlFor="delaysIssues">Delays or Issues Encountered</label>
            <textarea
              id="delaysIssues"
              name="delaysIssues"
              value={reportData.delaysIssues}
              onChange={handleInputChange}
              placeholder="Describe any delays, issues, or problems encountered"
              rows="3"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="photos">Upload Photos (Optional)</label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={(e) =>
                setReportData((prev) => ({
                  ...prev,
                  photos: [...e.target.files],
                }))
              }
            />
            <small>Upload photos of work progress, issues, or completed tasks</small>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks/Additional Notes</label>
            <textarea
              id="remarks"
              name="remarks"
              value={reportData.remarks}
              onChange={handleInputChange}
              placeholder="Any additional information or comments"
              rows="3"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Elevator Project Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectReport;
