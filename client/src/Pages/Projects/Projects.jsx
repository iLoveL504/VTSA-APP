import React, { useState, useMemo } from 'react'
import { Outlet, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useStoreState } from 'easy-peasy'
import ProjectList from '../../components/Project/ProjectList'
import '../../css/Projects.css'

const Projects = ({updateIsLoading}) => {
  const navigate = useNavigate()
  const { projects, designatedProjects, designatedIsLoading } = useStoreState(state => state)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  
  const role = sessionStorage.getItem('roles')
  
  console.log('All projects:', projects)
  console.log('Designated projects:', designatedProjects)
  console.log('Current role:', role)

  // Available status filters
  const statusOptions = [
    'all',
    'Incoming',
    'Structural/Manufacturing', 
    'Manufacturing and Importation',
    'Preliminaries',
    'Planning For Mobilization And Execution',
    'Installation',
    'Test and Comm',
    'Pending'
  ]

  // Get base projects based on role
  const getBaseProjects = () => {
    if (role === 'Project Manager' || role === 'Operations Manager') {
      return projects
    } else {
      return designatedProjects
    }
  }

  // Filter projects based on search term and filters
  const filteredProjects = useMemo(() => {
    console.log('Filtering with:', { searchTerm, statusFilter, activeFilter, role })
    
    let filtered = getBaseProjects()
    
    console.log('Base projects count:', filtered.length)
    console.log('Base projects:', filtered)

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project => {
        const liftName = project.lift_name?.toLowerCase() || ''
        const client = project.client?.toLowerCase() || ''
        const region = project.region?.toLowerCase() || ''
        const city = project.city_municipality?.toLowerCase() || ''
        const province = project.province?.toLowerCase() || ''
        
        return liftName.includes(term) ||
               client.includes(term) ||
               region.includes(term) ||
               city.includes(term) ||
               province.includes(term)
      })
      console.log('After search filter:', filtered.length)
    }
    
    // Status filter - handle case insensitivity
    if (statusFilter !== 'all') {
      console.log('Applying status filter:', statusFilter)
      filtered = filtered.filter(project => {
        const projectStatus = project.status?.toLowerCase().trim()
        const filterStatus = statusFilter.toLowerCase().trim()
        return projectStatus === filterStatus
      })
      console.log('After status filter:', filtered.length)
    }
    
    // Handle behind-schedule filter
    if (activeFilter === 'behind-schedule') {
      console.log('Applying behind schedule filter')
      // Try different possible property names
      filtered = filtered.filter(project => {
        console.log('Project behind status:', {
          id: project.id,
          is_behind: project.is_behind,
          behind_schedule: project.behind_schedule,
          isBehind: project.isBehind
        })
        return project.is_behind === 1 || 
               project.is_behind === true ||
               project.behind_schedule === 1 ||
               project.behind_schedule === true ||
               project.isBehind === 1 ||
               project.isBehind === true
      })
      console.log('After behind schedule filter:', filtered.length)
    }
    
    // Other active filters
    if (activeFilter === 'on-hold') {
      filtered = filtered.filter(project => project.on_hold === 1 || project.on_hold === true)
      console.log('After on-hold filter:', filtered.length)
    } else if (activeFilter === 'request-hold') {
      filtered = filtered.filter(project => project.request_hold === 1 || project.request_hold === true)
      console.log('After request-hold filter:', filtered.length)
    } else if (activeFilter === 'active') {
      filtered = filtered.filter(project => 
        !project.on_hold && 
        !project.request_hold &&
        project.on_hold !== 1 && 
        project.request_hold !== 1
      )
      console.log('After active filter:', filtered.length)
    }
    
    console.log('Final filtered count:', filtered.length)
    return filtered
  }, [projects, designatedProjects, searchTerm, statusFilter, activeFilter, role])

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
    console.log('Status filter changed to:', status)
    setStatusFilter(status)
  }

  const handleActiveFilterChange = (filter) => {
    console.log('Active filter changed to:', filter)
    setActiveFilter(filter)
  }

  // Debug function to check project statuses
  const debugProjectStatuses = () => {
    const baseProjects = getBaseProjects()
    const uniqueStatuses = [...new Set(baseProjects.map(p => p.status))].filter(Boolean)
    console.log('Available project statuses for current role:', uniqueStatuses)
    
    const behindProjects = baseProjects.filter(p => 
      p.is_behind === 1 || p.is_behind === true || 
      p.behind_schedule === 1 || p.behind_schedule === true
    )
    console.log('Projects marked as behind schedule for current role:', behindProjects.length)
    console.log('Behind schedule projects details:', behindProjects.map(p => ({
      id: p.id,
      name: p.lift_name,
      is_behind: p.is_behind,
      behind_schedule: p.behind_schedule,
      status: p.status
    })))
  }

  // Call debug function on component mount and when role changes
  React.useEffect(() => {
    debugProjectStatuses()
  }, [projects, designatedProjects, role])

  const getStats = () => {
    const projectStats = getBaseProjects()

    const total = projectStats.length
    const active = projectStats.filter(p => 
      !p.on_hold && 
      !p.request_hold &&
      p.on_hold !== 1 && 
      p.request_hold !== 1
    ).length
    const onHold = projectStats.filter(p => p.on_hold === 1 || p.on_hold === true).length
    const requestedHold = projectStats.filter(p => p.request_hold === 1 || p.request_hold === true).length
    
    // Count behind schedule projects using multiple possible property names
    const behind = projectStats.filter(p => 
      p.is_behind === 1 || 
      p.is_behind === true ||
      p.behind_schedule === 1 ||
      p.behind_schedule === true
    ).length
    
    return { total, active, onHold, requestedHold, behind }
  }

  const stats = getStats()

  return (
    <div className='Content ProjectMenu'>
      {/* Header Section */}
      <div className="projects-header">
        <div className="header-left">
          <h1>Project Portfolio</h1>
          <div className="role-indicator">
            Viewing: {role === 'Project Manager' || role === 'Operations Manager' ? 'All Projects' : 'My Projects'}
          </div>

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
          {role === 'Project Manager' ? (
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
              className={`filter-btn ${activeFilter === 'behind-schedule' ? 'active' : ''}`}
              onClick={() => handleActiveFilterChange('behind-schedule')}
            >
              Behind Schedule
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

      {/* Debug Info (remove in production) */}
      <div style={{padding: '10px', background: '#f5f5f5', marginBottom: '10px', fontSize: '12px'}}>
        <strong>Debug Info:</strong> 
        Role: "{role}" | 
        Status Filter: "{statusFilter}" | 
        Active Filter: "{activeFilter}" | 
        Base Projects: {getBaseProjects().length} |
        Filtered Projects: {filteredProjects.length}
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
                <div className="table-cell">Pending (Must be 90%)</div>
              </div>
            </div>

            {/* Project List */}
            <ProjectList 
              projects={filteredProjects} // Pass filtered projects directly
              onHold={activeFilter} 
              searchTerm={searchTerm} 
              statusFilter={statusFilter}
              viewMode={viewMode}
              updateIsLoading={updateIsLoading}
              isLoading={designatedIsLoading}
            />
          </>
        ) : (
          /* Grid View */
          <ProjectList 
            projects={filteredProjects} // Pass filtered projects directly
            onHold={activeFilter} 
            searchTerm={searchTerm} 
            statusFilter={statusFilter}
            viewMode={viewMode}
            updateIsLoading={updateIsLoading}
            isLoading={designatedIsLoading}
          />
        )}
      </div>

      {/* No Results Message */}
      {filteredProjects.length === 0 && getBaseProjects().length > 0 && (
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

      {/* No Projects Message */}
      {getBaseProjects().length === 0 && (
        <div className="no-results">
          <p>No projects available for your role</p>
          {role !== 'Project Manager' && role !== 'Operations Manager' && (
            <p className="no-projects-help">
              If you should have access to projects, please contact your Project Manager.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Projects