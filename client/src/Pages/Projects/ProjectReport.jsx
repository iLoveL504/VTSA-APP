import React, { useState } from 'react';

const ProjectReport = () => {
  const [reportData, setReportData] = useState({
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    projectName: '',
    siteAddress: '',
    buildingName: '',
    elevatorType: '',
    elevatorModel: '',
    elevatorNumber: '',
    weatherConditions: '',
    workCompleted: '',
    workPlannedNextDay: '',
    manpower: [{ trade: '', count: '', hours: '' }],
    equipment: [{ type: '', hours: '', status: '' }],
    materialsUsed: [{ name: '', quantity: '', unit: '' }],
    testsPerformed: [{ type: '', result: '', notes: '' }],
    safetyChecks: [{ check: '', status: '', notes: '' }],
    delaysIssues: '',
    safetyIncidents: '',
    qualityChecks: '',
    photos: [],
    remarks: ''
  });

  const elevatorTypes = ['Passenger', 'Freight', 'Service', 'Residential', 'Hospital', 'Panoramic'];
  const elevatorModels = ['Otis Gen2', 'Schindler 3300', 'KONE MonoSpace', 'Thyssenkrupp TWIN', 'Mitsubishi ELENESSA', 'Other'];
  const testTypes = ['Hoistway Alignment', 'Door Operation', 'Leveling', 'Emergency Stop', 'Safety Circuit', 'Overload Test', 'Fire Service', 'Other'];
  const safetyChecksList = ['Top of Car', 'Pit', 'Machine Room', 'Hoistway', 'Emergency Communication', 'Safety Gear', 'Brakes', 'Roping'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (section, index, field, value) => {
    const updatedSection = [...reportData[section]];
    updatedSection[index][field] = value;
    setReportData(prev => ({
      ...prev,
      [section]: updatedSection
    }));
  };

  const addArrayItem = (section) => {
    let newItem = {};
    if (section === 'manpower') newItem = { trade: '', count: '', hours: '' };
    if (section === 'equipment') newItem = { type: '', hours: '', status: '' };
    if (section === 'materialsUsed') newItem = { name: '', quantity: '', unit: '' };
    if (section === 'testsPerformed') newItem = { type: '', result: '', notes: '' };
    if (section === 'safetyChecks') newItem = { check: '', status: '', notes: '' };
    
    setReportData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    const updatedSection = [...reportData[section]];
    updatedSection.splice(index, 1);
    setReportData(prev => ({
      ...prev,
      [section]: updatedSection
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting elevator project report:', reportData);
    // Here you would typically send the data to your backend
    alert('Elevator Project Report submitted successfully!');
  };

  return (
    <div className="Content ProjectReport">
      <div className="report-header">
        <div>sdfads</div>
        <h1>Elevator Project Daily Report</h1>
        <p>Submit your daily elevator installation, maintenance, or repair activities</p>
      </div>
      
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-section">
          <h2>Project Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Report Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={reportData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="projectId">Project ID</label>
              <input
                type="text"
                id="projectId"
                name="projectId"
                value={reportData.projectId}
                onChange={handleInputChange}
                placeholder="Enter project ID"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={reportData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="elevatorNumber">Elevator Number/ID</label>
              <input
                type="text"
                id="elevatorNumber"
                name="elevatorNumber"
                value={reportData.elevatorNumber}
                onChange={handleInputChange}
                placeholder="Elevator #"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="elevatorType">Elevator Type</label>
              <select
                id="elevatorType"
                name="elevatorType"
                value={reportData.elevatorType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select elevator type</option>
                {elevatorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="elevatorModel">Elevator Model</label>
              <select
                id="elevatorModel"
                name="elevatorModel"
                value={reportData.elevatorModel}
                onChange={handleInputChange}
                required
              >
                <option value="">Select elevator model</option>
                {elevatorModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="buildingName">Building Name</label>
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                value={reportData.buildingName}
                onChange={handleInputChange}
                placeholder="Building name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteAddress">Site Address</label>
              <input
                type="text"
                id="siteAddress"
                name="siteAddress"
                value={reportData.siteAddress}
                onChange={handleInputChange}
                placeholder="Site address"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weatherConditions">Weather Conditions</label>
              <select
                id="weatherConditions"
                name="weatherConditions"
                value={reportData.weatherConditions}
                onChange={handleInputChange}
              >
                <option value="">Select weather condition</option>
                <option value="sunny">Sunny/Clear</option>
                <option value="cloudy">Cloudy</option>
                <option value="rainy">Rainy</option>
                <option value="windy">Windy</option>
                <option value="stormy">Stormy</option>
                <option value="snowy">Snowy</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Work Progress</h2>
          <div className="form-group">
            <label htmlFor="workCompleted">Work Completed Today</label>
            <textarea
              id="workCompleted"
              name="workCompleted"
              value={reportData.workCompleted}
              onChange={handleInputChange}
              placeholder="Describe elevator-related work completed today"
              rows="4"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="workPlannedNextDay">Work Planned for Next Day</label>
            <textarea
              id="workPlannedNextDay"
              name="workPlannedNextDay"
              value={reportData.workPlannedNextDay}
              onChange={handleInputChange}
              placeholder="Describe elevator-related work planned for tomorrow"
              rows="4"
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          
        </div>

        <div className="form-section">
          <h2>Elevator Testing</h2>
          
          <div className="resource-section">
            <h3>Tests Performed</h3>
            {reportData.testsPerformed.map((test, index) => (
              <div key={index} className="resource-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>Test Type</label>
                    <select
                      value={test.type}
                      onChange={(e) => handleArrayInputChange('testsPerformed', index, 'type', e.target.value)}
                    >
                      <option value="">Select test type</option>
                      {testTypes.map(testType => (
                        <option key={testType} value={testType}>{testType}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Result</label>
                    <select
                      value={test.result}
                      onChange={(e) => handleArrayInputChange('testsPerformed', index, 'result', e.target.value)}
                    >
                      <option value="">Select result</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                      <option value="conditional">Conditional</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Notes</label>
                    <input
                      type="text"
                      value={test.notes}
                      onChange={(e) => handleArrayInputChange('testsPerformed', index, 'notes', e.target.value)}
                      placeholder="Test details"
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeArrayItem('testsPerformed', index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="add-btn"
              onClick={() => addArrayItem('testsPerformed')}
            >
              + Add Test Entry
            </button>
          </div>
        </div>

        <div className="form-section">
          <h2>Safety & Compliance</h2>
          
          <div className="resource-section">
            <h3>Safety Checks Performed</h3>
            {reportData.safetyChecks.map((check, index) => (
              <div key={index} className="resource-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>Safety Check</label>
                    <select
                      value={check.check}
                      onChange={(e) => handleArrayInputChange('safetyChecks', index, 'check', e.target.value)}
                    >
                      <option value="">Select safety check</option>
                      {safetyChecksList.map(safetyCheck => (
                        <option key={safetyCheck} value={safetyCheck}>{safetyCheck}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={check.status}
                      onChange={(e) => handleArrayInputChange('safetyChecks', index, 'status', e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="compliant">Compliant</option>
                      <option value="non-compliant">Non-Compliant</option>
                      <option value="n/a">N/A</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Notes</label>
                    <input
                      type="text"
                      value={check.notes}
                      onChange={(e) => handleArrayInputChange('safetyChecks', index, 'notes', e.target.value)}
                      placeholder="Check details"
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeArrayItem('safetyChecks', index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="add-btn"
              onClick={() => addArrayItem('safetyChecks')}
            >
              + Add Safety Check
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="safetyIncidents">Safety Incidents/Near Misses</label>
            <textarea
              id="safetyIncidents"
              name="safetyIncidents"
              value={reportData.safetyIncidents}
              onChange={handleInputChange}
              placeholder="Describe any safety incidents or near misses"
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Issues & Quality</h2>
          
          <div className="form-group">
            <label htmlFor="delaysIssues">Delays or Issues Encountered</label>
            <textarea
              id="delaysIssues"
              name="delaysIssues"
              value={reportData.delaysIssues}
              onChange={handleInputChange}
              placeholder="Describe any delays, issues, or problems encountered"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="qualityChecks">Quality Control Checks</label>
            <textarea
              id="qualityChecks"
              name="qualityChecks"
              value={reportData.qualityChecks}
              onChange={handleInputChange}
              placeholder="Describe quality control checks performed and results"
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Additional Information</h2>
          
          <div className="form-group">
            <label htmlFor="photos">Upload Photos (Optional)</label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={(e) => {
                // Handle file uploads - in a real app, you would process these files
                setReportData(prev => ({
                  ...prev,
                  photos: [...e.target.files]
                }));
              }}
            />
            <small>Upload photos of work progress, issues, or completed tasks</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="remarks">Remarks/Additional Notes</label>
            <textarea
              id="remarks"
              name="remarks"
              value={reportData.remarks}
              onChange={handleInputChange}
              placeholder="Any additional information or comments"
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Elevator Project Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectReport;