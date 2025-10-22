import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom'

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
  const handleClick = async () => {
    navigate(`/projects/${project.id}`)
  }
  
  return (
    <div className='ProjectInfo' onClick={handleClick}>
      {project.lift_name}
      <p>{project.client}</p>
      <p>{new Date(project.created_at).toLocaleDateString("en-GB")}</p>
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
        {project.status}
      </p>
    </div>
  )
}

export default Project