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

const QAQCEntry = ({project, setSelectedEntry, onAssignClick, manpower, qaqcTechs}) => {
  const handleSelect = (project) => (e) => {
    if (e.target.closest('.assign-btn')) return
    const findProjectM = manpower.find(m => m.project_id === project.id)
    console.log(qaqcTechs)
    const findQAQC = qaqcTechs.find(q => q.employee_id === findProjectM.qaqc_id)
    console.log(findQAQC)
    if (findQAQC) {
      project.qaqc = findQAQC
    } else project.qaqc = undefined
    console.log(project)
    setSelectedEntry(project)
  }

  const handleAssignClick = (e) => {
    e.stopPropagation()
    onAssignClick(project)
  }

  const getQAQCStatus = () => {
    if (project.qaqc_ongoing) return 'ongoing'
    if (project.qaqc_is_assigned) return 'assigned'
    if (project.qaqc_pending) return 'pending'
    return 'none'
  }

  const qaqcStatus = getQAQCStatus()

  return (
    <div 
      className={`ProjectInfo qaqc-${qaqcStatus}`} 
      onClick={handleSelect(project)}
    >
      {/* Column 1: Project Name & Client */}
      <div>
        <div className="project-name">{project.lift_name}</div>
        <div className="project-client">{project.client}</div>
        {qaqcStatus === 'pending' && (
          <button className="assign-btn" onClick={handleAssignClick}>
            Assign QAQC
          </button>
        )}
      </div>
      
      {/* Column 2: Progress */}
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
      
      {/* Column 3: Status Badge */}
      <div className={`status-badge status-${summaryMap[project.status]}`}>
        {project.status}
      </div>
      
      {/* Column 4: Current Task */}
      <div className="current-task">
        {project.current_task || 'No active task'}
      </div>

      {/* Column 4: Current Task */}
      <div className="current-task">
        {project.qaqc_inspection_reason || '-'}
      </div>
      
      {/* Column 5: QAQC Status */}
      <div className="qaqc-status">
        {qaqcStatus === 'assigned' ? 'Assigned' : 
         qaqcStatus === 'pending' ? 'Pending Assignment' : 
         qaqcStatus === 'ongoing' ? 'Ongoing' : '-'}
      </div>
      
      {/* Column 6: QAQC Dates */}
      <div className="qaqc-dates">
        {project.qaqc_inspection_date ? (
          <div>Due: {new Date(project.qaqc_inspection_date).toLocaleDateString('en-GB')}</div>
        ) : (
          <div>-</div>
        )}
      </div>
    </div>
  )
}

export default QAQCEntry