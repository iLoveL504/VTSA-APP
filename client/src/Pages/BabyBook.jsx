import React, { useState, useMemo } from 'react'
import { useStoreState } from 'easy-peasy'
import '../css/BabyBook.css'

const BabyBook = () => {
  const pmsProjects = useStoreState(state => state.pmsProjects)
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [reportType, setReportType] = useState('financial')

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
      if (!acc[location]) acc[location] = 0
      acc[location] += parseFloat(project.contract_amount || 0)
      return acc
    }, {})

    const projectsByProductType = filteredProjects.reduce((acc, project) => {
      const type = project.product_type || 'Unknown'
      if (!acc[type]) acc[type] = 0
      acc[type] += parseFloat(project.contract_amount || 0)
      return acc
    }, {})

    return {
      totalContractAmount,
      averageContractAmount: totalContractAmount / (filteredProjects.length || 1),
      projectsByLocation,
      projectsByProductType,
      totalProjects: filteredProjects.length
    }
  }, [filteredProjects])

  // PMS Status Reports

  // Regional Reports
  const regionalReports = useMemo(() => {
    const projectsByRegion = filteredProjects.reduce((acc, project) => {
      const region = project.island_group || 'Unknown'
      if (!acc[region]) {
        acc[region] = {
          count: 0,
          totalAmount: 0,
          locations: new Set()
        }
      }
      acc[region].count++
      acc[region].totalAmount += parseFloat(project.contract_amount || 0)
      if (project.location) acc[region].locations.add(project.location)
      return acc
    }, {})

    return projectsByRegion
  }, [filteredProjects])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Handle client click


  const renderFinancialReport = () => (
    <div className="report-section">
      <h3>Financial Summary for {selectedYear}</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Contract Value</h4>
          <div className="stat-value">{formatCurrency(financialReports.totalContractAmount)}</div>
        </div>
        <div className="stat-card">
          <h4>Total Projects</h4>
          <div className="stat-value">{financialReports.totalProjects}</div>
        </div>
        <div className="stat-card">
          <h4>Average Contract Value</h4>
          <div className="stat-value">{formatCurrency(financialReports.averageContractAmount)}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Contract Value by Location</h4>
          <div className="chart-content">
            {Object.entries(financialReports.projectsByLocation).map(([location, amount]) => (
              <div key={location} className="chart-item">
                <span className="chart-label">{location}</span>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      width: `${(amount / financialReports.totalContractAmount) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="chart-value">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Contract Value by Product Type</h4>
          <div className="chart-content">
            {Object.entries(financialReports.projectsByProductType).map(([type, amount]) => (
              <div key={type} className="chart-item">
                <span className="chart-label">{type}</span>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      width: `${(amount / financialReports.totalContractAmount) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="chart-value">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegionalReport = () => (
    <div className="report-section">
      <h3>Regional Distribution for {selectedYear}</h3>
      
      <div className="regional-grid">
        {Object.entries(regionalReports).map(([region, data]) => (
          <div key={region} className="regional-card">
            <h4>{region}</h4>
            <div className="regional-stats">
              <div className="regional-stat">
                <span>Projects:</span>
                <strong>{data.count}</strong>
              </div>
              <div className="regional-stat">
                <span>Total Value:</span>
                <strong>{formatCurrency(data.totalAmount)}</strong>
              </div>
              <div className="regional-stat">
                <span>Locations:</span>
                <strong>{data.locations.size}</strong>
              </div>
              <div className="regional-stat">
                <span>Average Value:</span>
                <strong>{formatCurrency(data.totalAmount / data.count)}</strong>
              </div>
            </div>
            <div className="regional-locations">
              <strong>Locations:</strong> {Array.from(data.locations).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )


  return (
    <div className='BabyBook'>
      <div className="baby-book-header">
        <h1>Preventive Maintenance Service Reports</h1>
      </div>

      {/* Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Select Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Report Type:</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="financial">Financial Reports</option>
            <option value="regional">Regional Reports</option>
          </select>
        </div>
      </div>


      {/* Dynamic Report Content */}
      {reportType === 'financial' && renderFinancialReport()}
      {reportType === 'regional' && renderRegionalReport()}
    </div>
  )
}

export default BabyBook