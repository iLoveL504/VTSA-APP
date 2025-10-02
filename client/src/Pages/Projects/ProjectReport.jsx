import React, { useState, useEffect } from "react";
import '../../css/DailyReport.css'
import { Axios } from '../../api/axios.js'
import { useNavigate, useParams } from 'react-router-dom' 

const ProjectReport = () => {
  const {projId} = useParams()
  const [reportData, setReportData] = useState({
    workCompleted: "",
    workPlannedNextDay: "",
    delaysIssues: "",
    photos: [],
    remarks: "",
    fullName: sessionStorage.getItem("fullName")
  });

  useEffect(() => {
    console.log(reportData.photos)
  }, [reportData])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(Number(projId))
    console.log(reportData)
    const formData = new FormData()
    formData.append("workCompleted", reportData.workCompleted);
    formData.append("workPlannedNextDay", reportData.workPlannedNextDay);
    formData.append("delaysIssues", reportData.delaysIssues);
    formData.append("remarks", reportData.remarks);
    formData.append("fullName", reportData.fullName);

    // multiple photos
    reportData.photos.forEach((file) => {
      formData.append("photos", file); 
    });

    try {
      await Axios.post(`/projects/report/${projId}`, formData, {
        headers: {
          "Content-type": "multipart/form-data"
        }
      })
    } catch (e) {
      console.log(e)
    }
    
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
                  photos: [...prev.photos, ...Array.from(e.target.files)],
                }))
              }
            />
            <small>
              Photos inserted:
              {reportData.photos.map(p => {
                return (<div>{p.name}</div>)
              })}
            </small>
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
