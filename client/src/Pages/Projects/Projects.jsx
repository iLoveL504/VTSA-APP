import React, { useState, useMemo } from 'react'
import { Outlet, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import ProjectList from '../../components/Project/ProjectList'
import '../../css/Projects.css'
import { useEffect } from 'react';

const Projects = ({updateIsLoading}) => {
  const navigate = useNavigate()
  const projects = useStoreState(state => state.projects)
  const [searchTerm, setSearchTerm] = useState('')
  const [onHold, setOnHold] = useState(false)
  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects
    
    const term = searchTerm.toLowerCase()
    return projects.filter(project => 
      project.lift_name?.toLowerCase().includes(term) ||
      project.client?.toLowerCase().includes(term) ||
      project.status?.toLowerCase().includes(term)
    )
  }, [projects, searchTerm])

useEffect(() => {
  console.log(filteredProjects)
}, [filteredProjects])

  const handleCreateClick = () => {
    navigate('create')
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleToggleHold = () => {
    setOnHold(prev => {
      return !prev
    })
    console.log(onHold)
  }

  return (
    <div className='Content ProjectMenu'>
      {/* Header with Create Button and Search */}
      <div className="projects-header">
        <div className="header-left">
          <h1>Projects</h1>
          <span className="projects-count">
            {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
        {
          sessionStorage.getItem('roles') === 'Project Manager' && (
            <div>
              <button onClick={handleToggleHold}>
                {onHold ? 'All Projects' : 'Projects on Hold'}
              </button>
            </div>            
          )
        }

        <div className="header-right">
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search projects by name, client, or status..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Create Project Button */}
          <button 
            onClick={handleCreateClick} 
            className="create-project-btn"
            style={{display: sessionStorage.getItem('roles') === 'Project Manager' ? 'block' : 'none'}}
          >
            + Add New Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="project-table-header">
        <div className="table-row header-row">
          <div className="table-cell">Project Name</div>
          <div className="table-cell">Client</div>
          <div className="table-cell">Created Date</div>
          <div className="table-cell">Target End Date</div>
          <div className="table-cell">Progress</div>
          <div className="table-cell">Status</div>
        </div>
      </div>

      {/* Project List */}
      <div>
        <ProjectList onHold={onHold} searchTerm={searchTerm} updateIsLoading={updateIsLoading}/>
      </div>

      {/* No Results Message */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="no-results">
          <p>No projects found matching "{searchTerm}"</p>
          <button onClick={handleClearSearch} className="clear-search-link">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default Projects