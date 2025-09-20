import React from 'react'
import { Outlet, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import ProjectList from '../../components/Project/ProjectList'

const Projects = () => {
  const navigate = useNavigate()

  const handleCreateClick = () => {
    navigate('create')
  }
  const projects = useStoreState(state => state.projects)
  return (
    <div className='Content ProjectMenu'>
      <div>
          <button onClick={handleCreateClick} style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}>Add New Project</button>
      </div>

      <div className="project-table-header">
        <div className="table-row header-row">
          <div className="table-cell">Project Name</div>
          <div className="table-cell">Created Date</div>
          <div className="table-cell">Progress</div>
          <div className="table-cell">Status</div>
        </div>
      </div>

      <div>
          <ProjectList projects={projects}/>
      </div>
    </div>
  )
}

export default Projects