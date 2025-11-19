import { IconGitBranchDeleted } from '@tabler/icons-react'
import { useState, useEffect } from 'react'

const EmployeeModal = ({ employee, roles, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        first_name: '',
        last_name: '',
        job: '',
        branch: '',
        is_active: 1,
        in_house: '',
        island_group: ''
    })
    console.log(formData)

    const branches = ['Baguio', 'Pampanga', 'Cebu', 'Davao', 'Pasig']
    const branchesMap = {
        Baguio: 'Luzon',
        Pampanga: 'Luzon',
        Cebu: 'Visayas',
        Davao: 'Mindanao',
        Pasig: 'Luzon'
        
    }
    console.log(formData.branch)
     console.log('Island is: ',branchesMap[formData.branch])
    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username || '',
                password: '', // Don't pre-fill password for security
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                job: employee.job || '',
                is_active: employee.is_active || 1,
                in_house: employee.in_house || 1,
                branch: employee.branch || 'Luzon',
                island_group: employee.island_group || 'Luzon'
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
        console.log(name)
        console.log(value)
        console.log(formData)
        setFormData(prev => {
            if (name === 'branch') {
                return {
                ...prev,
                branch: value,
                island_group: branchesMap[value]
                }
            } else {
                return {
                ...prev,
                [name]: value,
                }                
            }

        })
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
                            <label>First Name </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name </label>
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
                            <label>Username </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password {!employee && ''}</label>
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
                            <label>Branch </label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select branch</option>
                                {branches.map(islands => (
                                    <option key={islands} value={islands}>{islands}</option>
                                ))}
                            </select>
                        </div>                        
                        <div className="form-group">
                            <label>Island </label>
                            <label>{formData.island_group}</label>
                        </div>                        
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Role </label>
                            <select
                                name="job"
                                value={formData.job}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a role</option>
                                {roles.filter(r => r !== 'Admin' && r !== 'Project Manager').map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Contract </label>
                            <select
                                name="in_house"
                                value={formData.in_house}
                                onChange={handleChange}
                                required
                            >
                                <option value={1}>In house</option>
                                <option value={0}>Contract Based</option>
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