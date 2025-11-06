import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


const summaryMap = {
    'Installation': 'Installation',
    'Preliminaries': 'Preliminaries',
    'Structural/Manufacturing': 'Structural-Manufacturing',
    'Manufacturing and Importation': 'Structural-Manufacturing',
    'Planning For Mobilization And Execution': 'Planning',
    'Testing and Commissioning (Passenger Elavator)': 'Test-and-Comm'
}

const TNCEntry = ({project, setSelectedEntry, onAssignClick}) => {

  
  const handleSelect = (project) => (e) => {
    // Don't trigger selection if clicking the assign button
    if (e.target.closest('.assign-btn')) return
    setSelectedEntry(project)
  }

  const handleAssignClick = (e) => {
    e.stopPropagation()
    onAssignClick(project)
  }

  // Check if project needs QAQC assignment
  const needsAssignment = project.tnc_assign_date ? true : false
  const isTNCPending = project.tnc_pending ? true : false

  const getTNCStatus = () => {
    if (project.tnc_ongoing) return 'tnc-ongoing'
    if (project.tnc_is_assigned) return 'tnc-assigned'
    if (project.tnc_assign_date) return 'tnc-pending'
    return 'none'
  }

  const tncStatus = getTNCStatus()
  console.log(tncStatus)
  console.log(isTNCPending)
  return (
    <div 
      className={`ProjectInfo ${tncStatus}`} 
      onClick={handleSelect(project)}
    >
      <div className="project-main">
        <div className="project-name">
          {project.lift_name}
          {needsAssignment && <span className="pending-badge"> ⚡</span>}
        </div>
        <div className="project-client">{project.client}</div>
        {(isTNCPending && !project.tnc_is_assigned) && (
          <button className="assign-btn" onClick={handleAssignClick}>
            Assign TNC
          </button>
        )}
      </div>
      
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
      
      <div className={`status-badge status-${summaryMap[project.status]}`}>
        {project.status}
      </div>
      
      <div className="current-task">
        {project.current_task || 'No active task'}
      </div>
      
      <div className="tnc-status">
        {tncStatus === 'tnc-assigned' ? 'Assigned' : 
         tncStatus === 'tnc-pending' ? 'Pending Assignment' : 
         tncStatus === 'tnc-ongoing' ? 'Ongoing' : 'Not Required'}
      </div>
      
      <div className="tnc-dates">
        {project.tnc_assign_date ? (
          <div>
            <div>Assigned: {new Date(project.tnc_assign_date).toLocaleDateString('en-GB')}</div>
            {project.tnc_inspection_date && (
              <div>Due: {new Date(project.tnc_inspection_date).toLocaleDateString('en-GB')}</div>
            )}
          </div>
        ) : project.tnc_inspection_date ? (
          <div>Due: {new Date(project.tnc_inspection_date).toLocaleDateString('en-GB')}</div>
        ) : (
          <div>-</div>
        )}
      </div>
    </div>
  )
}

export default TNCEntry