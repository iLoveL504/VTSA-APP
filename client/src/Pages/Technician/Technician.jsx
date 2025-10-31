    import { useEffect } from 'react'
    import 'ldrs/react/Grid.css'
    import { useStoreState, useStoreActions } from 'easy-peasy'
    import '../../css/Users.css'
    // Default values shown

    import {Axios} from '../../api/axios'
    import EmployeeList from '../../components/Employee/EmployeeList'

    const Technician = () => {
        // const [ searchEmployee, setSearchEmployee ] = useState('')
        // const [ searchResults, setSearchResults ] = useState([])
        // const [ employees, setEmployees ] = useState([])
        // const [ isLoading, setIsLoading ] = useState(true)
        const searchEmployee = useStoreState((state) => state.searchEmployee)
        const setSearchEmployee = useStoreActions((actions) => actions.setSearchEmployee)
        const searchResults = useStoreState((state) => state.searchResults)
        const setSearchResults = useStoreActions((actions) => actions.setSearchResults)
        const employees = useStoreState((state) => state.employees)
        console.log(employees)

        const sortedSearch = useStoreState((state) => state.sortResults)
        useEffect(() => {
            setSearchResults(employees)
        }, [employees, setSearchResults])

        useEffect(() => {
            setSearchResults(sortedSearch)
        }, [searchEmployee, setSearchResults, sortedSearch])

        
        return (
            <div className="Content TechnicianMenu">
                <form action="">
                    <label htmlFor="search">Search employee</label>
                    <input 
                        type="text" 
                        id='searchEmployee' 
                        value={searchEmployee}
                        onChange={(e) => {setSearchEmployee(e.target.value); console.log(e.target.value)}}
                        
                        />
                    <button className="Filter">Filter Search</button>
                </form>
                <div className="Labels">
                    <p>Full Name</p>
                    <p>Role</p>
                    <p>Status</p>
                </div>
                <div className="EmployeeList">
                    <EmployeeList employees={searchResults}/>
                </div>
            </div>
        )
    }

    export default Technician