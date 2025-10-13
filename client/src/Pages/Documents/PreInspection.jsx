import React, { useState, useEffect } from "react";
import { Axios } from "../../api/axios";
import { useParams } from "react-router-dom";
import '../../css/PreInspection_Checklist.css'

const PreInspection_Checklist = () => {
  const backendURL = import.meta.env.VITE_BACKENDURL || "http://localhost:4000";
  const { projId } = useParams();

  const [loading, setLoading] = useState(true);

  const initialMeasurements = [
    // Overhead/PIT Area
    "Overhead - A",
    "Pit Depth - B",
    "Door Rough Opening Height - C",
    "Machine Room Height - E",
    // Landing/Hoistway Area
    "FACADE - A",
    "FACADE - B",
    "Hoistway Depth - C",
    "Hoistway Width - D",
    "Door Rough Opening Width - E",
    "Door Opening - F",
    "Car Depth - G",
    "Car Width - H",
    "Car Height - I",
    "Car Door Height - J",
    // Floor to Floor Height
    "Floor to Floor Height - A",
  ];

  const [checklistData, setChecklistData] = useState({
    project_name: "",
    location: "",
    elevator_type: "",
    lifts: Array.from({ length: 5 }, () => ({
      liftNo: "",
      measurements: Array.from({ length: initialMeasurements.length }, () => ""),
    })),
    other_comments: "",
    signatures: {
      project_engr: { company: "", name: "", signature: "", date: "" },
      qaqc: { company: "", name: "", signature: "", date: "" },
      client_rep1: { company: "", name: "", signature: "", date: "" },
      client_rep2: { company: "", name: "", signature: "", date: "" },
    },
  });

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const { data } = await Axios.get(
          `/api/projects/checklist-preinspection/${projId}`
        );
        setChecklistData(
          data.items_json
            ? JSON.parse(data.items_json)
            : {
                project_name: "",
                location: "",
                elevator_type: "",
                lifts: Array.from({ length: 5 }, () => ({
                  liftNo: "",
                  measurements: Array.from(
                    { length: initialMeasurements.length },
                    () => ""
                  ),
                })),
                other_comments: "",
                signatures: {
                  project_engr: { company: "", name: "", signature: "", date: "" },
                  qaqc: { company: "", name: "", signature: "", date: "" },
                  client_rep1: { company: "", name: "", signature: "", date: "" },
                  client_rep2: { company: "", name: "", signature: "", date: "" },
                },
              }
        );
        setLoading(false);
      } catch (error) {
        console.error("Error loading preinspection checklist:", error);
      }
    };
    fetchChecklist();
  }, [projId, backendURL, initialMeasurements.length]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setChecklistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLiftChange = (liftIndex, field, value) => {
    setChecklistData((prev) => {
      const newLifts = [...prev.lifts];
      newLifts[liftIndex][field] = value;
      return { ...prev, lifts: newLifts };
    });
  };

  const handleMeasurementChange = (liftIndex, measureIndex, value) => {
    setChecklistData((prev) => {
      const newLifts = [...prev.lifts];
      newLifts[liftIndex].measurements[measureIndex] = value;
      return { ...prev, lifts: newLifts };
    });
  };

  const handleSignatureChange = (role, field, value) => {
    setChecklistData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [role]: {
          ...prev.signatures[role],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.put(
        `/api/projects/checklist-preinspection/${projId}`,
        { items_json: JSON.stringify(checklistData) }
      );
      alert("Pre-Inspection Checklist saved successfully!");
    } catch (error) {
      console.error("Error saving preinspection checklist:", error);
      alert("Error saving checklist.");
    }
  };

  if (loading) {
    return (
      <div className="loading-barrier">
        <div className="spinner"></div>
        <p>Loading Pre-Inspection Checklist...</p>
      </div>
    );
  }

  return (
    <div className="Content PreInspectionChecklist">
      <div className="checklist-header">
        <h1>Pre-Inspection Checklist (Actual Shaft Condition)</h1>
        <p className="control-number">Control No.: VTSA-RF-0029-22</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-section basic-info">
          <div className="form-row">
            <label>Project Name:</label>
            <input
              type="text"
              name="project_name"
              value={checklistData.project_name}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={checklistData.location}
              onChange={handleFieldChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Elevator Type:</label>
            <input
              type="text"
              name="elevator_type"
              value={checklistData.elevator_type}
              onChange={handleFieldChange}
              required
            />
          </div>
        </div>

        {/* Measurement Table */}
        <div className="measurements-section">
          <h3>Overhead / PIT / Landing / Hoistway / Floor-to-Floor</h3>
          <div className="measurements-table">
            <div className="table-header">
              <div className="col-description">Description</div>
              {checklistData.lifts.map((lift, i) => (
                <div key={i} className="col-lift">
                  <input
                    type="text"
                    placeholder={`Lift No. ${i + 1}`}
                    value={lift.liftNo}
                    onChange={(e) =>
                      handleLiftChange(i, "liftNo", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {initialMeasurements.map((desc, measureIndex) => (
              <div key={measureIndex} className="table-row">
                <div className="col-description">{desc}</div>
                {checklistData.lifts.map((lift, liftIndex) => (
                  <div key={liftIndex} className="col-lift">
                    <input
                      type="text"
                      value={
                        checklistData.lifts[liftIndex].measurements[
                          measureIndex
                        ] || ""
                      }
                      onChange={(e) =>
                        handleMeasurementChange(
                          liftIndex,
                          measureIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter measurement"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Other Comments */}
        <div className="form-section comments-section">
          <label>Other Comments / Illustration:</label>
          <textarea
            name="other_comments"
            value={checklistData.other_comments}
            onChange={handleFieldChange}
            rows="4"
          ></textarea>
        </div>

        {/* Signatures */}
        <div className="signatures-section">
          <h3>Inspection Conducted By:</h3>
          {[
            { role: "project_engr", label: "Project Engr. (VTSA-Schneider)" },
            { role: "qaqc", label: "QA/QC (VTSA-Schneider)" },
            { role: "client_rep1", label: "Client Rep 1" },
            { role: "client_rep2", label: "Client Rep 2" },
          ].map(({ role, label }) => (
            <div key={role} className="signature-row">
              <label>{label}</label>
              <div className="signature-fields">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={checklistData.signatures[role].company}
                  onChange={(e) =>
                    handleSignatureChange(role, "company", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Print Name"
                  value={checklistData.signatures[role].name}
                  onChange={(e) =>
                    handleSignatureChange(role, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Signature"
                  value={checklistData.signatures[role].signature}
                  onChange={(e) =>
                    handleSignatureChange(role, "signature", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={checklistData.signatures[role].date}
                  onChange={(e) =>
                    handleSignatureChange(role, "date", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Checklist
          </button>
          <button type="button" className="print-btn">
            Print Checklist
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreInspection_Checklist;
