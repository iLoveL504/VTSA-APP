import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';

const ProjectCard = ({project}) => {
  const navigate = useNavigate()
  const clearProjectTasks = useStoreActions(actions => actions.clearProjectTasks)
  const clearProjectData = useStoreActions(actions => actions.clearProjectData)
  
  const handleClick = async () => {
    clearProjectData()
    clearProjectTasks()
    navigate(`/projects/${project.id}`)
  }

  const projectStatus = () => {
    if (project.request_hold) return 'request-hold'
    if (project.on_hold) return 'on-hold'
    if (project.is_behind) return 'behind'
    return ''
  }


  return (
    <div className={`ProjectCard ${projectStatus()}`} onClick={handleClick}>
      <div className="card-header">
        <h3 className="project-name">{project.lift_name}</h3>
        <div className="project-client">{project.client}</div>
      </div>
      
      <div className="card-content">
        <div className="card-meta">
          <div className="meta-item">
            <label>Location:</label>
            <span>{project.city_municipality || project.region}</span>
          </div>
          <div className="meta-item">
            <label>Project Engineer:</label>
            <span>{project.pe_fullname || project.project_engineer}</span>
          </div>
          <div className="meta-item">
            <label>Target End:</label>
            <span>{project.project_end_date ? new Date(project.project_end_date).toLocaleDateString("en-GB") : 'Pending'}</span>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-text">{project.progress}% Complete</span>
          </div>
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant="determinate" 
              value={project.progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#e9ecef',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: project.is_behind ? '#dc3545' : '#315a95'
                }
              }}
            />          
          </Box>
        </div>
      </div>
      
      <div className="card-footer">
        <span className={`status-badge status-${project.status?.replace(/[/\s]/g, '-') || 'default'}`}>
          {project.status || '-'}
        </span>
        {projectStatus() === 'behind' && (
          <span className="status-badge status-behind">Behind</span>
        )}
      </div>
    </div>
  )
}

export default ProjectCard