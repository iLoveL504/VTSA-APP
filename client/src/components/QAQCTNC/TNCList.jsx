import React, {useMemo, useEffect} from 'react'
import TNCEntry from './TNCEntry'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { useStoreState } from 'easy-peasy'
import { Grid } from 'ldrs/react'

const TNCList = ({searchTerm, setSelectedEntry, onAssignClick}) => {

  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const empId = sessionStorage.getItem('id')
  const role = sessionStorage.getItem('roles')
  const filter = {
    role
  }
  const {projects} = useStoreState(state => state)
  console.log(projects)
  const {data: designatedProject, isLoading: designatedIsLoading} = useAxiosFetch(`${backendURL}/api/employees/${empId}/designated-project`, filter)
    // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects
    
    const term = searchTerm.toLowerCase()
    return projects.filter(project => 
      project.lift_name?.toLowerCase().includes(term) ||
      project.client?.toLowerCase().includes(term) ||
      project.status?.toLowerCase().includes(term)
    )
  }, [projects, searchTerm])

useEffect(() => {
  console.log(filteredProjects)
}, [filteredProjects])



  // const [lowRole, setLowRole] = useState(true)
  // console.log(projects)
  // useEffect(() => {
  //   if (sessionStorage.getItem('roles') === 'manager' ||
  //     sessionStorage.getItem('roles') == 'Project Manager') {
  //       setLowRole(false)
  //     }
  // }, [])
//console.log(updateIsLoading)

    if (designatedIsLoading) {

        return (
                <div className="Loading">
                    <p>Data is Loading...</p>
                    <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
                </div>
        )
    }


  return (
    <div className='ProjectList'>  
        
        {
            sessionStorage.getItem('roles') === 'TNC Coordinator' ?
            (
               filteredProjects.map(p => (
                  <TNCEntry project={p} key={p.id} setSelectedEntry={setSelectedEntry} onAssignClick={onAssignClick}/>
                ))
            )
            :  (  
                designatedProject.map(p => (
                  <TNCEntry project={p} key={p.id} setSelectedEntry={setSelectedEntry} onAssignClick={onAssignClick}/>
                ))
            )
        }
    </div>
  )
}

export default TNCList