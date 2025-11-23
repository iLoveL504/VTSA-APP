import { useState, useEffect, useMemo, useCallback } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Move outside component
const BRANCHES = ['Baguio', 'Pampanga', 'Cebu', 'Davao', 'Pasig']
const BRANCHES_MAP = {
    Baguio: 'Luzon',
    Pampanga: 'Luzon',
    Cebu: 'Visayas',
    Davao: 'Mindanao',
    Pasig: 'Luzon'
}

const generatePassword = () => {
    // Simplified password generation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
}

const EmployeeModal = ({ employee, roles, onSave, onClose, isLoading }) => {
    const [validEmail, setValidEmail] = useState(true)
    const [generatedPassword, setGeneratedPassword] = useState('')
    const [formData, setFormData] = useState({
        username: '', password: '', first_name: '', last_name: '', job: '',
        branch: '', is_active: 1, in_house: 1, island_group: '', 
        phone_number: '', email: ''
    })

    // Memoize all options
    const branchOptions = useMemo(() => 
        BRANCHES.map(b => <option key={b} value={b}>{b}</option>), [])

    const roleOptions = useMemo(() => 
        roles
            .filter(r => r !== 'Admin' && r !== 'Project Manager')
            .map(r => <option key={r} value={r}>{r}</option>), 
        [roles]
    )

    // Initialize form data
    useEffect(() => {
        if (employee) {
            setFormData({
                username: employee.username || '',
                password: '',
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                job: employee.job || '',
                is_active: employee.is_active ?? 1,
                in_house: employee.in_house ?? 1,
                branch: employee.branch || '',
                island_group: employee.island_group || '',
                phone_number: employee.phone_number || '',
                email: employee.email || ''
            })
        } else {
            const newPassword = generatePassword()
            setGeneratedPassword(newPassword)
            setFormData(prev => ({ ...prev, password: newPassword }))
        }
    }, [employee])

    // Optimize handlers
    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        if (!validEmail) {
            window.alert('Invalid Email')
            return
        }
        onSave(formData)
    }, [validEmail, onSave, formData])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target

        if (name === 'email') {
            setValidEmail(emailRegex.test(value))
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'branch' && { island_group: BRANCHES_MAP[value] || '' })
        }))
    }, [])

    const handleRegeneratePassword = useCallback(() => {
        const newPassword = generatePassword()
        setGeneratedPassword(newPassword)
        setFormData(prev => ({ ...prev, password: newPassword }))
    }, [])

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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            {!validEmail && <span className="error-text">Email is not valid</span>}
                        </div>
                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {!employee && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Generated Password</label>
                                <div className="password-display">
                                    <input
                                        type="text"
                                        value={generatedPassword}
                                        readOnly
                                        className="password-field"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleRegeneratePassword}
                                        className="regenerate-btn"
                                        disabled={isLoading}
                                    >
                                        Regenerate
                                    </button>
                                </div>
                                <small className="password-note">
                                    This password will be automatically sent to the employee's email
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    placeholder="123-456-7890"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Similar optimizations for other form sections */}
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Branch *</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select branch</option>
                                {branchOptions}
                            </select>
                        </div>                        
                        <div className="form-group">
                            <label>Island</label>
                            <input
                                type="text"
                                name="island_group"
                                value={formData.island_group}
                                onChange={handleChange}
                                disabled
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
                                disabled={isLoading}
                            >
                                <option value="">Select a role</option>
                                {roleOptions} {/* ← Now using memoized options */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Contract *</label>
                            <select
                                name="in_house"
                                value={formData.in_house}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                <option value={1}>In house</option>
                                <option value={0}>Contract Based</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {employee ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmployeeModal