import React, { useState, useMemo } from 'react'
import { Outlet, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import ProjectList from '../../components/Project/ProjectList'
import '../../css/Projects.css'

const Projects = ({updateIsLoading}) => {
  const navigate = useNavigate()
  const projects = useStoreState(state => state.projects)
  const designatedProjects = useStoreState(state => state.designatedProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
console.log(designatedProjects)
  // Available status filters
  const statusOptions = [
    'all',
    'Incoming',
    'Structural/Manufacturing', 
    'Manufacturing and Importation',
    'Preliminaries',
    'Planning For Mobilization And Execution',
    'Installation',
    'Testing and Commissioning (Passenger Elevator)',
    'Pending'
  ]

  // Filter projects based on search term and filters
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project => 
        project.lift_name?.toLowerCase().includes(term) ||
        project.client?.toLowerCase().includes(term) ||
        project.region?.toLowerCase().includes(term) ||
        project.city_municipality?.toLowerCase().includes(term)
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }
    
    // Active filter (all, on-hold, request-hold)
    if (activeFilter === 'on-hold') {
      filtered = filtered.filter(project => project.on_hold)
    } else if (activeFilter === 'request-hold') {
      filtered = filtered.filter(project => project.request_hold)
    } else if (activeFilter === 'active') {
      filtered = filtered.filter(project => !project.on_hold && !project.request_hold)
    }
    
    return filtered
  }, [projects, searchTerm, statusFilter, activeFilter])

  const handleCreateClick = () => {
    navigate('create')
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  const handleActiveFilterChange = (filter) => {
    setActiveFilter(filter)
  }
  console.log(projects)
  const getStats = () => {
    let projectStats = sessionStorage.getItem('roles') !== 'Project Manager' ? 
                  designatedProjects
                      : projects

    const total = projectStats.length
    const active = projectStats.filter(p => !p.on_hold && !p.request_hold).length
    const onHold = projectStats.filter(p => p.on_hold).length
    const requestedHold = projectStats.filter(p => p.request_hold).length
    const behind = projectStats.filter(p => p.is_behind).length
    
    return { total, active, onHold, requestedHold, behind }
  }

  const stats = getStats()

  return (
    <div className='Content ProjectMenu'>
      {/* Header Section */}
      <div className="projects-header">
        <div className="header-left">
          <h1>Project Portfolio</h1>

          <div className="projects-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item stat-behind">
              <span className="stat-number">{stats.behind}</span>
              <span className="stat-label">Behind</span>
            </div>
            <div className="stat-item stat-hold">
              <span className="stat-number">{stats.onHold}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item stat-requested">
              <span className="stat-number">{stats.requestedHold}</span>
              <span className="stat-label">Hold Requested</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
               List
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
               Grid
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search projects by name, client, or location..."
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
          {sessionStorage.getItem('roles') === 'Project Manager' ? (
            <button 
              onClick={handleCreateClick} 
              className="create-project-btn"
            >
              + Add New Project
            </button>            
          ) : (
            <></>
          )}

        </div>
      </div>

      {/* Filter Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Project Status:</label>
          <div className="filter-buttons">
            {statusOptions.map(status => (
              <button
                key={status}
                className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange(status)}
              >
                {status === 'all' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Project State:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleActiveFilterChange('all')}
            >
              All Projects
            </button>
            <button
              className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
              onClick={() => handleActiveFilterChange('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${activeFilter === 'on-hold' ? 'active' : ''}`}
              onClick={() => handleActiveFilterChange('on-hold')}
            >
              On Hold
            </button>
            <button
              className={`filter-btn ${activeFilter === 'request-hold' ? 'active' : ''}`}
              onClick={() => handleActiveFilterChange('request-hold')}
            >
              Hold Requested
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      <div className={`projects-display ${viewMode}`}>
        {viewMode === 'list' ? (
          <>
            {/* Projects Table Header */}
            <div className="project-table-header">
              <div className="table-row header-row">
                <div className="table-cell">Project Info</div>
                <div className="table-cell">Location</div>
                <div className="table-cell">Timeline</div>
                <div className="table-cell">Progress</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Pending</div>
              </div>
            </div>

            {/* Project List */}
            <ProjectList 
              onHold={activeFilter} 
              searchTerm={searchTerm} 
              statusFilter={statusFilter}
              viewMode={viewMode}
              updateIsLoading={updateIsLoading}
            />
          </>
        ) : (
          /* Grid View */
          <ProjectList 
            onHold={activeFilter} 
            searchTerm={searchTerm} 
            statusFilter={statusFilter}
            viewMode={viewMode}
            updateIsLoading={updateIsLoading}
          />
        )}
      </div>

      {/* No Results Message */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="no-results">
          <p>No projects found matching your criteria</p>
          <button onClick={() => {
            setSearchTerm('')
            setStatusFilter('all')
            setActiveFilter('all')
          }} className="clear-search-link">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Projects