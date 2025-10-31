import React from 'react'

const ForemanCompletion = ({ currentTask, values, handleContractChange, handleApproval, proj }) => {
    return (
        <>
        {
            !proj.in_tnc && (currentTask.task_parent === 500 || currentTask.task_parent === 600)  ? (
                   <div className="completion-section emphasized">
                    <div className="section-header">
                        <h4>
                            {currentTask?.task_done === 1 ? "Task Completed" : "Complete Current Task"}
                        </h4>
                    </div>
                    <div className="completion-content">
                        {currentTask?.task_done === 1  ? (
                            <div>
                                Task Confirmed and is complete
                            </div>
                        ) : currentTask.task_approval === 1 ? (
                            <div className="task-completed-state">
                                <div className="completion-success">
                                    <div className="success-message">
                                        <h5>Task Successfully Completed</h5>
                                        <p>This task has been marked as complete and is awaiting final approval.</p>
                                    </div>
                                </div>
                                <div className="completion-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Completion Date:</span>
                                        <span className="detail-value">
                                            {new Date().toLocaleDateString("en-GB")}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Status:</span>
                                        <span className="status-badge pending-approval">
                                            Awaiting Approval
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="file-upload-section">
                                    <div className="upload-header">
                                        <span className="upload-label">Attach Completion Evidence</span>
                                        <span className="upload-required">* Required</span>
                                    </div>
                                    <div className="upload-area">
                                        <input 
                                            type="file"
                                            id="photos"
                                            name="photos"
                                            multiple
                                            accept="image/*"
                                            onChange={handleContractChange}    
                                        />
                                        <div className="upload-hint">
                                            <i className="fas fa-cloud-upload-alt"></i>
                                            <span>Click to upload photos or drag and drop</span>
                                            <small>Document task completion with visual evidence</small>
                                        </div>
                                        {values.photos.map((p, index) => (
                                            <div key={index}>{p.name}</div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    className="complete-task-btn primary-action"
                                    onClick={handleApproval(currentTask, values.photos, 'foreman')}
                                    disabled={values.photos.length === 0}
                                >
                                    <i className="fas fa-check-circle"></i>
                                    Mark Task Complete
                                </button>
                            </>
                        )}
                    </div>
                    </div>
            ) : (
                <div>
                    Project not in mechanical installation yet
                </div>
            )
        }        
        </>

    )
}

export default ForemanCompletion