import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';

const summaryMap = {
    'Installation': 'Installation',
    'Preliminaries': 'Preliminaries',
    'Structural/Manufacturing': 'Structural-Manufacturing',
    'Manufacturing and Importation': 'Structural-Manufacturing',
    'Planning For Mobilization And Execution': 'Planning',
    'Testing and Commissioning (Passenger Elavator)': 'Test-and-Comm'
}

const Project = ({project}) => {
  const navigate = useNavigate()
  const clearProjectTasks = useStoreActions(actions => actions.clearProjectTasks)
  const clearProjectData = useStoreActions(actions => actions.clearProjectData)
  const handleClick = async () => {
    clearProjectData()
    clearProjectTasks()
    navigate(`/projects/${project.id}`)
  }
  
const projectStatus = () => {
  // console.log(project)
  // console.log(`project status: `, project.on_hold)
  return project.request_hold ? 'request-hold' :
    project.on_hold ? 'on-hold' : ''
}

console.log(projectStatus())

  return (
    <div className={`ProjectInfo ${projectStatus()}`} onClick={handleClick}>
      <div className='proj-name'>
        <div>{project.lift_name}</div>
        <div>{projectStatus()}</div>
      </div>
      
      <p>{project.client}</p>
      <p>{project.project_created_at === undefined ? '-' : new Date(project.created_at).toLocaleDateString("en-GB")}</p>
      <p>{project.project_end_date === null ? 'Date pending' : new Date(project.project_end_date).toLocaleDateString("en-GB")}</p>
      <div className="progress-section">
        <Box sx={{ width: '100%' }}>
          <div className="progress-text">{project.progress}%</div>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e9ecef',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: '#315a95'
              }
            }}
          />          
        </Box>
      </div>
      <p className={`status-badge status-${summaryMap[project.status]}`}>
        {project.status ? project.status : '-'}
      </p>
    </div>
  )
}

export default Project