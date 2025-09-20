import { useNavigate } from 'react-router-dom'

const Employee = ({employee}) => {
    const navigate = useNavigate()
    const id = employee.employee_id
    return (
        <div className="employee" onClick={() => {navigate(`/technician/${id}`)}}>
            <p>{`${employee.first_name} ${employee.last_name}`}</p>
            <p>{employee.job}</p>
            <div className={`Status ${!employee.is_active ? 'Inactive' : 'Active'}`}><p>{!employee.is_active ? 'Inactive' : 'Active'}</p></div>
        </div>      
    )
}

export default Employee