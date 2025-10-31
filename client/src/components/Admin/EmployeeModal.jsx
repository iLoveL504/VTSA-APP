import { useState, useEffect } from 'react'

const EmployeeModal = ({ employee, roles, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        job: '',
        is_active: 1
    })

    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username || '',
                password: '', // Don't pre-fill password for security
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                job: employee.job || '',
                hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : new Date().toISOString().split('T')[0],
                is_active: employee.is_active || 1
            })
        }
    }, [employee])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        onSave(formData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password {!employee && '*'}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!employee}
                                placeholder={employee ? "Leave blank to keep current" : ""}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Role *</label>
                            <select
                                name="job"
                                value={formData.job}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {employee ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmployeeModal