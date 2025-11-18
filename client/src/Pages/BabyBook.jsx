import React, { useState, useMemo } from 'react'
import { useStoreState } from 'easy-peasy'
import '../css/BabyBook.css'

// MUI Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import PieChartIcon from '@mui/icons-material/PieChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import AnalyticsIcon from '@mui/icons-material/Analytics';

const BabyBook = () => {
  const pmsProjects = useStoreState(state => state.pmsProjects)
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState('overview')

  // Filter projects for selected year
  const filteredProjects = useMemo(() => {
    return pmsProjects.filter(project => {
      const handoverYear = new Date(project.handover_date).getFullYear()
      return handoverYear === selectedYear
    })
  }, [pmsProjects, selectedYear])

  // Generate years for dropdown (last 5 years + current year)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => currentYear - i)
  }, [])

  // Financial Reports
  const financialReports = useMemo(() => {
    const totalContractAmount = filteredProjects.reduce((sum, project) => 
      sum + parseFloat(project.contract_amount || 0), 0
    )
    
    const projectsByLocation = filteredProjects.reduce((acc, project) => {
      const location = project.location || 'Unknown'
      if (!acc[location]) acc[location] = { amount: 0, count: 0 }
      acc[location].amount += parseFloat(project.contract_amount || 0)
      acc[location].count += 1
      return acc
    }, {})

    const projectsByProductType = filteredProjects.reduce((acc, project) => {
      const type = project.product_type || 'Unknown'
      if (!acc[type]) acc[type] = { amount: 0, count: 0 }
      acc[type].amount += parseFloat(project.contract_amount || 0)
      acc[type].count += 1
      return acc
    }, {})

    const projectsByClient = filteredProjects.reduce((acc, project) => {
      const client = project.client || 'Unknown'
      if (!acc[client]) acc[client] = { amount: 0, count: 0 }
      acc[client].amount += parseFloat(project.contract_amount || 0)
      acc[client].count += 1
      return acc
    }, {})

    return {
      totalContractAmount,
      averageContractAmount: totalContractAmount / (filteredProjects.length || 1),
      projectsByLocation,
      projectsByProductType,
      projectsByClient,
      totalProjects: filteredProjects.length,
      highestValueProject: filteredProjects.reduce((max, project) => 
        parseFloat(project.contract_amount || 0) > parseFloat(max.contract_amount || 0) ? project : max, 
        { contract_amount: 0 }
      )
    }
  }, [filteredProjects])

  // Regional Reports
  const regionalReports = useMemo(() => {
    const projectsByRegion = filteredProjects.reduce((acc, project) => {
      const region = project.island_group || 'Unknown'
      if (!acc[region]) {
        acc[region] = {
          count: 0,
          totalAmount: 0,
          locations: new Set(),
          averageValue: 0
        }
      }
      acc[region].count++
      acc[region].totalAmount += parseFloat(project.contract_amount || 0)
      if (project.location) acc[region].locations.add(project.location)
      acc[region].averageValue = acc[region].totalAmount / acc[region].count
      return acc
    }, {})

    return projectsByRegion
  }, [filteredProjects])

  // PMS Status Reports
  const pmsStatusReports = useMemo(() => {
    const statusCounts = filteredProjects.reduce((acc, project) => {
      const status = project.pms_status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const inspectionStatus = {
      pending: filteredProjects.filter(p => p.inspection_pending && !p.inspection_assigned && !p.inspection_ongoing).length,
      assigned: filteredProjects.filter(p => p.inspection_assigned).length,
      ongoing: filteredProjects.filter(p => p.inspection_ongoing).length,
      completed: filteredProjects.filter(p => !p.inspection_pending && p.last_inspection_date).length
    }

    return {
      statusCounts,
      inspectionStatus,
      totalActivePMS: filteredProjects.filter(p => p.pms_contract === 'Free PMS').length
    }
  }, [filteredProjects])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-PH').format(num)
  }

  // Main Stats Cards
  const renderStatsCards = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(49, 90, 149, 0.1)'}}>
          <AssessmentIcon style={{color: '#315a95'}} />
        </div>
        <div className="stat-content">
          <h3>{formatNumber(financialReports.totalProjects)}</h3>
          <p>Total PMS Projects</p>
          <span className="stat-trend">in {selectedYear}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(40, 167, 69, 0.1)'}}>
          <TrendingUpIcon style={{color: '#28a745'}} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(financialReports.totalContractAmount)}</h3>
          <p>Total Contract Value</p>
          <span className="stat-trend">
            Avg: {formatCurrency(financialReports.averageContractAmount)}
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)'}}>
          <BusinessIcon style={{color: '#17a2b8'}} />
        </div>
        <div className="stat-content">
          <h3>{pmsStatusReports.totalActivePMS}</h3>
          <p>Active PMS Contracts</p>
          <span className="stat-trend">Free PMS</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
          <AnalyticsIcon style={{color: '#ffc107'}} />
        </div>
        <div className="stat-content">
          <h3>{Object.keys(regionalReports).length}</h3>
          <p>Regions Covered</p>
          <span className="stat-trend">Island Groups</span>
        </div>
      </div>
    </div>
  )

  // Financial Overview Tab
  const renderFinancialOverview = () => (
    <div className="tab-content">
      <div className="charts-grid">
        <div className="chart-card large">
          <div className="card-header">
            <h3>
              <LocationOnIcon style={{marginRight: '8px'}} />
              Contract Value by Location
            </h3>
          </div>
          <div className="chart-content">
            {Object.entries(financialReports.projectsByLocation)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .map(([location, data]) => (
                <div key={location} className="chart-item">
                  <div className="chart-info">
                    <span className="chart-label">{location}</span>
                    <span className="chart-count">{data.count} projects</span>
                  </div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        width: `${(data.amount / financialReports.totalContractAmount) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="chart-value">{formatCurrency(data.amount)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>
              <CategoryIcon style={{marginRight: '8px'}} />
              By Product Type
            </h3>
          </div>
          <div className="chart-content">
            {Object.entries(financialReports.projectsByProductType)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .map(([type, data]) => (
                <div key={type} className="chart-item">
                  <span className="chart-label">{type}</span>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar secondary" 
                      style={{ 
                        width: `${(data.amount / financialReports.totalContractAmount) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="chart-value">{formatCurrency(data.amount)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>
              <BusinessIcon style={{marginRight: '8px'}} />
              Top Clients
            </h3>
          </div>
          <div className="chart-content">
            {Object.entries(financialReports.projectsByClient)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .slice(0, 8)
              .map(([client, data]) => (
                <div key={client} className="chart-item">
                  <span className="chart-label">{client}</span>
                  <div className="chart-meta">
                    <span className="project-count">{data.count} projects</span>
                    <span className="chart-value">{formatCurrency(data.amount)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Regional Distribution Tab
  const renderRegionalDistribution = () => (
    <div className="tab-content">
      <div className="regional-grid">
        {Object.entries(regionalReports).map(([region, data]) => (
          <div key={region} className="regional-card">
            <div className="regional-header">
              <h4>{region}</h4>
              <span className="regional-badge">{data.count} projects</span>
            </div>
            <div className="regional-stats">
              <div className="regional-stat">
                <span>Total Value</span>
                <strong>{formatCurrency(data.totalAmount)}</strong>
              </div>
              <div className="regional-stat">
                <span>Average Value</span>
                <strong>{formatCurrency(data.averageValue)}</strong>
              </div>
              <div className="regional-stat">
                <span>Locations</span>
                <strong>{data.locations.size}</strong>
              </div>
            </div>
            <div className="regional-locations">
              <strong>Covered Locations:</strong>
              <div className="locations-list">
                {Array.from(data.locations).slice(0, 4).map(location => (
                  <span key={location} className="location-tag">{location}</span>
                ))}
                {data.locations.size > 4 && (
                  <span className="location-more">+{data.locations.size - 4} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // PMS Status Tab
  const renderPMSStatus = () => (
    <div className="tab-content">
      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <PieChartIcon style={{marginRight: '8px'}} />
              PMS Status Distribution
            </h3>
          </div>
          <div className="chart-content">
            {Object.entries(pmsStatusReports.statusCounts).map(([status, count]) => (
              <div key={status} className="status-item">
                <span className="status-label">{status}</span>
                <div className="status-bar-container">
                  <div 
                    className="status-bar"
                    style={{ 
                      width: `${(count / financialReports.totalProjects) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>
              <AssessmentIcon style={{marginRight: '8px'}} />
              Inspection Status
            </h3>
          </div>
          <div className="inspection-stats">
            <div className="inspection-item pending">
              <span className="inspection-label">Pending</span>
              <span className="inspection-count">{pmsStatusReports.inspectionStatus.pending}</span>
            </div>
            <div className="inspection-item assigned">
              <span className="inspection-label">Assigned</span>
              <span className="inspection-count">{pmsStatusReports.inspectionStatus.assigned}</span>
            </div>
            <div className="inspection-item ongoing">
              <span className="inspection-label">Ongoing</span>
              <span className="inspection-count">{pmsStatusReports.inspectionStatus.ongoing}</span>
            </div>
            <div className="inspection-item completed">
              <span className="inspection-label">Completed</span>
              <span className="inspection-count">{pmsStatusReports.inspectionStatus.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='Content BabyBook'>
      <div className="dashboard-header">
        <h1>PMS Analytics & Reports</h1>
        <p>Comprehensive overview of Preventive Maintenance Service contracts and performance metrics</p>
      </div>

      {/* Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Report Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="control-select"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      {renderStatsCards()}

      {/* Navigation Tabs */}
      <div className="report-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <AssessmentIcon style={{marginRight: '8px'}} />
            Financial Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'regional' ? 'active' : ''}`}
            onClick={() => setActiveTab('regional')}
          >
            <LocationOnIcon style={{marginRight: '8px'}} />
            Regional Distribution
          </button>
          <button 
            className={`tab-button ${activeTab === 'pms' ? 'active' : ''}`}
            onClick={() => setActiveTab('pms')}
          >
            <AnalyticsIcon style={{marginRight: '8px'}} />
            PMS Status
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderFinancialOverview()}
        {activeTab === 'regional' && renderRegionalDistribution()}
        {activeTab === 'pms' && renderPMSStatus()}
      </div>
    </div>
  )
}

export default BabyBook