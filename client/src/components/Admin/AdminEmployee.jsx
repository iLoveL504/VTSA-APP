const AdminEmployee = ({ employee, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="employee admin-employee">
            <p>{`${employee.first_name} ${employee.last_name}`}</p>
            <p>{employee.username}</p>
            <p>{employee.job}</p>
            <p>{formatDate(employee.hire_date)}</p>
            <div className={`Status ${!employee.is_active ? 'Inactive' : 'Active'}`}>
                <p>{!employee.is_active ? 'Available' : 'In Project'}</p>
            </div>
            <div className="actions">
                <button 
                    className="btn-edit"
                    onClick={() => onEdit(employee)}
                >
                    Edit
                </button>
                <button 
                    className="btn-delete"
                    onClick={() => onDelete(employee.employee_id)}
                >
                    Delete
                </button>
            </div>
        </div>      
    )
}

export default AdminEmployee