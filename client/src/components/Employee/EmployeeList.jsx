import Employee from './Employee'
import 'ldrs/react/Grid.css'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { useStoreActions } from 'easy-peasy'

const EmployeeList = () => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const {data: employees} = useAxiosFetch(`${backendURL}/api/employees`)
    const setEmployees = useStoreActions(actions => actions.setEmployees)
    setEmployees(employees)
    return (   
        <>  
               
            {
                employees.map(employee => (
                    <Employee employee={employee} key={employee.employee_id}/>
                ))
                
            }
        </>
    )
}

export default EmployeeList