import React, {useMemo, useEffect, useState} from 'react'
import useFormValidate from "../../hooks/useFormValidate";
import '../../css/FinalizeHandover.css';
import { Axios } from '../../api/axios';

const FinalizeHandover = ({proj}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});

    const initialState = useMemo(() => ({
        photos: [],
        contractType: 'Monthly',
        handoverDate: new Date().toISOString().split('T')[0] // Default to today
    }), [])

    const contractTypes = [
        'Monthly',
        'Quarterly',
        'Yearly'
    ]

    const validate = (values) => {
        let error = {}
        if (values.photos.length === 0) error.photos = "At least one handover document is required"
        if (!values.handoverDate) error.handoverDate = "Handover date is required"
        if (values.contractType === '') error.contractType = "Provide Contract Schedule"
        return error
    }

    const {
        values,
        handleContractChange,
        handleInputChange,
        handleBlur,
        errors,
        updatePhotos
    } = useFormValidate(initialState, validate)
    console.log(values)
    const handleFileUpload = (event, type) => {
        const files = Array.from(event.target.files);
        
        // Simulate upload progress for each file
        files.forEach((file) => {
            setUploadProgress(prev => ({...prev, [file.name]: 0}));
            
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    const currentProgress = prev[file.name] || 0;
                    if (currentProgress >= 100) {
                        clearInterval(interval);
                        return prev;
                    }
                    return {...prev, [file.name]: currentProgress + 10};
                });
            }, 100);
        });

        const typedFiles = files.map(file => {
            const customFile = new File([file], `${type}_${file.name}`, {
                type: file.type,
                lastModified: file.lastModified
            })
            Object.defineProperty(customFile, 'fileType', {
                value: type,
                writable: false
            })
            return customFile
        })

        handleContractChange({
            target: { files: typedFiles }
        })
    }

    useEffect(() => {
        console.log('Updated form values:', values);
    }, [values]);

    const removeFile = (fileToRemove) => {
        const updated = values.photos?.filter(f => f !== fileToRemove);
        setUploadProgress(prev => {
            const newProgress = {...prev};
            delete newProgress[fileToRemove.name];
            return newProgress;
        });
        updatePhotos(updated);
    }

    const getFilesByType = (type) => {
        return values.photos?.filter(file => {
            const fileType = file.fileType || (file.name?.startsWith(`${type}_`) ? type : null)
            return fileType === type
        }) || []
    }

    const handleNewEntry = () => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            alert('Please fix validation errors before proceeding');
            return;
        }
        setShowConfirmation(true);
    }

    const confirmNewEntry = async () => {
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            console.log('Final values for PMS Entry:', values);
            const formData = new FormData()
            try {
                values.photos.forEach(p => {
                    formData.append('photos', p)
                })
                formData.append('contract', values.contractType)
                formData.append('client', proj.client)
                const response = Axios.put(`/api/projects/complete-handover/${proj.id}`, formData)
                if (!response?.data.success) {
                    window.alert('Something went wrong')
                }

                alert('New PMS Entry created successfully!');
            } catch (e) {
                console.log(e)
            }            
        } else {
            window.alert('Please fill all required fields')
        }

        setShowConfirmation(false);
    }

    const cancelNewEntry = () => {
        setShowConfirmation(false);
    }

    const handoverDocuments = getFilesByType('handover_doc');
    const isFormValid = values.photos.length > 0 && values.handoverDate;

    return (
        <div className='Content FinalizeHandover'>
            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <div className="modal-header">
                            <h3>Confirm PMS Entry Creation</h3>
                            <button 
                                className="close-btn"
                                onClick={cancelNewEntry}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <div className="confirmation-warning">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p>You are about to create a new PMS Entry. This action cannot be undone.</p>
                            </div>
                            
                            <div className="entry-summary">
                                <h4>Entry Summary</h4>
                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span className="summary-label">Handover Date:</span>
                                        <span className="summary-value">{values.handoverDate}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Documents Uploaded:</span>
                                        <span className="summary-value">{values.photos.length} files</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="btn-secondary"
                                onClick={cancelNewEntry}
                            >
                                <i className="fas fa-arrow-left"></i>
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={confirmNewEntry}
                            >
                                <i className="fas fa-check-circle"></i>
                                Confirm & Create Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='finalize-handover-container'>
                <div className="handover-header">
                    <h2>Finalize Project Handover</h2>
                    <div className="handover-badge">
                        <i className="fas fa-handshake"></i>
                        PMS Entry Creation
                    </div>
                </div>

                <div className="handover-description">
                    <p>
                        The project has reached the handover phase. Please upload all required handover documents 
                        and complete the information below to create a new PMS entry for final project closure.
                    </p>
                </div>

                <div className="handover-form-section">
                    {/* Handover Date */}
                    <div className="form-group">
                        <label htmlFor="handoverDate" className="form-label">
                            <i className="fas fa-calendar-alt"></i>
                            Handover Date *
                        </label>
                        {new Date().toLocaleDateString('en-GB')}
                    </div>

                         <div className="form-control-professional">
                        <label htmlFor="contracttType">Equipment Type</label>
                        <select
                            id="contractType"
                            name="contractType"
                            value={values.equipmentType}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                        >
                            <option value="">-- Select contract --</option>
                            {contractTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                            ))}
                        </select>
                        {errors.contractType && <p className="error">{errors.contractType}</p>}
                        </div>
                    {/* Document Upload Section */}
                    <div className="document-upload-card required">
                        <div className="document-header">
                            <div className="document-title">
                                <i className="fas fa-file-contract"></i>
                                <span>Handover Documents *</span>
                            </div>
                            <span className="upload-badge required">Required</span>
                        </div>
                        
                        <p className="document-description">
                            Upload signed handover certificates, completion reports, and formal acceptance documents.
                        </p>

                        <div className="upload-area">
                            <input 
                                type="file"
                                id="handover-doc-upload"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                                onChange={(e) => handleFileUpload(e, 'handover_doc')}
                            />
                            <div className="upload-hint">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <div className="hint-content">
                                    <span className="hint-title">Click to upload handover documents</span>
                                    <small>PDF, Word, Excel, or image files (Max: 10MB per file)</small>
                                </div>
                            </div>
                        </div>

                        {errors.photos && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {errors.photos}
                            </div>
                        )}

                        <div className="uploaded-files-list">
                            {handoverDocuments.map((file, index) => (
                                <div key={index} className="uploaded-file-item">
                                    <div className="file-info">
                                        <i className="fas fa-file"></i>
                                        <span className="file-name">{file.name.replace('handover_doc_', '')}</span>
                                        {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                                            <div className="upload-progress">
                                                <div 
                                                    className="progress-bar" 
                                                    style={{width: `${uploadProgress[file.name]}%`}}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={() => removeFile(file)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="action-section">
                    <div className="form-status">
                        {isFormValid ? (
                            <div className="status-ready">
                                <i className="fas fa-check-circle"></i>
                                <span>All required information is complete</span>
                            </div>
                        ) : (
                            <div className="status-pending">
                                <i className="fas fa-info-circle"></i>
                                <span>Please complete all required fields</span>
                            </div>
                        )}
                    </div>

                    <button
                        className={`create-entry-btn ${isFormValid ? 'active' : 'disabled'}`}
                        onClick={handleNewEntry}
                        disabled={!isFormValid}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Create New PMS Entry

                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinalizeHandover