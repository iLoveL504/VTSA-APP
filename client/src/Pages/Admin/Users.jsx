import { useState } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useSharedSocket } from '../../Context/SocketContext'
import { Axios } from '../../api/axios'
import AdminEmployeeList from '../../components/Admin/AdminEmployeeList'
import EmployeeModal from '../../components/Admin/EmployeeModal'
import EmployeeDetailsModal from '../../components/Admin/EmployeeDetailsModal'
import '../../css/AdminUsers.css'
import { Grid } from 'ldrs/react'
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Engineering as EngineeringIcon,
  SupervisorAccount as SupervisorIcon,
  Build as BuildIcon,
  Construction as ConstructionIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'

const Users = ({ empIsLoading }) => {
    const { usersSocket } = useSharedSocket()
    const [showModal, setShowModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(null)
    const [viewingEmployee, setViewingEmployee] = useState(null)
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedEmployees, setSelectedEmployees] = useState(new Set())
    
    const searchEmployee = useStoreState((state) => state.searchEmployee)
    const setSearchEmployee = useStoreActions((actions) => actions.setSearchEmployee)
    const employees = useStoreState((state) => state.employees)

    const roles = [
        'Project Manager', 
        'Project Engineer', 
        'Foreman', 
        'Skilled Installer', 
        'Installer', 
        'QAQC Coordinator', 
        'QA/QC', 
        'TNC Coordinator', 
        'TNC Technician', 
        'PMS Coordinator', 
        'PMS Technician',
        'Admin'
    ]

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'In House', label: 'In House' },
        { value: 'Contract Based', label: 'Contract Based' }
    ]

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'role', label: 'Role' },
        { value: 'hire_date', label: 'Hire Date' },
        { value: 'username', label: 'Username' }
    ]

    // Filter and sort employees
    const filteredEmployees = employees
        .filter(employee => {
            const matchesSearch = 
                `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                employee.job.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                employee.username.toLowerCase().includes(searchEmployee.toLowerCase())
            console.log(employees)
            const matchesRole = selectedRole === 'all' || employee.job === selectedRole
            const matchesStatus = selectedStatus === 'all' || 
                (selectedStatus === 'In House' && employee.in_house === 1) ||
                (selectedStatus === 'Contract Based' && employee.in_house === 0)

            return matchesSearch && matchesRole && matchesStatus && employee.job !== 'manager'
        })
        .sort((a, b) => {
            let aValue, bValue
            
            switch (sortBy) {
                case 'name':
                    aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
                    bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
                    break
                case 'role':
                    aValue = a.job.toLowerCase()
                    bValue = b.job.toLowerCase()
                    break
                case 'hire_date':
                    aValue = new Date(a.hire_date)
                    bValue = new Date(b.hire_date)
                    break
                case 'username':
                    aValue = a.username.toLowerCase()
                    bValue = b.username.toLowerCase()
                    break
                default:
                    aValue = a.first_name.toLowerCase()
                    bValue = b.first_name.toLowerCase()
            }
            
            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

    const handleCreateEmployee = () => {
        setEditingEmployee(null)
        setShowModal(true)
    }

    const handleViewEmployee = (employee) => {
        setViewingEmployee(employee)
        setShowDetailsModal(true)
    }

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee)
        setShowModal(true)
    }

    const handleDeleteEmployee = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            setIsLoading(true)
            try {
                await Axios.delete(`/api/employees/${employeeId}`)
                usersSocket.emit("refresh_users")
                // Show success message
                alert('Employee deleted successfully')
            } catch (error) {
                console.error('Error deleting employee:', error)
                alert('Error deleting employee: ' + (error.response?.data?.message || error.message))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleBulkDelete = async () => {
        if (selectedEmployees.size === 0) {
            alert('Please select employees to delete')
            return
        }

        if (window.confirm(`Are you sure you want to delete ${selectedEmployees.size} employees? This action cannot be undone.`)) {
            setIsLoading(true)
            try {
                const deletePromises = Array.from(selectedEmployees).map(id => 
                    Axios.delete(`/api/employees/${id}`)
                )
                await Promise.all(deletePromises)
                usersSocket.emit("refresh_users")
                setSelectedEmployees(new Set())
                alert(`${selectedEmployees.size} employees deleted successfully`)
            } catch (error) {
                console.error('Error deleting employees:', error)
                alert('Error deleting employees: ' + (error.response?.data?.message || error.message))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedEmployees.size === 0) {
            alert('Please select employees to update')
            return
        }

        if (window.confirm(`Are you sure you want to update ${selectedEmployees.size} employees to ${newStatus === 1 ? 'active' : 'inactive'} status?`)) {
            setIsLoading(true)
            try {
                const updatePromises = Array.from(selectedEmployees).map(id => 
                    Axios.put(`/api/employees/${id}`, { is_active: newStatus })
                )
                await Promise.all(updatePromises)
                usersSocket.emit("refresh_users")
                setSelectedEmployees(new Set())
                alert(`${selectedEmployees.size} employees updated successfully`)
            } catch (error) {
                console.error('Error updating employees:', error)
                alert('Error updating employees: ' + (error.response?.data?.message || error.message))
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleSaveEmployee = async (employeeData) => {
        setIsLoading(true)
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
            // Show success message
            alert(`Employee ${editingEmployee ? 'updated' : 'created'} successfully`)
        } catch (error) {
            console.error('Error saving employee:', error)
            alert('Error saving employee: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectEmployee = (employeeId) => {
        const newSelected = new Set(selectedEmployees)
        if (newSelected.has(employeeId)) {
            newSelected.delete(employeeId)
        } else {
            newSelected.add(employeeId)
        }
        setSelectedEmployees(newSelected)
    }

    const handleSelectAll = () => {
        if (selectedEmployees.size === filteredEmployees.length) {
            setSelectedEmployees(new Set())
        } else {
            setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.employee_id)))
        }
    }


const getRoleIcon = (role) => {
    switch (role) {
        case 'Project Engineer':
            return <EngineeringIcon className="role-icon" style={{ color: '#2563eb' }} /> // Blue
        case 'Foreman':
            return <SupervisorIcon className="role-icon" style={{ color: '#16a34a' }} /> // Green
        case 'Skilled Installer':
            return <BuildIcon className="role-icon" style={{ color: '#d97706' }} /> // Amber
        case 'Installer':
            return <ConstructionIcon className="role-icon" style={{ color: '#dc2626' }} /> // Red
        case 'Admin':
            return <AssignmentIcon className="role-icon" style={{ color: '#7c3aed' }} /> // Purple
        default:
            return <PersonIcon className="role-icon" style={{ color: '#6b7280' }} /> // Gray
    }
}

    const getStats = () => {
        const total = employees.filter(e => e.job !== 'manager').length
        const active = employees.filter(e => e.is_active === 1 && e.job !== 'manager').length
        const inactive = employees.filter(e => e.is_active === 0 && e.job !== 'manager').length
        
        const roleCounts = {}
        employees.forEach(emp => {
            if (emp.job !== 'manager') {
                roleCounts[emp.job] = (roleCounts[emp.job] || 0) + 1
            }
        })

        return { total, active, inactive, roleCounts }
    }

    const stats = getStats()

    if (empIsLoading) {
        return (
            <div className="Loading">
                <p>Data is Loading...</p>
                <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
            </div>
        )
    }

    return (
        <div className="Content Users">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-main">
                    <PersonIcon className="header-icon" />
                    <div>
                        <h1>Employee Management</h1>
                        <p>Manage your team members and their roles</p>
                    </div>
                </div>
                <button className="btn-primary" onClick={handleCreateEmployee}>
                    <AddIcon className="btn-icon" />
                    Add New Employee
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <PersonIcon className="stat-icon" />
                    <div className="stat-content">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Employees</span>
                    </div>
                </div>
                {/* <div className="stat-card active">
                    <PersonIcon className="stat-icon" />
                    <div className="stat-content">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Active Employees</span>
                    </div>
                </div>
                <div className="stat-card inactive">
                    <PersonIcon className="stat-icon" />
                    <div className="stat-content">
                        <span className="stat-number">{stats.inactive}</span>
                        <span className="stat-label">Inactive Employees</span>
                    </div>
                </div> */}
            </div>

            {/* Controls Section */}
            <div className="controls-section">
                {/* Search */}
                <div className="search-box">
                    <SearchIcon className="search-icon" />
                    <input 
                        type="text" 
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        placeholder="Search employees by name, role, or username..."
                        className="search-input"
                    />
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filter-group">
                        <label>Role</label>
                        <select 
                            value={selectedRole} 
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Roles</option>
                            {roles.filter(r => r !== 'Admin' && r !== 'Project Manager').map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status</label>
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className={`sort-order-btn ${sortOrder}`}
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedEmployees.size > 0 && (
                <div className="bulk-actions">
                    <div className="bulk-info">
                        <span>{selectedEmployees.size} employees selected</span>
                    </div>
                    <div className="bulk-buttons">
                        <button 
                            className="btn-secondary"
                            onClick={() => handleBulkStatusUpdate(1)}
                            disabled={isLoading}
                        >
                            Activate Selected
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={() => handleBulkStatusUpdate(0)}
                            disabled={isLoading}
                        >
                            Deactivate Selected
                        </button>
                        <button 
                            className="btn-delete"
                            onClick={handleBulkDelete}
                            disabled={isLoading}
                        >
                            <DeleteIcon className="btn-icon" />
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Employees Table */}
            <div className="employees-table-container">
                <div className="table-header">
                    <div className="table-row header-row">
                        <div className="table-cell checkbox-cell">
                            <input 
                                type="checkbox" 
                                checked={selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0}
                                onChange={handleSelectAll}
                            />
                        </div>
                        <div className="table-cell">Employee</div>
                        <div className="table-cell">Role</div>
                        <div className="table-cell">Username</div>
                        <div className="table-cell">Date Created</div>
                        {/* <div className="table-cell">Status</div> */}
                        <div className="table-cell">In House</div>
                        <div className="table-cell actions-cell">Actions</div>
                    </div>
                </div>

                <div className="table-body">
                    {isLoading ? (
                        <div className="loading-state">
                            <Grid size="40" speed="1.5" color="rgba(84, 176, 210, 1)" />
                            <span>Loading employees...</span>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="empty-state">
                            <PersonIcon className="empty-icon" />
                            <h3>No employees found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredEmployees.map(employee => (
                            <div key={employee.employee_id} className="table-row">
                                <div className="table-cell checkbox-cell">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedEmployees.has(employee.employee_id)}
                                        onChange={() => handleSelectEmployee(employee.employee_id)}
                                    />
                                </div>
                                <div className="table-cell employee-info">
                                    <div className="employee-avatar">
                                        {getRoleIcon(employee.job)}
                                    </div>
                                    <div className="employee-details">
                                        <span className="employee-name">
                                            {employee.first_name} {employee.last_name}
                                        </span>
                                        <span className="employee-id">ID: {employee.employee_id}</span>
                                    </div>
                                </div>
                                <div className="table-cell">
                                    <span className="role-badge">{employee.job}</span>
                                </div>
                                <div className="table-cell">
                                    <span className="username">@{employee.username}</span>
                                </div>
                                <div className="table-cell">
                                    {new Date(employee.hire_date).toLocaleDateString()}
                                </div>
                                {/* <div className="table-cell">
                                    <span className={`status-badge ${employee.is_active ? 'active' : 'inactive'}`}>
                                        {employee.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div> */}
                                <div className="table-cell">
                                    <span className={`in-house-badge ${employee.in_house ? 'in-house' : 'contract'}`}>
                                        {employee.in_house ? 'In House' : 'Contract'}
                                    </span>
                                </div>
                                <div className="table-cell actions-cell">
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-view"
                                            onClick={() => handleViewEmployee(employee)}
                                            title="View Details"
                                        >
                                            <ViewIcon />
                                        </button>
                                        <button 
                                            className="btn-edit"
                                            onClick={() => handleEditEmployee(employee)}
                                            title="Edit Employee"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button 
                                            className="btn-delete"
                                            onClick={() => handleDeleteEmployee(employee.employee_id)}
                                            disabled={isLoading}
                                            title="Delete Employee"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination would go here */}

            {/* Modals */}
            {showModal && (
                <EmployeeModal
                    employee={editingEmployee}
                    roles={roles}
                    onSave={handleSaveEmployee}
                    onClose={() => setShowModal(false)}
                    isLoading={isLoading}
                />
            )}

            {showDetailsModal && (
                <EmployeeDetailsModal
                    employee={viewingEmployee}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={() => {
                        setShowDetailsModal(false)
                        handleEditEmployee(viewingEmployee)
                    }}
                />
            )}
        </div>
    )
}

export default Users