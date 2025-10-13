import React, {useState} from 'react'
import '../../css/HandOverChecklist.css'
import { Axios } from '../../api/axios.js';

const HandOverChecklist = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    orderNumber: "",
    location: "",
    liftType: "",
    foreman: "",
    items: {},
    remarks: "",
    inspectors: {
      tncIncharge: { designation: "", name: "", signature: "", date: "" },
      tncManager: { designation: "", name: "", signature: "", date: "" },
      projectIncharge: { designation: "", name: "", signature: "", date: "" },
    },
  });

  const checklistSections = {
    Car: [
      "Condition of car panels and car door",
      "Condition COP and push buttons",
      "Functionality of COP indicators",
      "Functionality of attendant switch",
      "Functionality of car light switch",
      "Functionality of car fan switch",
      "Condition of ceiling",
      "Functionality of light curtain sensor",
    ],
    Landings: [
      "Condition of landing door (panels, frames, sills, key release)",
      "Functionality of LOP buttons",
      "Functionality of LOP indicators",
      "Condition of control cabinet (MRL only)",
      "Verify stopping accuracy",
      "Functionality of arrival gong",
    ],
    "Machine Room": [
      "Verify installation rope raise guards",
      "Installation weatherproof louver",
      "Verify installation of safety warning signs",
      "Verify installation of machine room permanent breakers",
      "Verify installation of machine room lightings",
      "Cleanliness and water tightness of machine room",
    ],
    "Car Top": [
      "Verify installation of cartop barricades (If applicable)",
      "Functionality of lightings",
    ],
    "Hoist way Area": ["Verify installation of hoist way lightings (C/O Client)"],
    "PIT Area": [
      "Functionality of lightings",
      "Verify installation of ladder and buffers",
      "Verify installation of CWT frame (If applicable)",
      "Cleanliness and water tightness of PIT",
      "Verify Installation of submersible pump (If available)",
    ],
    "Safety Features": [
      "Functionality of intercom at client lobby (verify location to the client) car, car top, controller and PIT",
      "Functionality of car emergency alarm",
      "Functionality of full load indicator",
      "Functionality of overload alarm",
      "Functionality of overload limit (100%)",
      "Functionality of (ARD) Automatic Rescue Device",
      "Functionality of manual brake release (Battery operated)",
      "Functionality of manual brake lever (If applicable)",
      "Functionality of fireman's switch",
    ],
    "Additional Features": [
      "Functionality of air-conditioning (If included)",
      "Functionality of voice indicator/audio music (If included)",
      "Functionality of CCTV (If included)",
      "Functionality of Monitoring system (If included)",
      "Functionality of VIP cards (If included)",
      "Functionality of Earthquake device (If included)",
      "Functionality and installation condition of AVR (If included)",
    ],
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChecklistChange = (item, status) => {
    setFormData((prev) => ({
      ...prev,
      items: { ...prev.items, [item]: status },
    }));
  };

  const handleInspectorChange = (role, field, value) => {
    setFormData((prev) => ({
      ...prev,
      inspectors: {
        ...prev.inspectors,
        [role]: { ...prev.inspectors[role], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      await Axios.post("/api/checklist-prior-handover", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="Content HandOverChecklist">
      <div className="checklist-container">
        <div className="checklist-header">
          <h2>Checklist Prior Hand-Over</h2>
          <p>Complete inspection checklist before project handover</p>
        </div>

        <form className="checklist-form" onSubmit={handleSubmit}>
          {/* Project Information Grid */}
          <div className="project-info-grid">
            <div className="form-group">
              <label>Project Name:</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange("projectName", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Order Number:</label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => handleChange("orderNumber", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Lift Type:</label>
              <input
                type="text"
                value={formData.liftType}
                onChange={(e) => handleChange("liftType", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Foreman:</label>
              <input
                type="text"
                value={formData.foreman}
                onChange={(e) => handleChange("foreman", e.target.value)}
              />
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="progress-container">
            <div className="progress-header">
              <span>Checklist Progress</span>
              <span>0%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '0%'}}></div>
            </div>
            <div className="progress-stats">
              <span>Completed: 0 items</span>
              <span>Total: {Object.values(checklistSections).flat().length} items</span>
            </div>
          </div>

          {/* Checklist Sections */}
          {Object.entries(checklistSections).map(([section, items]) => (
            <div key={section} className="checklist-section">
              <div className="section-header">
                {section}
              </div>
              {items.map((item, index) => (
                <div key={index} className="checklist-item">
                  <label>{item}</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={item}
                        value="Accepted"
                        checked={formData.items[item] === "Accepted"}
                        onChange={() => handleChecklistChange(item, "Accepted")}
                      />
                      Accepted
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={item}
                        value="Punch List"
                        checked={formData.items[item] === "Punch List"}
                        onChange={() => handleChecklistChange(item, "Punch List")}
                      />
                      Punch List
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Remarks Section */}
          <div className="checklist-section">
            <div className="section-header">
              Additional Remarks
            </div>
            <div className="checklist-item">
              <div className="form-group" style={{marginBottom: 0}}>
                <textarea
                  rows="4"
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  placeholder="Enter any additional remarks or comments..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Inspectors Section */}
          <div className="section-header">
            Inspection Conducted By
          </div>
          <div className="inspectors-grid">
            {Object.entries(formData.inspectors).map(([role, fields]) => (
              <div key={role} className={`inspector-card inspector-card--${role.toLowerCase()}`}>
                <h4 className="inspector-card__title">{role.replace(/([A-Z])/g, " $1")}</h4>
                <div className="inspector-card__fields">
                  <input
                    className="inspector-card__input inspector-card__input--designation"
                    placeholder="Designation"
                    value={fields.designation}
                    onChange={(e) =>
                      handleInspectorChange(role, "designation", e.target.value)
                    }
                  />
                  <input
                    className="inspector-card__input inspector-card__input--name"
                    placeholder="Full Name"
                    value={fields.name}
                    onChange={(e) =>
                      handleInspectorChange(role, "name", e.target.value)
                    }
                  />
                  <input
                    className="inspector-card__input inspector-card__input--signature"
                    placeholder="Signature"
                    value={fields.signature}
                    onChange={(e) =>
                      handleInspectorChange(role, "signature", e.target.value)
                    }
                  />
                  <input
                    className="inspector-card__input inspector-card__input--date"
                    type="date"
                    value={fields.date}
                    onChange={(e) =>
                      handleInspectorChange(role, "date", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            <button type="submit" className="submit-btn">
              Submit Handover Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HandOverChecklist