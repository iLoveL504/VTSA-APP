import { useState } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useSharedSocket } from '../../Context/SocketContext'
import { Axios } from '../../api/axios'
import AdminEmployeeList from '../../components/Admin/AdminEmployeeList'
import EmployeeModal from '../../components/Admin/EmployeeModal'
import '../../css/AdminUsers.css'
import { Grid } from 'ldrs/react'

const Users = ({empIsLoading}) => {
    const { usersSocket } = useSharedSocket()
    const [showModal, setShowModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)
    const isLoading = false 
    
    const searchEmployee = useStoreState((state) => state.searchEmployee)
    const setSearchEmployee = useStoreActions((actions) => actions.setSearchEmployee)
    const employees = useStoreState((state) => state.employees)
    console.log(employees)

    const roles = [
        'Project Manager', 
        'Project Engineer', 
        'Foreman', 
        'Skilled Installer', 
        'Installer', 
        'QAQC Coordinator', 
        'QAQC', 
        'TNC Coordinator', 
        'TNC Technician', 
        'PMS Coordinator', 
        'PMS Technician'
    ]

    const handleCreateEmployee = () => {
        setEditingEmployee(null)
        setShowModal(true)
    }

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee)
        setShowModal(true)
    }

    const handleDeleteEmployee = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await Axios.delete(`/api/employees/${employeeId}`)
                usersSocket.emit("refresh_users")
            } catch (error) {
                console.error('Error deleting employee:', error)
                alert('Error deleting employee')
            }
        }
    }

    const handleSaveEmployee = async (employeeData) => {
        try {
            if (editingEmployee) {
                // Update existing employee
                await Axios.put(`/api/employees/${editingEmployee.employee_id}`, employeeData)
            } else {
                // Create new employee
                await Axios.post('/api/employees', employeeData)
            }
            setShowModal(false)
            usersSocket.emit("refresh_users")
        } catch (error) {
            console.error('Error saving employee:', error)
            alert('Error saving employee')
        }
    }

    // Filter employees based on search
    const filteredEmployees = employees.filter(employee => 
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        employee.job.toLowerCase().includes(searchEmployee.toLowerCase()) ||
        employee.username.toLowerCase().includes(searchEmployee.toLowerCase())
    ).filter(e => e.job !== 'manager')

    if(empIsLoading){
        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }
    
    return (
        <div className="Content Users">
            <div className="page-header">
                <h1>Employee Management</h1>
                <button className="btn-primary" onClick={handleCreateEmployee}>
                    + Add New Employee
                </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="search-section">
                    <label htmlFor="search">Search Employees</label>
                    <input 
                        type="text" 
                        id='searchEmployee' 
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        placeholder="Search by name, role, or username..."
                    />
                </div>
            </form>

            <div className="Labels admin-labels">
                <p>Full Name</p>
                <p>Username</p>
                <p>Role</p>
                <p>Hire Date</p>
                <p>Status</p>
                <p>Actions</p>
            </div>

            <div className="EmployeeList">
                {isLoading ? (
                    <div className="loading">Loading employees...</div>
                ) : (
                    <AdminEmployeeList 
                        employees={filteredEmployees}
                        onEdit={handleEditEmployee}
                        onDelete={handleDeleteEmployee}
                    />
                )}
            </div>

            {showModal && (
                <EmployeeModal
                    employee={editingEmployee}
                    roles={roles}
                    onSave={handleSaveEmployee}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default Users