/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, {useMemo, useState} from 'react'
import '../../css/TaskDetails.css'
import useFormValidate from "../../hooks/useFormValidate";
import { useSharedSocket } from '../../Context/SocketContext.js';
import { useStoreState } from 'easy-peasy';
import { Axios } from '../../api/axios.js'
import { useParams } from 'react-router-dom'

// Import role components
import ForemanCompletion from './ForemanCompletion'
import ProjectEngineerCompletion from './ProjectEngineerCompletion'
import QAQCCompletion from './QAQCCompletion'
import ProjectEngineerScheduling from './ProjectEngineerScheduling'
import TNCCompletion from './TNCCompletion.jsx';
import PMSCompletion from './PMSCompletion.jsx';

const TaskDetails = ({currentTask, currentParentTask, currentTaskPhase, proj, ConfirmationModal, fetchedData}) => {
    const omitPhases = [100, 200, 300, 400]
    const includeTncSchedule = !(omitPhases.includes(currentTask.task_parent))
    const { utilitiesSocket } = useSharedSocket()
    const {projId} = useParams()
    const employees = useStoreState(state => state.employees)
    const QAQCCoordinator = employees.find(e => e.job === 'QAQC Coordinator')
    const ProjectManager = employees.find(e => e.job === 'Project Manager')
    const TNCCoordinator = employees.find(e => e.job === 'TNC Coordinator')
    const PMSCoordinator = employees.find(e => e.job === 'PMS Coordinator')
    const QAQCCoordinatorId = QAQCCoordinator.employee_id
    const ProjectManagerId = ProjectManager.employee_id
    const TNCCoordinatorId = TNCCoordinator.employee_id
    const PMSCoordinatorId = PMSCoordinator.employee_id

    const role = sessionStorage.getItem('roles')
    const [qaqcDate, setQaqcDate] = useState(new Date())
    const [tncDate, setTncDate] = useState(new Date())
    const [saveStatus, setSaveStatus] = useState('')
    const [qaqcChecklistType, setQaqcChecklistType] = useState('')
    const [tncChecklistType, setTncChecklistType] = useState('')
    const [pmsDate, setPmsDate] = useState(new Date())
    console.log(proj)
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        type: '',
        data: null
    })
    
    const [punchlistModal, setPunchlistModal] = useState({
      isOpen: false,
      task: null
    });

    const [approvalModal, setApprovalModal] = useState({
      isOpen: false,
      task: null
    });
    
    const [completionModal, setCompletionModal] = useState({
      isOpen: false,
      task: null
    });

    const qaqcReasons = [
        'Template Setting',
        'Prior Testing and Commissioning',
        'Handover'
    ]
    const [qaqcReason, setQaqcReason] = useState(qaqcReasons[0])

    const handleQaqcReason = (e) => {
        setQaqcReason(e.target.value)
    }

    const formatDateForMySQL = (date) => {
        return new Date(date).toISOString().split('T')[0]
    }

    const formatDisplayDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB")
    }

    const handleScheduleQAQC = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'qaqc',
            data: {
                date: qaqcDate,
                reason: qaqcReason
            }
        })
    }

    const handleSchedulePMS = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'pms',
            data: {
                date: pmsDate,
                reason: 'Final Inspection'
            }
        })
    }

    const handleScheduleTNC = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'tnc',
            data: {
                date: tncDate
            }
        })
    }

    const handleApproval = (task, photos, type) => () => {
        if (type === 'punchlisting') {
            setPunchlistModal({
                isOpen: true,
                task: task,
                photos: photos,
                type: type
            });  
        } else {
            setApprovalModal({
                isOpen: true,
                task: task,
                photos: photos,
                type: type
            });  
        }

        console.log('where am I')
    }

    const handlePunchlistConfirm = async () => {
        setPunchlistModal({ isOpen: false, task: null });   
        const Ids = [proj.project_engineer_id]
        console.log(Ids)
        try {
            console.log('punchlist Confirm')
            const formData = new FormData
            const punchlistFiles = punchlistModal.photos.filter(
                (file) => file.fileType === "photo" || file.name.startsWith("punchlist_")
            );
            const punchlistEvidenceFiles = punchlistModal.photos.filter(
                (file) => file.fileType === "photo" || file.name.startsWith("punchlist_evidence_")
            );
            punchlistFiles.forEach((file) => {
                formData.append('punchlist', file)                
            }
            )
            punchlistEvidenceFiles.forEach((file) => {
                formData.append('punchlist_evidence', file)                
            }
            )
            // approvalModal.photos.forEach((file) => {
            //     formData.append('photos', file);
            // });
            console.log('before')
            const response = await Axios.post(`/api/projects/qaqc/punchlist/${proj.id}`, formData)
            if (!response.data?.success) {
                window.alert("Something went wrong during assignment.");
                return;
            }
            console.log('ds')

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Punchlist',
                    body: `Punchlist items to be rectified for ${proj.lift_name} (Client: ${proj.client})`,
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
            console.log(
                Object.fromEntries(formData.entries())
            );
            utilitiesSocket.emit('update_task_status')
            
        } catch (e) {
            console.log(e)
        }
       
    }

    const handleApprovalConfirm = async () => {
      try {
        
        setApprovalModal({ isOpen: false, task: null });
        const task_id = approvalModal.task.task_id
        const task_name = approvalModal.task.task_name
        const start_date = approvalModal.task.task_start.split('T')[0]
        const end_date = approvalModal.task.task_end.split('T')[0]
        const task_duration = approvalModal.task.task_duration
        const task_percent = approvalModal.task.task_percent

        const formData = new FormData()
        approvalModal.photos.forEach((file) => {
        formData.append('photos', file);
        });
        formData.append('task_id', task_id)
        formData.append('task_name', task_name)
        formData.append('start_date', start_date)
        formData.append('end_date', end_date)
        formData.append('task_duration', task_duration)
        formData.append('task_percent', task_percent)
        const Ids = [proj.project_engineer_id]

        const response = await Axios.put(`/api/projects/task/approval/${projId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        if (response?.data.success) {
            window.alert('task pending for completion')
        }
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Socket emit timeout"));
            }, 5000); 

            utilitiesSocket.emit("new_notification", {
                subject: 'Task Pending for completion',
                body: `${currentTask.task_name} pending for completion for ${proj.lift_name} (Client: ${proj.client})`,
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
        utilitiesSocket.emit('update_task_status')
       // window.location.reload()
      } catch (e) {
        console.log(e);
      }
    }

    const handleTaskComplete = (task, type) => () => {
        setCompletionModal({
            isOpen: true,
            task: task,
            type,
            photos: values.photos
        });

    }
     console.log(completionModal)
    const handleCompletionConfirm = (type) =>  async () => {
        try {
        //     console.log(fetchedData)
        //    console.log(type)

            if (type === 'Project Engineer'){
                let percentCompleted = 0
                    let taskUpdates = []
                    for(const t in fetchedData) {
                        percentCompleted += fetchedData[t].task_percent
                        taskUpdates.push(fetchedData[t])
                        if (fetchedData[t].task_name === completionModal.task.task_name) break
                    }

                    const payload = {
                        taskUpdates,
                        percentCompleted
                    }
                    await Axios.put(`/api/projects/schedule/${projId}`, payload)
                if (currentTask.task_name === 'Final Cleaning / Hand over') {
                    const Ids = [PMSCoordinatorId, ProjectManagerId]
                    console.log('handover procedure')
                    console.log(completionModal.photos)
                    const formData = new FormData()
                    completionModal.photos.forEach(p => formData.append('photos', p)) 
                    const task_id = completionModal.task.task_id
                    const task_name = completionModal.task.task_name
                    const start_date = completionModal.task.task_start.split('T')[0]
                    const end_date = completionModal.task.task_end.split('T')[0]
                    const task_duration = completionModal.task.task_duration
                    const task_percent = completionModal.task.task_percent

                    formData.append('task_id', task_id)
                    formData.append('task_name', task_name)
                    formData.append('start_date', start_date)
                    formData.append('end_date', end_date)
                    formData.append('task_duration', task_duration)
                    formData.append('task_percent', task_percent)
                    
                    await Axios.put(`api/projects/prepare-handover/${projId}`, formData)

                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error("Socket emit timeout"));
                        }, 5000); 

                        utilitiesSocket.emit("new_notification", {
                            subject: 'Prepare Handover',
                            body: `Prepare handover for ${proj.lift_name} (Client: ${proj.client})`,
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
                    
                }
            } else if (type === 'qaqc') {
                const formData = new FormData()
                console.log(completionModal)
                formData.append('inspection_type', type)
                formData.append('inspection_reason', proj.qaqc_inspection_reason)
                formData.append('checklist', qaqcChecklistType)
                const evidenceFiles = completionModal.photos.filter(
                        (file) => file.fileType === "photo" || file.name.startsWith("evidence_")
                    );
                const checklistFiles = completionModal.photos.filter(
                        (file) => file.fileType === "document" || file.name.startsWith("checklist_")
                    );
                    evidenceFiles.forEach((file) => formData.append("evidence", file));

                    // Append document files
                    checklistFiles.forEach((file) => formData.append("documents", file));
                formData.append('inspection_id', proj.current_qaqc_id)
                    console.log(
                        Object.fromEntries(formData.entries())
                    );
                 await Axios.post(`/api/projects/qaqc/complete/${projId}`, formData)
            } else if (type === 'tnc') {
                console.log("tnc completion modal", completionModal);

                    const formData = new FormData();
                    formData.append("inspection_type", "tnc");
                    formData.append("inspection_id", proj.current_tnc_id || ""); // optional, depends on your schema

                    // Separate files by their prefixes or custom properties
                    const evidenceFiles = completionModal.photos.filter(
                        (file) => file.fileType === "photo" || file.name.startsWith("photo_")
                    );
                    const documentFiles = completionModal.photos.filter(
                        (file) => file.fileType === "document" || file.name.startsWith("document_")
                    );

                    // Append evidence files
                    evidenceFiles.forEach((file) => formData.append("evidence", file));

                    // Append document files
                    documentFiles.forEach((file) => formData.append("documents", file));
                    const task_id = completionModal.task.task_id
                    const task_name = completionModal.task.task_name
                    const start_date = completionModal.task.task_start.split('T')[0]
                    const end_date = completionModal.task.task_end.split('T')[0]
                    const task_duration = completionModal.task.task_duration
                    const task_percent = completionModal.task.task_percent

                    formData.append('task_id', task_id)
                    formData.append('task_name', task_name)
                    formData.append('start_date', start_date)
                    formData.append('end_date', end_date)
                    formData.append('task_duration', task_duration)
                    formData.append('task_percent', task_percent)
                    formData.append('role', 'tnc')
                    formData.append('checklist_type', tncChecklistType)
                    console.log(
                        Object.fromEntries(formData.entries())
                    );
                    try {
                        const response = await Axios.post(`/api/projects/tnc/approve-task/${projId}`, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                        console.log('after repsonse')
                        if (response?.data.success) {
                            window.alert("TNC inspection completed successfully!");
                        } else {
                            window.alert("Something went wrong completing the TNC inspection.");
                        }
                    } catch (error) {
                        console.error("Error completing TNC:", error);
                        window.alert("Failed to complete TNC inspection.");
                    }
            } else if (type === 'pms') {
                console.log(completionModal)
                const formData = new FormData()
                console.log(completionModal)
                formData.append('inspection_type', type)
                const task_id = completionModal.task.task_id
                const task_name = completionModal.task.task_name
                const start_date = completionModal.task.task_start.split('T')[0]
                const end_date = completionModal.task.task_end.split('T')[0]
                const task_duration = completionModal.task.task_duration
                const task_percent = completionModal.task.task_percent

                formData.append('task_id', task_id)
                formData.append('task_name', task_name)
                formData.append('start_date', start_date)
                formData.append('end_date', end_date)
                formData.append('task_duration', task_duration)
                formData.append('task_percent', task_percent)
                const files = completionModal.photos.filter(
                    (file) => file.fileType === "photo" || file.name.startsWith("completion_evidence")
                );
                files.forEach((file) => formData.append("photos", file));

                await Axios.post(`/api/projects/pms/complete/${projId}`, formData)
            }
            setCompletionModal({ isOpen: false, task: null });   
            utilitiesSocket.emit('update_task_status')
            utilitiesSocket.emit('refresh_all_projects')
            //window.location.reload()
        } catch (e) {
            console.log(e)
        } 
    }

    const confirmSchedule = async () => {
        setSaveStatus('saving')
        setConfirmationModal({ isOpen: false, type: '', data: null })
        console.log(confirmationModal)
        try {
            const payload = {
                scheduled_date: formatDateForMySQL(confirmationModal.data.date),
                project_id: proj.id
            }
            const Ids = confirmationModal.type === 'qaqc' ? [QAQCCoordinatorId, ProjectManagerId] : [TNCCoordinatorId, ProjectManagerId]
            
            if (confirmationModal.type === 'qaqc') {
                payload.reason = confirmationModal.data.reason
            }
           
            const response = await Axios.post(`/api/projects/${confirmationModal.type}/request/${proj.id}`, payload)
            if (!response.data?.success) {
                window.alert("Something went wrong during assignment.");
                return;
            }

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Socket emit timeout"));
                }, 5000); 

                utilitiesSocket.emit("new_notification", {
                    subject: 'Request for Inspection',
                    body: `Inspection to be conducted for ${proj.lift_name} (Client: ${proj.client})
                     at ${payload.scheduled_date}${confirmationModal.type === 'qaqc' ? ` for ${payload.reason}` : ''}`,
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
            window.alert("Request for Inspection sent")
            setSaveStatus('success')
            utilitiesSocket.emit('update_task_status')
            utilitiesSocket.emit('refresh_all_projects')
        } catch (error) {
            console.error(`Error scheduling ${confirmationModal.type.toUpperCase()}:`, error)
            setSaveStatus('error')
        }
    }

    const closeModal = () => {
        setConfirmationModal({ isOpen: false, type: '', data: null })
    }

    const validate = (values) => {
        let error = {}
        if (values.photos.length === 0) error.photos = "Photo attachment is required"
        return error
    }

    const initialState = useMemo(() => ({
        photos: []
    }), [])

    const {
        values,
        handleContractChange,
        updatePhotos
    } = useFormValidate(initialState, validate)
    console.log(proj)
    const renderRoleCompletion = () => {    
        
        switch(role) {
            case 'Foreman':
                return (
                    <ForemanCompletion 
                        currentTask={currentTask}
                        values={values}
                        handleContractChange={handleContractChange}
                        handleApproval={handleApproval}
                        proj={proj}
                    />
                )
            case 'Project Engineer':
                return (
                    <ProjectEngineerCompletion 
                        currentTask={currentTask}
                        handleTaskComplete={handleTaskComplete}
                        proj={proj}
                        values={values}
                        handleContractChange={handleContractChange}
                        updatePhotos={updatePhotos}
                    />
                )
            case 'QAQC':
                return (
                    <QAQCCompletion 
                        proj={proj}
                        currentTask={currentTask}
                        values={values}
                        handleContractChange={handleContractChange}
                        handleApproval={handleApproval}
                        handleTaskComplete={handleTaskComplete}
                        setQaqcChecklistType={setQaqcChecklistType}
                        updatePhotos={updatePhotos}
                    />
                )
            case 'TNC Technician':
                return (
                    <TNCCompletion 
                        proj={proj}
                        currentTask={currentTask}
                        values={values}
                        handleContractChange={handleContractChange}
                        handleApproval={handleApproval}
                        handleTaskComplete={handleTaskComplete}
                        updatePhotos={updatePhotos}
                        setTncChecklistType={setTncChecklistType}
                        tncChecklistType={tncChecklistType}
                    />
                )
            case 'PMS Technician':
                return(
                    <PMSCompletion
                    proj={proj}
                    currentTask={currentTask}
                    values={values}
                    handleContractChange={handleContractChange}
                    handleTaskComplete={handleTaskComplete}
                    updatePhotos={updatePhotos}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="Content TaskDetails">
            {/* Not Project Engineer Modal */}
            <ConfirmationModal
                isOpen={approvalModal.isOpen}
                onClose={() => setApprovalModal({ isOpen: false, task: null })}
                onConfirm={handleApprovalConfirm}
                title="Confirm Approval"
                message={`Are you sure you want to approve the task "${approvalModal.task?.task_name}"? This action cannot be undone.`}
                confirmText="Approve Task"
                cancelText="Cancel"
                type={approvalModal.type}
            />
            {/* Project Engineer Modal */}
            <ConfirmationModal
                isOpen={completionModal.isOpen}
                onClose={() => setCompletionModal({ isOpen: false, task: null })}
                onConfirm={handleCompletionConfirm(completionModal.type)}
                title="Confirm Task Completion"
                message={`Are you sure you want to mark the task "${completionModal.task?.task_name}" as complete? This action cannot be undone.`}
                confirmText="Mark Complete"
                cancelText="Cancel"
                type={completionModal.type}
            />      
            {/* Punchlisting Modal */}
            <ConfirmationModal
                isOpen={punchlistModal.isOpen}
                onClose={() => setPunchlistModal({ isOpen: false, task: null })}
                onConfirm={handlePunchlistConfirm}
                title="Confirm Approval"
                message={`Are you sure you want to approve punchlisting for "${punchlistModal.task?.task_name}"? This action cannot be undone.`}
                confirmText="Approve Punchlisting"
                cancelText="Cancel"
                type={approvalModal.type}
            />
            <h3>Task Details</h3>
            
            {saveStatus === 'success' && (
                <div className="status-message success">
                    Inspection scheduled successfully!
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="status-message error">
                    Failed to schedule inspection. Please try again.
                </div>
            )}
            
            {confirmationModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Confirm Schedule</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to schedule this inspection?</p>
                            <div className="confirmation-details">
                                <div className="detail-item">
                                    <strong>Type:</strong> {confirmationModal.type === 'qaqc' ? 'QAQC Inspection' : 'Testing & Commissioning'}
                                </div>
                                <div className="detail-item">
                                    <strong>Date:</strong> {formatDisplayDate(confirmationModal.data.date)}
                                </div>
                                {confirmationModal.type === 'qaqc' && (
                                    <div className="detail-item">
                                        <strong>Reason:</strong> {confirmationModal.data.reason}
                                    </div>
                                )}
                                <div className="detail-item">
                                    <strong>Task:</strong> {currentTask?.task_name}
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button onClick={closeModal} className="btn-cancel">
                                Cancel
                            </button>
                            <button onClick={confirmSchedule} className="btn-confirm" disabled={saveStatus === 'saving'}>
                                {saveStatus === 'saving' ? 'Scheduling...' : 'Confirm Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="task-overview-minimal">
                <div className="task-context">
                    <div className="context-item">
                        <span className="context-label">Project:</span>
                        <span className="context-value">{currentParentTask?.task_name}</span>
                    </div>
                    <div className="context-item">
                        <span className="context-label">Phase:</span>
                        <span className="context-value">{currentTaskPhase?.task_name}</span>
                    </div>
                    <div className="context-item">
                        <span className="context-label">Active Task:</span>
                        <span className="context-value highlight">{currentTask?.task_name}</span>
                    </div>
                </div>
                <div className="task-timeline">
                    <div className="timeline-item">
                        <span className="timeline-date">
                            {new Date(currentTask?.task_start).toLocaleDateString("en-GB")} - {new Date(currentTask?.task_end).toLocaleDateString("en-GB")}
                        </span>
                        <span className="timeline-duration">({currentTask?.task_duration} days)</span>
                    </div>
                    <div className="progress-indicator">
                        Progress: <strong>{currentTask?.task_percent}%</strong>
                    </div>
                </div>
            </div>

            {/* Role-based Completion Section */}
            {renderRoleCompletion()}

            {/* Scheduling Section */}
            {role === 'Project Engineer' && !omitPhases.includes(currentTask.task_parent) && (
                <ProjectEngineerScheduling
                    qaqcDate={qaqcDate}
                    setQaqcDate={setQaqcDate}
                    tncDate={tncDate}
                    setTncDate={setTncDate}
                    pmsDate={pmsDate}
                    setPmsDate={setPmsDate}
                    qaqcReason={qaqcReason}
                    handleQaqcReason={handleQaqcReason}
                    qaqcReasons={qaqcReasons}
                    handleScheduleQAQC={handleScheduleQAQC}
                    handleScheduleTNC={handleScheduleTNC}
                    handleSchedulePMS={handleSchedulePMS}
                    saveStatus={saveStatus}
                    proj={proj}
                    includeTncSchedule={includeTncSchedule}
                    fetchedData={fetchedData}
                />
            )}

            {/* Special case for omitted phases */}
            {role === 'Project Engineer' && omitPhases.includes(currentTask.task_parent) && (
                <ProjectEngineerScheduling
                    qaqcDate={qaqcDate}
                    setQaqcDate={setQaqcDate}
                    tncDate={tncDate}
                    setTncDate={setTncDate}
                    pmsDate={pmsDate}
                    setPmsDate={setPmsDate}
                    qaqcReason={qaqcReason}
                    handleQaqcReason={handleQaqcReason}
                    qaqcReasons={qaqcReasons}
                    handleScheduleQAQC={handleScheduleQAQC}
                    handleScheduleTNC={handleScheduleTNC}
                    handleSchedulePMS={handleSchedulePMS}
                    saveStatus={saveStatus}
                    proj={proj}
                    includeTncSchedule={includeTncSchedule}
                    fetchedData={fetchedData}
                />
            )}
        </div>
    )
}

export default TaskDetails