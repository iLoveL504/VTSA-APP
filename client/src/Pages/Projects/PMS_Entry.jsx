import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "../../api/axios";

const PMS_Entry = () => {
  const { projId } = useParams();
  const backendURL = import.meta.env.VITE_BACKENDURL || "http://localhost:4000";

  const [contractType, setContractType] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractType) {
      setStatusMsg("Please fill out all fields before saving.");
      return;
    }

    setSaving(true);
    setStatusMsg("");

    try {
      const payload = {
        contract_type: contractType,
      };
      console.log(payload)
      const response =  await Axios.put(`${backendURL}/pms/${projId}`, payload);
      console.log(response)
      setStatusMsg("Preventive Maintenance Service entry saved successfully!");
    } catch (err) {
      console.error("Error saving PMS entry:", err);
      setStatusMsg("Error saving PMS entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Content PMS_Entry">
      <h2>Preventive Maintenance Service (PMS) Entry</h2>

      <form onSubmit={handleSubmit} className="pms-form">
        <div className="form-row">
          <label>Contract Type:</label>
          <select
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save PMS Entry"}
          </button>
        </div>

        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </form>
    </div>
  );
};

export default PMS_Entry;
