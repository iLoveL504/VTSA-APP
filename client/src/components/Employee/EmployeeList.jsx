import Employee from './Employee'
import 'ldrs/react/Grid.css'

const EmployeeList = ({ employees }) => {
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