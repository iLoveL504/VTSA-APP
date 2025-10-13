import React, { useState } from "react";
import { Axios } from "../../api/axios";
import { useParams } from "react-router-dom";
import '../../css/SchneiderServiceReport.css'

const SchneiderServiceReport = () => {
 // const backendURL = import.meta.env.VITE_BACKENDURL || "http://localhost:4000";
  const { projId } = useParams();
  const [saving, setSaving] = useState(false);

  const STATUS_OPTIONS = [
    { value: "", label: "Select" },
    { value: "GOOD", label: "Good Condition" },
    { value: "REPAIR", label: "Need to Repair" },
    { value: "REPLACE", label: "Need to Replace" },
  ];

  const initialState = {
    project_name: "",
    project_number: "",
    address: "",
    equipment_type: "",
    rated_load_capacity: "",
    speed: "",
    service_schedule: "",
    floors_openings: "",
    sections: {
      machine_room: {
        items: [
          "Inspect MOTOR running condition, noise, and excessive vibration",
          "Inspect and Measured Wire Rope operational diameter",
          "Check feedback rotary encoder against unnecessary vibration",
          "Inspect main drive secondary pulleys, bearings, and oil rings",
          "Inspect Braking System (Brake Coil, Pads, & linings)",
          "Inspect and Test Governor Safety if normally functioning",
          "Check-up Traction Machine’s Oil Gauge (use only Approved oil)",
          "Inspect and Re-tight Machine room bed/base Bolts and Nuts",
          "Maintain Cleanliness of Machine Room",
        ],
        statuses: Array.from({ length: 9 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
      control_panel: {
        items: [
          "Inspect Electrical & Electronic Components (transformer, contactors, breakers, main board, inverter, etc)",
          "Check Ventilation fan if functional (temp. must be less than 45°C)",
          "Inspect for loose wires, bolts, nuts, terminals fittings",
          "Check and Test Emergency communication system (intercom, alarm indicator, AVR, ELD, etc)",
          "Check if functional additional features (Remote Monitoring, CCTV, Voice announcer, etc) IF AVAILABLE",
        ],
        statuses: Array.from({ length: 5 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
      hoistway_shaft: {
        items: [
          "Ensure alignment, lubricate, and calibrate Door mechanisms, rollers, guide shoes, counterweights, interlocks, cables, safety switches, and related components",
          "Run and Test adjustments of leveling in all Landing Floors (leveling error must not exceed 5mm)",
          "Ensure Entrance sill allowable clearances",
          "Inspect and ensure Wire rope degree of tightness and tensions",
          "Check and test compensating chain against vibration while the Elevator Unit is in motion",
          "Check and test Top & Bottom limit and Terminal switches if functional",
          "Inspect Hoist way wiring cable tray/raceway holders and fixtures",
        ],
        statuses: Array.from({ length: 7 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
      elevator_car: {
        items: [
          "Check and monitor leveling sensors response if acceptable",
          "Inspect and test monitor car door system, door motor, drives and other connected parameters",
          "Check and test landing Gong, overload alarms, and emergency stop button if all functional",
          "Check and test curtain sensors if acceptable on-time",
          "Cleanliness of Car Top and interior",
        ],
        statuses: Array.from({ length: 5 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
      elevator_pit: {
        items: [
          "Check and monitor spring buffer switch emergency stop switch, and governor switch if all activated",
          "Cleaning of Pit",
        ],
        statuses: Array.from({ length: 2 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
      others: {
        items: [
          "Observe Elevator running parameters, acceleration, deceleration, and high-speed running condition if normally functioning",
          "Observe Elevator Door opening, and closing delay if acceptable",
          "Observe Hall, Car button, and Digital indicators if all functional",
          "Check and Test Safety & Emergency Switch if activated (By-pass is not allowed)",
        ],
        statuses: Array.from({ length: 4 }, () => ({ status: "", remarks: "" })),
        remarks: "",
      },
    },
    motor_readings: {
      l1_l2: "",
      l2_l3: "",
      l3_l1: "",
      brake_coil_voltage: "",
      door_motor_voltage: "",
      other_notes: "",
    },
    final_remarks: "",
    signatures: {
      contractor_supervisor: { name: "", signature: "", date: "" },
      owner_client: { name: "", signature: "", date: "" },
    },
  };

  const [form, setForm] = useState(initialState);

  // ✅ Handlers
  const setTopLevel = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setSectionStatus = (sectionKey, index, field, value) =>
    setForm((prev) => {
      const newSections = { ...prev.sections };
      const statuses = [...newSections[sectionKey].statuses];
      statuses[index] = { ...statuses[index], [field]: value };
      newSections[sectionKey].statuses = statuses;
      return { ...prev, sections: newSections };
    });
  const setSectionRemarks = (sectionKey, value) =>
    setForm((prev) => ({ ...prev, sections: { ...prev.sections, [sectionKey]: { ...prev.sections[sectionKey], remarks: value } } }));
  const setMotorReading = (field, value) =>
    setForm((prev) => ({ ...prev, motor_readings: { ...prev.motor_readings, [field]: value } }));
  const setSignature = (role, field, value) =>
    setForm((prev) => ({ ...prev, signatures: { ...prev.signatures, [role]: { ...prev.signatures[role], [field]: value } } }));

  // ✅ POST instead of PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Axios.post(`/api/projects/checklist-schneider/${projId}`, {
        items_json: JSON.stringify(form),
      });
      alert("Service report submitted successfully.");
      setForm(initialState); // optional reset
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Error submitting report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Content SchneiderServiceReport">
      <h1>Schneider Elevator Service Report (SESR)</h1>
      <form onSubmit={handleSubmit}>
        {/* — Top Info — */}
        <div className="basic-info">
          <label>
            Date of Preventive Maintenance Service:
            <input type="date" value={form.service_date || ""} onChange={(e) => setTopLevel("service_date", e.target.value)} />
          </label>
          <label>
            Equipment Type:
            <input type="text" value={form.equipment_type} onChange={(e) => setTopLevel("equipment_type", e.target.value)} />
          </label>
          <label>
            Project Name:
            <input type="text" value={form.project_name} onChange={(e) => setTopLevel("project_name", e.target.value)} />
          </label>
          <label>
            Project Number:
            <input type="text" value={form.project_number} onChange={(e) => setTopLevel("project_number", e.target.value)} />
          </label>
          <label>
            Address / Location:
            <input type="text" value={form.address} onChange={(e) => setTopLevel("address", e.target.value)} />
          </label>
          <label>
            Rated Load Capacity / Speed:
            <input type="text" value={form.rated_load_capacity} onChange={(e) => setTopLevel("rated_load_capacity", e.target.value)} />
          </label>
          <label>
            Mode of Service Schedule:
            <select value={form.service_schedule} onChange={(e) => setTopLevel("service_schedule", e.target.value)}>
              <option value="">Select</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </label>
          <label>
            No. of Floors / Openings:
            <input type="text" value={form.floors_openings} onChange={(e) => setTopLevel("floors_openings", e.target.value)} />
          </label>
        </div>

        {/* — Checklist Sections — */}
        {Object.entries(form.sections).map(([sectionKey, sectionData]) => (
          <section key={sectionKey}>
            <h3>{formatSectionTitle(sectionKey)}</h3>
            {sectionData.items.map((desc, idx) => {
              const current = sectionData.statuses[idx] || { status: "", remarks: "" };
              return (
                <div className="table-row" key={idx}>
                  <div>{desc}</div>
                  <select value={current.status} onChange={(e) => setSectionStatus(sectionKey, idx, "status", e.target.value)}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={current.remarks}
                    onChange={(e) => setSectionStatus(sectionKey, idx, "remarks", e.target.value)}
                    placeholder="Remarks"
                  />
                </div>
              );
            })}
            <textarea placeholder="Section Remarks" value={sectionData.remarks} onChange={(e) => setSectionRemarks(sectionKey, e.target.value)} />
          </section>
        ))}

        {/* — Motor Parameters — */}
        <section>
          <h3>Motor Parameters Reading (Voltage)</h3>
          {["l1_l2", "l2_l3", "l3_l1", "brake_coil_voltage", "door_motor_voltage", "other_notes"].map((field) => (
            <label key={field}>
              {field.replace(/_/g, " ").toUpperCase()}:
              <input type="text" value={form.motor_readings[field]} onChange={(e) => setMotorReading(field, e.target.value)} />
            </label>
          ))}
        </section>

        {/* — Final Remarks — */}
        <section>
          <label>Final Remarks:</label>
          <textarea value={form.final_remarks} onChange={(e) => setTopLevel("final_remarks", e.target.value)} />
        </section>

        {/* — Signatures — */}
        <section>
          <h3>Signatures</h3>
          {Object.entries(form.signatures).map(([role, sig]) => (
            <div key={role}>
              <label>{role.replace("_", " ").toUpperCase()}</label>
              <input type="text" placeholder="Name" value={sig.name} onChange={(e) => setSignature(role, "name", e.target.value)} />
              <input type="text" placeholder="Signature" value={sig.signature} onChange={(e) => setSignature(role, "signature", e.target.value)} />
              <input type="date" value={sig.date} onChange={(e) => setSignature(role, "date", e.target.value)} />
            </div>
          ))}
        </section>

        <button type="submit" disabled={saving}>
          {saving ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

function formatSectionTitle(key) {
  switch (key) {
    case "machine_room":
      return "I. MACHINE ROOM";
    case "control_panel":
      return "II. CONTROL PANEL";
    case "hoistway_shaft":
      return "III. HOISTWAY / SHAFT COMPONENTS";
    case "elevator_car":
      return "IV. ELEVATOR CAR (TOP & INSIDE)";
    case "elevator_pit":
      return "V. ELEVATOR PIT";
    case "others":
      return "VI. OTHERS";
    default:
      return key;
  }
}

export default SchneiderServiceReport;
