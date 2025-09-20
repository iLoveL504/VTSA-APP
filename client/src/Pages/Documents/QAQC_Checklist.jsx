import React, { useState } from 'react';

const QAQC_Checklist = () => {
  const [checklistData, setChecklistData] = useState({
    projectName: '',
    orderNumber: '',
    location: '',
    liftType: '',
    foreman: '',
    items: Array(74).fill({ accepted: '', remarks: '' }),
    generalComments: '',
    foremanSignature: '',
    inspectorSignature: '',
    qaqcSignature: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChecklistData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setChecklistData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(checklistData);
  };

  // Checklist sections
  const sections = [
    { title: "With Machine Room (MMR)", start: 0, end: 13 },
    { title: "Machine Room Less (MRL)", start: 14, end: 20 },
    { title: "Shaft/Hoistway & Landing", start: 21, end: 34 },
    { title: "CAR, MAIN & CWT Rail", start: 35, end: 65 },
    { title: "Elevator PIT", start: 66, end: 73 }
  ];

  // Checklist items (abbreviated for this example)
  const checklistItems = [
    "Machine Room must free from obstruction and working condition must acceptable",
    "Temporary or permanent lighting must available within Machine Room",
    "Machine Room door must be lockable (Permanent/Temporary)",
    // ... all 74 items would be listed here
  ];

  return (
    <div className='Content QAQCChecklist'>
      <div className="checklist-header">
        <h1>QA/QC Checklist - Prior Testing and Commissioning</h1>
        <p className="control-number">Control No.: VTSA-RF-0005-21</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section basic-info">
          <div className="form-row">
            <label>Project Name:</label>
            <input
              type="text"
              name="projectName"
              value={checklistData.projectName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Order Number:</label>
            <input
              type="text"
              name="orderNumber"
              value={checklistData.orderNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={checklistData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Lift Type:</label>
            <input
              type="text"
              name="liftType"
              value={checklistData.liftType}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Foreman:</label>
            <input
              type="text"
              name="foreman"
              value={checklistData.foreman}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="checklist-items">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="checklist-section">
              <h3>{section.title}</h3>
              <div className="items-table">
                <div className="table-header">
                  <div className="col-description">Description of Items to Be Inspected</div>
                  <div className="col-accepted">Accepted? (Y/N/NA)</div>
                  <div className="col-remarks">Remarks By Foreman</div>
                </div>
                
                {checklistItems.slice(section.start, section.end + 1).map((item, index) => {
                  const globalIndex = section.start + index;
                  return (
                    <div key={globalIndex} className="table-row">
                      <div className="col-description">
                        <span className="item-number">{globalIndex + 1}.</span>
                        {item}
                      </div>
                      <div className="col-accepted">
                        <select
                          value={checklistData.items[globalIndex].accepted || ''}
                          onChange={(e) => handleItemChange(globalIndex, 'accepted', e.target.value)}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Y">Y</option>
                          <option value="N">N</option>
                          <option value="NA">NA</option>
                        </select>
                      </div>
                      <div className="col-remarks">
                        <input
                          type="text"
                          value={checklistData.items[globalIndex].remarks || ''}
                          onChange={(e) => handleItemChange(globalIndex, 'remarks', e.target.value)}
                          placeholder="Enter remarks"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="form-section comments-section">
          <label>General Comments:</label>
          <textarea
            name="generalComments"
            value={checklistData.generalComments}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>

        <div className="signatures-section">
          <div className="signature-row">
            <div className="signature-field">
              <label>Foreman:</label>
              <input
                type="text"
                name="foremanSignature"
                value={checklistData.foremanSignature}
                onChange={handleInputChange}
                required
              />
              <span className="date">Date: {checklistData.date}</span>
            </div>
            
            <div className="signature-field">
              <label>Inspected by:</label>
              <input
                type="text"
                name="inspectorSignature"
                value={checklistData.inspectorSignature}
                onChange={handleInputChange}
                required
              />
              <span className="date">Date: {checklistData.date}</span>
            </div>
            
            <div className="signature-field">
              <label>Conformed by (QA/QC):</label>
              <input
                type="text"
                name="qaqcSignature"
                value={checklistData.qaqcSignature}
                onChange={handleInputChange}
                required
              />
              <span className="date">Date: {checklistData.date}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Save Checklist</button>
          <button type="button" className="print-btn">Print Checklist</button>
        </div>
      </form>
    </div>
  );
};

export default QAQC_Checklist;