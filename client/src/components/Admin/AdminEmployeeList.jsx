import AdminEmployee from './AdminEmployee'

const AdminEmployeeList = ({ employees, onEdit, onDelete }) => {
    return (
        <>  
            {employees.length === 0 ? (
                <div className="no-employees">No employees found</div>
            ) : (
                employees.map(employee => (
                    <AdminEmployee 
                        key={employee.employee_id}
                        employee={employee} 
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            )}
        </>
    )
}

export default AdminEmployeeList