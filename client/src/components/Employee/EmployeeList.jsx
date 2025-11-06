import Employee from './Employee'
import 'ldrs/react/Grid.css'

const EmployeeList = ({employees}) => {
    // const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    // const { data: employees } = useAxiosFetch(`${backendURL}/api/employees`)
    
    // const setEmployees = useStoreActions(actions => actions.setEmployees)

    // useEffect(() => {
    //     if (employees) {
    //         setEmployees(employees)
    //     }
    // }, [employees, setEmployees])  // ✅ only runs when data changes

    return (
        <>
            {employees && employees.map(employee => (
                <Employee employee={employee} key={employee.employee_id} />
            ))}
        </>
    )
}

export default EmployeeList
