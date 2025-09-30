import React, { useEffect, useState } from 'react'
import Project from './Project'
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { Grid } from 'ldrs/react'

const ProjectList = ({updateIsLoading}) => {

  const backendURL = import.meta.env.VITE_BACKENDURL || 'http://localhost:4000'
  const empId = sessionStorage.getItem('id')
  const {data: projects, isLoading: projectsIsLoading} = useAxiosFetch(`${backendURL}/projects`)
  const {data: designatedProject, isLoading: designatedIsLoading} = useAxiosFetch(`${backendURL}/employees/${empId}/designated-project`)
  const [lowRole, setLowRole] = useState(true)
  console.log(lowRole)
  useEffect(() => {
    if (sessionStorage.getItem('roles') === 'manager' ||
      sessionStorage.getItem('roles') == 'Project Manager') {
        setLowRole(false)
      }
  }, [])

  console.log(updateIsLoading)
  console.log(designatedIsLoading)
  console.log(projectsIsLoading)

    if (designatedIsLoading || projectsIsLoading || updateIsLoading) {
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
            sessionStorage.getItem('roles') === 'manager' ||
            sessionStorage.getItem('roles') === 'Project Manager'  ?
            (
               projects.map(p => (
                  <Project project={p} key={p.id}/>
                ))
            )
            :  (  
                designatedProject.map(p => (
                  <Project project={p} key={p.id}/>
                ))
            )
        }
    </div>
  )
}

export default ProjectList