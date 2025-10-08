import React, { useState, useEffect } from "react";
import { Axios } from '../../api/axios'
import { useParams } from 'react-router-dom'

export default function KickOffChecklist() {
  const backendURL = import.meta.env.VITE_BACKENDURL || 'http://localhost:4000'
  const {projId} = useParams()
  const [formData, setFormData] = useState({
    projectName: "",
    siteAddress: "",
    projectNo: "",
    date: "",
    clientName: "",
    picName: "",
    contactNo: "",
    projectDetails: {
      elevatorType: "",
      finishes: "",
      installMethod: "",
      designReq: "",
      buildingStatus: "",
      others: ""
    },
    mobilization: {
      toolbox: false,
      qaqc: false,
      drawing: false,
      manual: false
    },
    program: {
      startDate: "",
      schedule: "",
      completionDate: "",
      manpower: "",
      tools: "",
      others: ""
    },
    otherReq: {
      lodging: "",
      others: ""
    },
    signatures: ["", "", ""]
  });

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await Axios.get(`${backendURL}/projects/kickoff/${projId}`);
        if (res.data.success && res.data.data) {
          console.log(res)
          const d = res.data.data;
          setFormData({
            projectName: d.project_name || "",
            siteAddress: d.site_address || "",
            projectNo: d.project_no || "",
            date: d.project_date ? d.project_date.split("T")[0] : "",
            clientName: d.client_name || "",
            picName: d.pic_name || "",
            contactNo: d.contact_no || "",
            projectDetails: {
              elevatorType: d.elevator_type || "",
              finishes: d.finishes || "",
              installMethod: d.install_method || "",
              designReq: d.design_req || "",
              buildingStatus: d.building_status || "",
              others: d.project_others || ""
            },
            mobilization: {
              toolbox: !!d.toolbox,
              qaqc: !!d.qaqc,
              drawing: !!d.drawing,
              manual: !!d.installation_manual
            },
            program: {
              startDate: d.start_date ? d.start_date.split("T")[0] : "",
              schedule: d.project_schedule || "",
              completionDate: d.completion_date ? d.completion_date.split("T")[0] : "",
              manpower: d.manpower || "",
              tools: d.tools || "",
              others: d.program_others || ""
            },
            otherReq: {
              lodging: d.lodging || "",
              others: d.other_req || ""
            },
            signatures: ["", "", ""] // not stored yet
          });
        }
      } catch (err) {
        console.error("Error loading checklist:", err);
      }
    };

    fetchChecklist();
  }, [projId, backendURL]);

  const handleChange = (e, section, field, index = null) => {
    const { name, value, type, checked } = e.target;

    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value
        }
      }));
    } else if (section === "signatures") {
      const updated = [...formData.signatures];
      updated[index] = value;
      setFormData((prev) => ({ ...prev, signatures: updated }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.put(`${backendURL}/projects/kickoff/${projId}`, formData);
      console.log("Saved:", res.data);
      alert("Form saved successfully!");
    } catch (err) {
      console.error("Error saving form:", err);
      alert("Failed to save form.");
    }
  };

  return (
    <form className="checklist-form" onSubmit={handleSubmit}>
      <h1>KICK-OFF MEETING AGENDA CHECKLIST</h1>

      {/* Project Info */}
      <div className="section">
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
          />
        </label>
        <label>
          Site Address:
          <input
            type="text"
            name="siteAddress"
            value={formData.siteAddress}
            onChange={handleChange}
          />
        </label>
        <label>
          Project No:
          <input
            type="text"
            name="projectNo"
            value={formData.projectNo}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Client Name:
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
          />
        </label>
        <label>
          P.I.C Name:
          <input
            type="text"
            name="picName"
            value={formData.picName}
            onChange={handleChange}
          />
        </label>
        <label>
          Contact No.:
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Project Details */}
      <h3>1. PROJECT DETAILS</h3>
      <div className="section">
        <input
          type="text"
          placeholder="Elevator Type and Capacity"
          value={formData.projectDetails.elevatorType}
          onChange={(e) => handleChange(e, "projectDetails", "elevatorType")}
        />
        <input
          type="text"
          placeholder="Finishes"
          value={formData.projectDetails.finishes}
          onChange={(e) => handleChange(e, "projectDetails", "finishes")}
        />
        <input
          type="text"
          placeholder="Installation Method"
          value={formData.projectDetails.installMethod}
          onChange={(e) => handleChange(e, "projectDetails", "installMethod")}
        />
        <input
          type="text"
          placeholder="Design Requirements (BMS, CCTV, etc.)"
          value={formData.projectDetails.designReq}
          onChange={(e) => handleChange(e, "projectDetails", "designReq")}
        />
        <input
          type="text"
          placeholder="Building Status"
          value={formData.projectDetails.buildingStatus}
          onChange={(e) => handleChange(e, "projectDetails", "buildingStatus")}
        />
        <textarea
          placeholder="Others..."
          value={formData.projectDetails.others}
          onChange={(e) => handleChange(e, "projectDetails", "others")}
        />
      </div>

      {/* Mobilization */}
      <h3>2. MOBILIZATION KIT</h3>
      <div className="section checklist">
        <label>
          <input
            type="checkbox"
            checked={formData.mobilization.toolbox}
            onChange={(e) => handleChange(e, "mobilization", "toolbox")}
          />
          Safety Toolbox Meeting (Docs Provided)
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.mobilization.qaqc}
            onChange={(e) => handleChange(e, "mobilization", "qaqc")}
          />
          QA/QC Checklist (Docs Provided)
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.mobilization.drawing}
            onChange={(e) => handleChange(e, "mobilization", "drawing")}
          />
          Installation Drawing (Inside Crates)
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.mobilization.manual}
            onChange={(e) => handleChange(e, "mobilization", "manual")}
          />
          Installation Manual (Inside Crates)
        </label>
      </div>

      {/* Program */}
      <h3>3. PROGRAM</h3>
      <div className="section">
        <label>
          Target Start Date:
          <input
            type="date"
            value={formData.program.startDate}
            onChange={(e) => handleChange(e, "program", "startDate")}
          />
        </label>
        <label>
          Installation Schedule:
          <input
            type="text"
            value={formData.program.schedule}
            onChange={(e) => handleChange(e, "program", "schedule")}
          />
        </label>
        <label>
          Target Completion Date:
          <input
            type="date"
            value={formData.program.completionDate}
            onChange={(e) => handleChange(e, "program", "completionDate")}
          />
        </label>
        <input
          type="text"
          placeholder="Manpower Planning"
          value={formData.program.manpower}
          onChange={(e) => handleChange(e, "program", "manpower")}
        />
        <input
          type="text"
          placeholder="Tools and Materials Request"
          value={formData.program.tools}
          onChange={(e) => handleChange(e, "program", "tools")}
        />
        <textarea
          placeholder="Others..."
          value={formData.program.others}
          onChange={(e) => handleChange(e, "program", "others")}
        />
      </div>

      {/* Other Requirements */}
      <h3>4. OTHER REQUIREMENTS</h3>
      <div className="section">
        <input
          type="text"
          placeholder="Board & Lodging, Allowances"
          value={formData.otherReq.lodging}
          onChange={(e) => handleChange(e, "otherReq", "lodging")}
        />
        <textarea
          placeholder="Others..."
          value={formData.otherReq.others}
          onChange={(e) => handleChange(e, "otherReq", "others")}
        />
      </div>

      {/* Signatures */}
      <h3>Signatures</h3>
      <div className="section">
        {formData.signatures.map((sig, i) => (
          <label key={i}>
            Name {i + 1}:
            <input
              type="text"
              value={sig}
              onChange={(e) => handleChange(e, "signatures", null, i)}
            />
          </label>
        ))}
      </div>

      <button type="submit" className="submit-btn">
        Submit Form
      </button>
    </form>
  );
}
