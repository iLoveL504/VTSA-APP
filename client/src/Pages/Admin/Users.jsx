import { useState, useMemo, useCallback } from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useSharedSocket } from '../../Context/SocketContext'
import { Axios } from '../../api/axios'
import EmployeeModal from '../../components/Admin/EmployeeModal'
import EmployeeDetailsModal from '../../components/Admin/EmployeeDetailsModal'
import '../../css/AdminUsers.css'
import { Grid } from 'ldrs/react'
import {
  Search as SearchIcon,
  Add as AddIcon,
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

    // Memoize all constants and options
    const roles = useMemo(() => [
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
    ], [])

    const filteredRoleOptions = useMemo(() => 
        roles.filter(r => r !== 'Admin' && r !== 'Project Manager'),
    [roles])

    const roleSelectOptions = useMemo(() => 
        filteredRoleOptions.map(role => 
            <option key={role} value={role}>{role}</option>
        ),
    [filteredRoleOptions])

    const statusOptions = useMemo(() => [
        { value: 'all', label: 'All Status' },
        { value: 'In House', label: 'In House' },
        { value: 'Contract Based', label: 'Contract Based' }
    ], [])

    const statusSelectOptions = useMemo(() => 
        statusOptions.map(option => 
            <option key={option.value} value={option.value}>{option.label}</option>
        ),
    [statusOptions])

    const sortOptions = useMemo(() => [
        { value: 'name', label: 'Name' },
        { value: 'role', label: 'Role' },
        { value: 'hire_date', label: 'Hire Date' },
        { value: 'username', label: 'Username' }
    ], [])

    const sortSelectOptions = useMemo(() => 
        sortOptions.map(option => 
            <option key={option.value} value={option.value}>{option.label}</option>
        ),
    [sortOptions])

    // Memoize expensive calculations
    const stats = useMemo(() => {
        const filtered = employees.filter(e => 
            e.job !== 'manager' && 
            e.job !== 'Operations Manager' && 
            e.job !== 'Project Manager'
        )
        const total = filtered.length
        const active = filtered.filter(e => e.is_active === 1).length
        const inactive = filtered.filter(e => e.is_active === 0).length
        
        const roleCounts = {}
        filtered.forEach(emp => {
            roleCounts[emp.job] = (roleCounts[emp.job] || 0) + 1
        })

        return { total, active, inactive, roleCounts }
    }, [employees])

    // Memoize filtered employees - THE KEY OPTIMIZATION
    const filteredEmployees = useMemo(() => {
        if (!employees.length) return []

        const searchTerm = searchEmployee.toLowerCase()
        
        return employees
            .filter(employee => {
                // Early returns for better performance
                if (employee.job === 'Operations Manager' || employee.job === 'Project Manager') {
                    return false
                }

                if (selectedRole !== 'all' && employee.job !== selectedRole) {
                    return false
                }

                if (selectedStatus !== 'all') {
                    const isInHouse = employee.in_house === 1
                    if ((selectedStatus === 'In House' && !isInHouse) || 
                        (selectedStatus === 'Contract Based' && isInHouse)) {
                        return false
                    }
                }

                // Only do expensive search if searchTerm exists
                if (searchTerm) {
                    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase()
                    const job = employee.job.toLowerCase()
                    const username = employee.username.toLowerCase()
                    
                    if (!fullName.includes(searchTerm) && 
                        !job.includes(searchTerm) && 
                        !username.includes(searchTerm)) {
                        return false
                    }
                }

                return true
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
                        return 0
                }
                
                if (sortOrder === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
                }
            })
    }, [employees, searchEmployee, selectedRole, selectedStatus, sortBy, sortOrder])

    // Optimize all handlers with useCallback
    const handleCreateEmployee = useCallback(() => {
        setEditingEmployee(null)
        setShowModal(true)
    }, [])

    const handleViewEmployee = useCallback((employee) => {
        setViewingEmployee(employee)
        setShowDetailsModal(true)
    }, [])

    const handleEditEmployee = useCallback((employee) => {
        setEditingEmployee(employee)
        setShowModal(true)
    }, [])

    const handleDeleteEmployee = useCallback(async (employeeId, job) => {
        if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            setIsLoading(true)
            try {
                await Axios.delete(`/api/employees/${employeeId}?job=${encodeURIComponent(job)}`)
                usersSocket.emit("refresh_users")
            } catch (error) {
                console.error('Error deleting employee:', error)
                alert('Error deleting employee: ' + (error.response?.data?.message || error.message))
            } finally {
                setIsLoading(false)
            }
        }
    }, [usersSocket])

    const handleBulkDelete = useCallback(async () => {
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
    }, [selectedEmployees, usersSocket])

    const handleBulkStatusUpdate = useCallback(async (newStatus) => {
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
    }, [selectedEmployees, usersSocket])

    const handleSaveEmployee = useCallback(async (employeeData) => {
        setIsLoading(true)
        try {
            if (editingEmployee) {
                await Axios.put(`/api/employees/${editingEmployee.employee_id}`, employeeData)
            } else {
                await Axios.post('/api/employees', employeeData)
            }
            setShowModal(false)
            usersSocket.emit("refresh_users")
            alert(`Employee ${editingEmployee ? 'updated' : 'created'} successfully`)
        } catch (error) {
            console.error('Error saving employee:', error)
            alert('Error saving employee: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsLoading(false)
        }
    }, [editingEmployee, usersSocket])

    const handleSelectEmployee = useCallback((employeeId) => {
        setSelectedEmployees(prev => {
            const newSelected = new Set(prev)
            if (newSelected.has(employeeId)) {
                newSelected.delete(employeeId)
            } else {
                newSelected.add(employeeId)
            }
            return newSelected
        })
    }, [])

    const handleSelectAll = useCallback(() => {
        setSelectedEmployees(prev => 
            prev.size === filteredEmployees.length && filteredEmployees.length > 0 
                ? new Set() 
                : new Set(filteredEmployees.map(emp => emp.employee_id))
        )
    }, [filteredEmployees])

    const handleCloseModal = useCallback(() => {
        setShowModal(false)
        setEditingEmployee(null)
    }, [])

    const handleCloseDetailsModal = useCallback(() => {
        setShowDetailsModal(false)
        setViewingEmployee(null)
    }, [])

    const handleEditFromDetails = useCallback(() => {
        setShowDetailsModal(false)
        handleEditEmployee(viewingEmployee)
    }, [viewingEmployee, handleEditEmployee])

    const getRoleIcon = useCallback((role) => {
        switch (role) {
            case 'Project Engineer':
                return <EngineeringIcon className="role-icon" style={{ color: '#2563eb' }} />
            case 'Foreman':
                return <SupervisorIcon className="role-icon" style={{ color: '#16a34a' }} />
            case 'Skilled Installer':
                return <BuildIcon className="role-icon" style={{ color: '#d97706' }} />
            case 'Installer':
                return <ConstructionIcon className="role-icon" style={{ color: '#dc2626' }} />
            case 'Admin':
                return <AssignmentIcon className="role-icon" style={{ color: '#7c3aed' }} />
            default:
                return <PersonIcon className="role-icon" style={{ color: '#6b7280' }} />
        }
    }, [])

    // Memoize table rows to prevent re-renders
    const employeeRows = useMemo(() => 
        filteredEmployees.map(employee => (
            <div key={employee.employee_id} className="table-row">
                <div className="table-cell checkbox-cell">
                    <input 
                        type="checkbox" 
                        checked={selectedEmployees.has(employee.employee_id)}
                        onChange={() => handleSelectEmployee(employee.employee_id)}
                        disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            <ViewIcon />
                        </button>
                        <button 
                            className="btn-edit"
                            onClick={() => handleEditEmployee(employee)}
                            title="Edit Employee"
                            disabled={isLoading}
                        >
                            <EditIcon />
                        </button>
                        <button 
                            className="btn-delete"
                            onClick={() => handleDeleteEmployee(employee.employee_id, employee.job)}
                            disabled={isLoading}
                            title="Delete Employee"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>
        )),
    [filteredEmployees, selectedEmployees, isLoading, handleSelectEmployee, getRoleIcon, handleViewEmployee, handleEditEmployee, handleDeleteEmployee])

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
                <button 
                    className="btn-primary" 
                    onClick={handleCreateEmployee}
                    disabled={isLoading}
                >
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
                        disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            <option value="all">All Roles</option>
                            {roleSelectOptions}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status</label>
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                            disabled={isLoading}
                        >
                            {statusSelectOptions}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                            disabled={isLoading}
                        >
                            {sortSelectOptions}
                        </select>
                    </div>

                    <button 
                        className={`sort-order-btn ${sortOrder}`}
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        disabled={isLoading}
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
                                disabled={isLoading || filteredEmployees.length === 0}
                            />
                        </div>
                        <div className="table-cell">Employee</div>
                        <div className="table-cell">Role</div>
                        <div className="table-cell">Username</div>
                        <div className="table-cell">Date Created</div>
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
                        employeeRows
                    )}
                </div>
            </div>

            {/* Modals */}
            {showModal && (
                <EmployeeModal
                    employee={editingEmployee}
                    roles={roles}
                    onSave={handleSaveEmployee}
                    onClose={handleCloseModal}
                    isLoading={isLoading}
                />
            )}

            {showDetailsModal && (
                <EmployeeDetailsModal
                    employee={viewingEmployee}
                    onClose={handleCloseDetailsModal}
                    onEdit={handleEditFromDetails}
                />
            )}
        </div>
    )
}

export default Users