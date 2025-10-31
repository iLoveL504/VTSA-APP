import React, { useState } from 'react'
//import { DatePickerInput } from '@mantine/dates';
import { Axios } from '../../api/axios.js'
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'

// Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestQAQC = ({proj, currentTask}) => {
    const navigate = useNavigate()
    const employees = useStoreState(state => state.employees)
    const QAQCCoordinatorId = employees.find(e => e.job === 'QAQC Coordinator').employee_id
    const ProjectManagerId = employees.find(e => e.job === 'Project Manager').employee_id
    const date = new Intl.DateTimeFormat('en-CA').format(new Date(currentTask.task_end))
    const {utilitiesSocket} = useSharedSocket()
    console.log(typeof date)
    
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleClick = () => {
        // Open confirmation modal instead of directly executing
        setIsModalOpen(true)
    }

function formatForMySQL(dateInput) {
  return new Intl.DateTimeFormat('en-CA').format(new Date(dateInput));
}


    const handleConfirm = async () => {
        try {
            console.log(QAQCCoordinatorId)
            const dueDate = formatForMySQL(currentTask.task_end);
            console.log(dueDate)
            const response = await Axios.post(`api/projects/qaqc/request/${proj.id}`, {
              projectId: proj.id,
              taskName: currentTask.task_name,
              taskPhase: proj.task_phase,
              dueDate: dueDate
            });
            
            if (!response.data?.success) {
                window.alert("Something went wrong during assignment.");
                return;
            }

            //Make notification
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Request for Inspection',
                    body: `Inspection to be conducted for ${proj.lift_name} (Client: ${proj.client}) within ${dueDate}`,
                    Ids: [QAQCCoordinatorId, ProjectManagerId]
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

            window.alert("Request for Inspection sent")
            navigate(`/projects/${proj.id}`)
            window.location.reload()
            // Close modal after successful request
            setIsModalOpen(false);
            
            //Optional: Show success message or redirect
            alert('QAQC Inspection requested successfully!');
            
        } catch (error) {
            window.alert('Error requesting QAQC inspection')
            console.error('Error requesting QAQC inspection:', error);
            // Handle error (show error message to user)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title="Confirm QAQC Inspection Request"
                message={`Are you sure you want to request a QAQC inspection for "${currentTask.task_name}" (${proj.task_phase})? This inspection should be completed by ${new Date(currentTask.task_end).toLocaleDateString("en-GB")}.`}
                confirmText="Request Inspection"
                cancelText="Cancel"
            />
            
            <div className='Content RequestQAQC'>
                <div className='request-section'>
                    <div className="request-header">
                        <i className="fas fa-clipboard-check"></i>
                        <h2>QAQC Inspection Request</h2>
                    </div>
                    
                    <div className="request-info">
                        <div className="info-item">
                            <span className="info-label">Task:</span>
                            <span className="info-value">{currentTask.task_name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phase:</span>
                            <span className="info-value">{proj.task_phase}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Project ID:</span>
                            <span className="info-value">{proj.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Client:</span>
                            <span className="info-value">{proj.client}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Lift Name:</span>
                            <span className="info-value">{proj.lift_name}</span>
                        </div>
                        <div className="info-item deadline">
                            <span className="info-label">Inspection Deadline:</span>
                            <span className="info-value deadline-date">
                                {new Date(currentTask.task_end).toLocaleDateString("en-GB")}
                            </span>
                        </div>
                    </div>

                    <div className="request-note">
                        <p>
                            <i className="fas fa-info-circle"></i>
                            The QAQC inspection must be conducted and completed before the task end date to ensure proper quality assurance and compliance with project standards.
                        </p>
                    </div>

                    <button className="request-btn" onClick={handleClick}>
                        <i className="fas fa-paper-plane"></i>
                        Request QAQC Inspection
                    </button>
                </div>
            </div>

        </>
    )
}

export default RequestQAQC