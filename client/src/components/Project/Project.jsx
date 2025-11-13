import React, { useState } from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Axios } from '../../api/axios';
import { useSharedSocket } from '../../Context/SocketContext';

const summaryMap = {
    'Installation': 'Installation',
    'Preliminaries': 'Preliminaries',
    'Structural/Manufacturing': 'Structural-Manufacturing',
    'Manufacturing and Importation': 'Structural-Manufacturing',
    'Planning For Mobilization And Execution': 'Planning',
    'Test and Comm': 'Test-and-Comm'
}

const Project = ({project, viewMode = 'list'}) => {
  const {utilitiesSocket} = useSharedSocket()
  const navigate = useNavigate()
  const clearProjectTasks = useStoreActions(actions => actions.clearProjectTasks)
  const clearProjectData = useStoreActions(actions => actions.clearProjectData)
  const projectManagerId = useStoreState(state => state.projectManagerId)
  const [resumeModalOpen, setResumeModalOpen] = useState(false)
  const [approveResumeModalOpen, setApproveResumeModalOpen] = useState(false)
  const [requestHoldModalOpen, setRequestHoldModalOpen] = useState(false)
  const [resumeDate, setResumeDate] = useState('')
  const [approveResumeDate, setApproveResumeDate] = useState('')
  const [holdReason, setHoldReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRequestingHold, setIsRequestingHold] = useState(false)

  const handleClick = async () => {
    clearProjectData()
    clearProjectTasks()
    navigate(`/projects/${project.id}`)
  }

  const handleRequestHoldClick = (e) => {
    e.stopPropagation()
    setRequestHoldModalOpen(true)
  }

  const handleRequestHoldConfirm = async () => {
    if (!holdReason.trim()) {
      window.alert("Please provide a reason for the hold request");
      return;
    }

    setIsRequestingHold(true)
    try {
      console.log('Requesting hold for project:', project.id, 'Reason:', holdReason)
      
      // Call your API to request project hold
      const response = await Axios.put(`/api/projects/request-hold/${project.id}`, {
        hold_reason: holdReason
      })

      if (!response.data?.success) {
        window.alert("Something went wrong while requesting hold.");
        return;
      }

      // Send notification to Project Managers
      const pmIds = [projectManagerId]
      const Ids = pmIds

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket emit timeout"));
        }, 5000); 

        utilitiesSocket.emit("new_notification", {
          subject: 'Project Hold Request',
          body: `Project ${project.lift_name} (Client: ${project.client}) has requested to be put on hold.\n\nReason: ${holdReason}\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.`,
          Ids
        }, (ack) => {
          clearTimeout(timeout);
          if (ack?.success) {
            utilitiesSocket.emit("refresh_project_data");
            resolve();
          } else {
            reject(new Error("Server failed to process notification."));
          }
        });
      }); 
      
      utilitiesSocket.emit('refresh_all_projects')
      setRequestHoldModalOpen(false)
      setHoldReason('')
      window.alert("Hold request submitted successfully! Waiting for Project Manager approval.");

    } catch (error) {
      console.error('Error requesting hold:', error)
      window.alert("Failed to submit hold request. Please try again.");
    } finally {
      setIsRequestingHold(false)
    }
  }

  const handleRequestHoldCancel = () => {
    setRequestHoldModalOpen(false)
    setHoldReason('')
  }

  const handleApproveHold = async (e) => {
    e.stopPropagation()
    console.log('Approve hold for project:', project.id)
     const response = await Axios.put(`/api/projects/approve-hold/${project.id}`)
      if (!response.data?.success) {
          window.alert("Something went wrong during assignment.");
          return;
      }
      const peId = project.project_engineer_id
      const Ids = [peId]
          await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                  reject(new Error("Socket emit timeout"));
              }, 5000); 

              utilitiesSocket.emit("new_notification", {
                  subject: 'Hold Request Approved',
                  body: `Your hold request for ${project.lift_name} (Client: ${project.client}) has been approved.\n\nProject is now on hold and resources will be demobilized. You can request to resume when ready.`,
                  Ids
              }, (ack) => {
                  clearTimeout(timeout);
                  if (ack?.success) {
                      utilitiesSocket.emit("refresh_project_data");
                      resolve();
                  } else {
                  reject(new Error("Server failed to process notification."));
                  }
              });
          }); 
          utilitiesSocket.emit('refresh_all_projects')
  }

  const handleRejectHold = (e) => {
    e.stopPropagation()
    console.log('Reject hold for project:', project.id)
    // Add your hold rejection logic here
  }

  const handleResumeClick = (e) => {
    e.stopPropagation()
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setResumeDate(today)
    setResumeModalOpen(true)
  }

  const handleApproveResumeClick = (e) => {
    e.stopPropagation()
    // Set default date to the requested resume date or today
    const defaultDate = project.requested_resume_date ? 
      new Date(project.requested_resume_date).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0]
    setApproveResumeDate(defaultDate)
    setApproveResumeModalOpen(true)
  }

  const handleRequestResumeConfirm = async () => {
    if (!resumeDate) {
      window.alert("Please select a resume date");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(resumeDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      window.alert("Please select a date today or in the future");
      return;
    }

    setIsSubmitting(true)
    try {
      console.log('Requesting resume for project:', project.id, 'on date:', resumeDate)
      
      // Call your API to request project resume
      const response = await Axios.put(`/api/projects/request-resume/${project.id}`, {
        resume_date: resumeDate
      })

      if (!response.data?.success) {
        window.alert("Something went wrong while requesting resume.");
        return;
      }

      // Send notification to Project Managers
      const pmIds = [projectManagerId]
      const Ids = pmIds

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket emit timeout"));
        }, 5000); 

        utilitiesSocket.emit("new_notification", {
          subject: 'Project Resume Request',
          body: `Project ${project.lift_name} (Client: ${project.client}) requested to resume on ${new Date(resumeDate).toLocaleDateString()}. Please review and approve the resume date.`,
          Ids
        }, (ack) => {
          clearTimeout(timeout);
          if (ack?.success) {
            utilitiesSocket.emit("refresh_project_data");
            resolve();
          } else {
            reject(new Error("Server failed to process notification."));
          }
        });
      }); 
      
      utilitiesSocket.emit('refresh_all_projects')
      setResumeModalOpen(false)
      window.alert("Resume request submitted successfully! Waiting for Project Manager approval.");

    } catch (error) {
      console.error('Error requesting resume:', error)
      window.alert("Failed to submit resume request. Please try again.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveResumeConfirm = async () => {
    if (!approveResumeDate) {
      window.alert("Please select an approved resume date");
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(approveResumeDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      window.alert("Please select a date today or in the future");
      return;
    }

    setIsApproving(true)
    try {
      console.log('Approving resume for project:', project.id, 'on date:', approveResumeDate)
      
      // Call your API to approve project resume
      const response = await Axios.put(`/api/projects/resume/${project.id}`, {
        resume_date: approveResumeDate
      })

      if (!response.data?.success) {
        window.alert("Something went wrong while approving resume.");
        return;
      }

      // Send notification to Project Engineer
      const peId = project.project_engineer_id
      const Ids = [peId]

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket emit timeout"));
        }, 5000); 

        utilitiesSocket.emit("new_notification", {
          subject: 'Project Resume Approved',
          body: `Your resume request for project ${project.lift_name} (Client: ${project.client}) has been approved. Project will resume on ${new Date(approveResumeDate).toLocaleDateString()}. Please prepare accordingly.`,
          Ids
        }, (ack) => {
          clearTimeout(timeout);
          if (ack?.success) {
            utilitiesSocket.emit("refresh_project_data");
            resolve();
          } else {
            reject(new Error("Server failed to process notification."));
          }
        });
      }); 
      
      utilitiesSocket.emit('refresh_all_projects')
      setApproveResumeModalOpen(false)
      window.alert("Resume request approved successfully! Project Engineer has been notified.");

    } catch (error) {
      console.error('Error approving resume:', error)
      window.alert("Failed to approve resume request. Please try again.");
    } finally {
      setIsApproving(false)
    }
  }

  const handleResumeCancel = () => {
    setResumeModalOpen(false)
    setResumeDate('')
  }

  const handleApproveResumeCancel = () => {
    setApproveResumeModalOpen(false)
    setApproveResumeDate('')
  }
  
  const projectStatus = () => {
    if (project.request_hold) return 'request-hold'
    if (project.on_hold) return 'on-hold'
    if (project.is_behind) return 'behind'
    return ''
  }

  const getDaysRemaining = () => {
    if (!project.project_end_date) return null
    const endDate = new Date(project.project_end_date)
    const today = new Date()
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  return (
    <>
      <div className={`ProjectInfo ${projectStatus()} ${viewMode}`} onClick={handleClick}>
        {/* Project Info Column */}
        <div className="project-main-info">
          <div className="project-name-section">
            <h3 className="project-name">{project.lift_name}</h3>
            <div className="project-client">{project.client}</div>
          </div>
          <div className="project-meta">
            <span className="project-id">ID: {project.id}</span>
            <span className="project-pe">PE: {project.pe_fullname || project.project_engineer}</span>
          </div>
        </div>

        {/* Location Column */}
        <div className="project-location">
          <div className="location-main">{project.city_municipality || project.region}</div>
          <div className="location-details">
            {project.region} {project.province && `• ${project.province}`}
          </div>
        </div>

        {/* Timeline Column */}
        <div className="project-timeline">
          <div className="timeline-dates">
            <div className="date-item">
              <label>Start:</label>
              <span>{project.start_date ? new Date(project.start_date).toLocaleDateString("en-GB") : 'Pending'}</span>
            </div>
            <div className="date-item">
              <label>Target End:</label>
              <span>{project.project_end_date ? new Date(project.project_end_date).toLocaleDateString("en-GB") : 'Pending'}</span>
            </div>
          </div>
          {daysRemaining !== null && (
            <div className={`days-remaining ${daysRemaining < 0 ? 'overdue' : daysRemaining < 30 ? 'urgent' : ''}`}>
              {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
            </div>
          )}
        </div>

        {/* Progress Column */}
        <div className="project-progress">
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-text">{project.progress}% Complete</span>
            </div>
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={project.progress} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e9ecef',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: project.is_behind ? '#dc3545' : '#315a95'
                  }
                }}
              />          
            </Box>
          </div>
        </div>

        {/* Status & Actions Column */}
        <div className="project-status-actions">
          <div className="status-section">
            <span className={`status-badge status-${summaryMap[project.status] || 'default'}`}>
              {project.status || '-'}
            </span>
            {projectStatus() === 'behind' && (
              <span className="status-badge status-behind">Behind Schedule</span>
            )}
            {projectStatus() === 'on-hold' && (
              <span className="status-badge status-hold">On Hold</span>
            )}
            {projectStatus() === 'request-hold' && (
              <span className="status-badge status-requested">Hold Requested</span>
            )}
          </div>
        </div>
        <div className='pending-section'>
          {sessionStorage.getItem('roles') === 'Project Manager' ? (
            <>
              {project.will_resume ? (
                <div className='hold-action-buttons'>
                  <div className="resume-info">
                    <div>Project will resume on:</div>
                    <div className="resume-date">{new Date(project.resume_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : project.request_resume ? (
                <div className="hold-action-buttons">
                  <button onClick={handleApproveResumeClick} className="btn-approve">
                    Approve Resume
                  </button>
                  <div className="requested-date">
                    Requested: {new Date(project.resume_date).toLocaleDateString()}
                  </div>
                </div>
              ) : project.on_hold ? (
                <div className="hold-action-buttons waiting">Waiting for Resume Request</div>
              ) : project.request_hold ? (
                  <div className="hold-action-buttons">
                    <button 
                      className="btn-approve"
                      onClick={handleApproveHold}
                    >
                      Approve Hold
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={handleRejectHold}
                    >
                      Reject
                    </button>
                  </div>
              ) : (<>-</>)}
            </>
          ) : sessionStorage.getItem('roles') === 'Project Engineer' ? (
            <>
              {project.will_resume ? (
                <div className='hold-action-buttons'>
                  <div className="resume-info">
                    <div>Project will resume on:</div>
                    <div className="resume-date">{new Date(project.resume_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : project.request_resume ? (
                <div className="hold-action-buttons pending">
                  <button disabled>
                    Request Pending Approval
                  </button>
                  <div className="requested-date">
                    Requested: {new Date(project.resume_date).toLocaleDateString()}
                  </div>
                </div>
              ) : project.on_hold ? (
                  <div className="hold-action-buttons">
                    <button onClick={handleResumeClick} className="btn-resume">
                      Request Resume              
                    </button>
                  </div>    
              ) : project.request_hold ? (
                  <div className="hold-action-buttons pending">
                    Hold Request Pending
                  </div>
              ) : (
                  <div className="hold-action-buttons">
                    <button onClick={handleRequestHoldClick} className="btn-hold" disabled={project.progress < 90}>
                      Request Hold
                    </button>
                  </div>
              )}
            </>           
          ) : (
            <>
            </>
          )}
        </div>
      </div>

      {/* Request Hold Modal - For Project Engineer */}
      {requestHoldModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request Project Hold</h3>
              <button className="modal-close" onClick={handleRequestHoldCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p><strong>Project:</strong> {project.lift_name}</p>
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Current Progress:</strong> {project.progress}% Complete</p>
                <p><strong>Current Status:</strong> {project.status || 'Active'}</p>
              </div>
              
              <div className="modal-instructions">
                <p><strong>Important Notice:</strong> Requesting a project hold will involve:</p>
                <ul>
                  <li>Demobilizing all manpower from the site</li>
                  <li>Securing and storing all equipment and resources</li>
                  <li>Pausing all project activities and timelines</li>
                  <li>Requiring Project Manager approval to resume work</li>
                </ul>
                <p className="note warning">This action should only be taken for significant reasons such as client requests, site issues, or major delays.</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="holdReason">Reason for Hold Request:</label>
                <textarea
                  id="holdReason"
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  placeholder="Please provide detailed reason for putting the project on hold..."
                  rows="4"
                  className="reason-textarea"
                />
                <div className="date-note">Provide clear explanation for the hold request</div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={handleRequestHoldCancel}
                disabled={isRequestingHold}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-warning"
                onClick={handleRequestHoldConfirm}
                disabled={isRequestingHold || !holdReason.trim()}
              >
                {isRequestingHold ? 'Submitting Request...' : 'Submit Hold Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Resume Modal - For Project Engineer */}
      {resumeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request Project Resume</h3>
              <button className="modal-close" onClick={handleResumeCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p><strong>Project:</strong> {project.lift_name}</p>
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Current Status:</strong> On Hold since {project.hold_date ? new Date(project.hold_date).toLocaleDateString() : 'unknown date'}</p>
              </div>
              
              <div className="modal-instructions">
                <p>You are requesting to resume work on this project. Please select the date when you plan to restart project activities.</p>
                <p className="note">Note: This request will be sent to the Project Manager for approval. You will be notified once your request is reviewed.</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="resumeDate">Proposed Resume Date:</label>
                <input
                  type="date"
                  id="resumeDate"
                  value={resumeDate}
                  onChange={(e) => setResumeDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input"
                />
                <div className="date-note">Select the date when work should recommence</div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={handleResumeCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleRequestResumeConfirm}
                disabled={isSubmitting || !resumeDate}
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Resume Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Resume Modal - For Project Manager */}
      {approveResumeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Approve Project Resume</h3>
              <button className="modal-close" onClick={handleApproveResumeCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-description">
                <p><strong>Project:</strong> {project.lift_name}</p>
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Project Engineer:</strong> {project.pe_fullname || project.project_engineer}</p>
                <p><strong>Requested Resume Date:</strong> {project.requested_resume_date ? new Date(project.requested_resume_date).toLocaleDateString() : 'Not specified'}</p>
              </div>
              
              <div className="modal-instructions">
                <p>You are approving the resume request for this project. Please confirm or adjust the resume date as needed.</p>
                <p className="note">Note: The Project Engineer will be notified of your decision and the approved resume date.</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="approveResumeDate">Approved Resume Date:</label>
                <input
                  type="date"
                  id="approveResumeDate"
                  value={approveResumeDate}
                  onChange={(e) => setApproveResumeDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input"
                />
                <div className="date-note">Set the official date when project work should resume</div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={handleApproveResumeCancel}
                disabled={isApproving}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleApproveResumeConfirm}
                disabled={isApproving || !approveResumeDate}
              >
                {isApproving ? 'Approving...' : 'Approve Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Project