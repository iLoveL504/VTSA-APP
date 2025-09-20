import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom'

const Project = ({project}) => {
  const navigate = useNavigate()
  const handleClick = async () => {
    navigate(`/projects/${project.id}`)
  }
  return (
    <div className='ProjectInfo' onClick={handleClick}>
      {project.lift_name}
      <p>{new Date(project.created_at).toLocaleDateString("en-GB")}</p>
        <Box sx={{ width: '100%' }}>
          <p>{project.progress}%</p>
          <LinearProgress variant="determinate" value={project.progress} />          
        </Box>
      <p className={`status-${project.status === 'active' ? 'active' : 
        project.status === 'inactive' ? 'inactive' : 'manufacturing'
      }`}>{project.status}</p>
    </div>

  )
}

export default Project