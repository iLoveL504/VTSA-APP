import React from 'react'
import Project from './Project'
import ProjectCard from './ProjectCard'
import { Grid } from 'ldrs/react'

const ProjectList = ({ 
  projects, // Receive filtered projects from parent
  viewMode,
  isLoading 
}) => {
  
  if (isLoading) {
    return (
      <div className="Loading">
        <p>Data is Loading...</p>
        <Grid size="60" speed="1.5" color="rgba(84, 176, 210, 1)" />
      </div>
    )
  }

  return (
    <div className={`ProjectList ${viewMode}`}>  
      {viewMode === 'list' ? (
        // List View
        projects.map(p => (
          <Project project={p} key={p.id} viewMode={viewMode}/>
        ))
      ) : (
        // Grid View
        <div className="projects-grid">
          {projects.map(p => (
            <ProjectCard project={p} key={p.id}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectList