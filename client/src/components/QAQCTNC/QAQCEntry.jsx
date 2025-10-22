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

const QAQCEntry = ({project, setSelectedEntry, onAssignClick}) => {

  
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
  const needsAssignment = project.qaqc_inspection_date ? true : false
  const isQAQCPending = needsAssignment

  const getQAQCStatus = () => {
    if (project.qaqc_ongoing) return 'ongoing'
    if (project.qaqc_is_assigned) return 'assigned'
    if (project.qaqc_inspection_date) return 'pending'
    return 'none'
  }

  const qaqcStatus = getQAQCStatus()

  return (
    <div 
      className={`ProjectInfo ${isQAQCPending ? 'qaqc-pending' : ''}`} 
      onClick={handleSelect(project)}
    >
      <div className="project-main">
        <div className="project-name">
          {project.lift_name}
          {needsAssignment && <span className="pending-badge"> ⚡</span>}
        </div>
        <div className="project-client">{project.client}</div>
        {needsAssignment && (
          <button className="assign-btn" onClick={handleAssignClick}>
            Assign QAQC
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
      
      <div className="qaqc-status">
        {qaqcStatus === 'assigned' ? 'Assigned' : 
         qaqcStatus === 'pending' ? 'Pending Assignment' : 
         qaqcStatus === 'ongoing' ? 'Ongoing' : 'Not Required'}
      </div>
      
      <div className="qaqc-dates">
        {project.qaqc_assign_date ? (
          <div>
            <div>Assigned: {new Date(project.qaqc_assign_date).toLocaleDateString('en-GB')}</div>
            {project.qaqc_inspection_date && (
              <div>Due: {new Date(project.qaqc_inspection_date).toLocaleDateString('en-GB')}</div>
            )}
          </div>
        ) : project.qaqc_inspection_date ? (
          <div>Due: {new Date(project.qaqc_inspection_date).toLocaleDateString('en-GB')}</div>
        ) : (
          <div>-</div>
        )}
      </div>
    </div>
  )
}

export default QAQCEntry