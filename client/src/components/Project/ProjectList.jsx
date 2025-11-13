import React, {useMemo, useEffect} from 'react'
import Project from './Project'
import ProjectCard from './ProjectCard'
import { useStoreState } from 'easy-peasy'

import { Grid } from 'ldrs/react'

const ProjectList = ({onHold, searchTerm, statusFilter, viewMode}) => {
  const role = sessionStorage.getItem('roles')

  const {projects, designatedProjects, designatedIsLoading} = useStoreState(state => state)



  // Filter projects based on various criteria
  const filteredProjects = useMemo(() => {
    let filtered = sessionStorage.getItem('roles') === 'Project Manager' ? projects : designatedProjects
    
    if (role === 'manager' || role === 'Project Manager' || role === 'TNC Coordinator' || role === 'QAQC Coordinator') {
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(project => 
          project.lift_name?.toLowerCase().includes(term) ||
          project.client?.toLowerCase().includes(term) ||
          project.region?.toLowerCase().includes(term)
        )
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(project => project.status === statusFilter)
      }
      
      // Apply hold filter
      if (onHold === 'on-hold') {
        filtered = filtered.filter(project => project.on_hold)
      } else if (onHold === 'request-hold') {
        filtered = filtered.filter(project => project.request_hold)
      } else if (onHold === 'active') {
        filtered = filtered.filter(project => !project.on_hold && !project.request_hold)
      }
    } else {
      console.log(designatedProjects)
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(designatedProjects => 
          designatedProjects.lift_name?.toLowerCase().includes(term) ||
          designatedProjects.client?.toLowerCase().includes(term) ||
          designatedProjects.region?.toLowerCase().includes(term)
        )
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(designatedProjects => designatedProjects.status === statusFilter)
      }
      
      // Apply hold filter
      if (onHold === 'on-hold') {
        filtered = filtered.filter(designatedProjects => designatedProjects.on_hold)
      } else if (onHold === 'request-hold') {
        filtered = filtered.filter(designatedProjects => designatedProjects.request_hold)
      } else if (onHold === 'active') {
        filtered = filtered.filter(designatedProjects => !designatedProjects.on_hold && !designatedProjects.request_hold)
      }
      //filtered = designatedProject
    }
    
    return filtered
  }, [projects, designatedProjects, searchTerm, statusFilter, onHold, role])

  useEffect(() => {
    console.log('Filtered Projects:', filteredProjects)
  }, [filteredProjects])
  console.log('designated is loading: ', designatedIsLoading)
  if (designatedIsLoading) {
    return (
      <div className="Loading">
        <p>Data is Loading...</p>
        <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
      </div>
    )
  }

  return (
    <div className={`ProjectList ${viewMode}`}>  
        <>
          {viewMode === 'list' ? (
            // List View
            filteredProjects.map(p => (
              <Project project={p} key={p.id} viewMode={viewMode}/>
            ))
          ) : (
            // Grid View
            <div className="projects-grid">
              {filteredProjects.map(p => (
                <ProjectCard project={p} key={p.id}/>
              ))}
            </div>
          )}
        </> 

    </div>
  )
}

export default ProjectList