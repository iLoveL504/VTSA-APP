// components/Admin/EmployeeDetailsModal.jsx
import { Person, Engineering, SupervisorAccount, Build, Construction, Assignment, CalendarToday, Business, LocationOn } from '@mui/icons-material'

const EmployeeDetailsModal = ({ employee, onClose, onEdit }) => {
    const getRoleIcon = (role) => {
        switch (role) {
            case 'Project Engineer':
                return <Engineering className="role-icon" sx={{ color: "#ffffffff" }} />

            case 'Foreman':
                return <SupervisorAccount className="role-icon" sx={{ color: "#ffffffff" }} />
            case 'Skilled Installer':
                return <Build className="role-icon" sx={{ color: "#ffffffff" }} />
            case 'Installer':
                return <Construction className="role-icon" sx={{ color: "#ffffffff" }} />
            case 'Admin':
                return <Assignment className="role-icon" sx={{ color: "#ffffffff" }} />
            default:
                return <Person className="role-icon" sx={{ color: "#ffffffff" }} />
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <div className="modal-header">
                    <h2>Employee Details</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="employee-details-content">
                    <div className="employee-header">
                        <div className="employee-avatar large">
                            {getRoleIcon(employee.job)}
                        </div>
                        <div className="employee-info">
                            <h3>{employee.first_name} {employee.last_name}</h3>
                            <p className="employee-role">{employee.job}</p>
                            <p className="employee-username">@{employee.username}</p>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Employee ID</label>
                            <span>#{employee.employee_id}</span>
                        </div>
                        <div className="detail-item">
                            <label>Employment Type</label>
                            <span className={`employment-type ${employee.in_house ? 'in-house' : 'contract'}`}>
                                {employee.in_house ? 'In House' : 'Contract Based'}
                            </span>
                        </div>
                        <div className="detail-item">
                            <label>Hire Date</label>
                            <span>{new Date(employee.hire_date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                            <label>Island Group</label>
                            <span>{employee.island_group || 'Not specified'}</span>
                        </div>
                    </div>

                    {employee.refresh_token && (
                        <div className="token-info">
                            <label>Last Active</label>
                            <span>Has active session</span>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button type="button" className="btn-primary" onClick={onEdit}>
                        Edit Employee
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetailsModal