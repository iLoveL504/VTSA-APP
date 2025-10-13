import React, { useState, useEffect } from 'react';
import { Axios } from '../../api/axios'
import { useParams } from 'react-router-dom';

const QAQC_Checklist = () => {
  const backendURL = import.meta.env.VITE_BACKENDURL || 'http://localhost:4000'
  const {projId} = useParams()
  console.log(projId)
    const [loading, setLoading] = useState(true);

  const checklistItems = [
    // With Machine Room (MMR) – 0 to 14
    "Machine Room must be free from obstruction and working condition must be acceptable",
    "Temporary or permanent lighting must be available within Machine Room",
    "Machine Room door must be lockable (Permanent/Temporary)",
    "Power supply for the equipment and grounding system must be acceptable based on the approved specification (Permanent/Temporary)",
    "The transformer, AVR (if included), traction machine and controller must be properly installed based on the installation plan or in the approved location",
    "Steel plate must be installed properly under the bearing beam (concrete shaft) before concrete pouring",
    "Rebar connection to steel plate and bearing beam must be properly installed before concrete pouring (Optional)",
    "Bearing beam must be 20mm longer from the center of the bearing wall and should not less than 75mm embedded from the bearing wall (can be pedestal or wall)",
    "The traction machine cover/guard must properly installed",
    "The motor manual drive wheel must be properly mounted on the safe area near the traction motor that can easily be access",
    "All welded portions must be quality assured, cleaned and painted",
    "The Traction motor must be lubricated according to specs (If applicable)",
    "The hoisting ropes must properly installed with termination clips/U bolts and 5mm height deference from every rope socket",
    "The speed governor must safely have anchored at MR flooring, sheave vertical deviation must not greater that 5mm, tensioner must be installed at PIT, ropes must have installed in cross-head arc with 3 termination clips and vertical error must not greater than 5mm",
    "The machine bolt retainers/safety wires must properly installed (if required)",

    // Machine Room Less (MRL) – 15 to 22
    "Steel plate must be install properly under the bearing beam (concrete shaft) before concrete pouring",
    "Rebar connection to steel plate and bearing beam must be properly installed before concrete pouring (Optional)",
    "Bearing beam must be 20mm longer from the center of the bearing wall and should not less than 75mm embedded from the bearing wall",
    "The clearances of machine support from the finished floor must complied to the installation plan",
    "The transformer, AVR (if included) traction machine and controller must be properly installed based on the approved installation location",
    "The power supply for the equipment and grounding system must in accordance the requirement",
    "The hoisting ropes must properly installed with termination clips/U bolts and 5mm height deference from every rope socket",
    "The speed governor must, sheave vertical deviation must not greater than 0.5mm, tensioner must be installed at PIT, ropes must have installed in cross-head arc with 3 termination clips and vertical error must not greater that 5mm",

    // Shaft / Hoistway & Landing – 23 to 36
    "The elevator shaft must free from any obstruction",
    "Landing door jambs must be properly installed with supports or brace",
    "Landing door panel must be properly installed without scratches and locks must be properly working",
    "Landing and car sill running clearance and leveling must provisionary equal left and right 30mm (1mm+-) tolerance",
    "Centerline of landing door must be equal to car door",
    "The entrance sill must be 2-5mm higher than the finish flooring",
    "Door bottom panel distance from sill is to be 3-6mm",
    "Door panel space is no more than 1mm over the whole height after it closed",
    "The sill toe guard must be installed",
    "There must be available signage/warning notice in all landing door openings",
    "The travelling cable hanger must properly Installed",
    "The traveling cable must be installed and laid properly without possible coalition between the mechanical moving parts",
    "All welding spots must be cleaned without the presence of flux and properly painted",
    "All grouting works must be properly coordinated",

    // CAR, MAIN & CWT Rail – 37 to 67
    "Car platform must be provisionally aligned, bolt must properly have tightened and the balancing rod/pin must be installed",
    "Car platform and door centerline must be provisionally equal to the landing door",
    "Car panels must properly installed without scratches and bolts must properly tightened",
    "Car ceiling must properly installed and aligned without scratches",
    "Hit bow must be properly installed",
    "Car and landing door panel space is no more than 1mm over the whole height after it closed",
    "Car door bottom panel distance from sill is to be 3-6mm",
    "The COP must properly installed",
    "Car top Box must properly installed",
    "Travelling cable arrangement under the platform must be acceptable and presentable",
    "The safety gear must be initially adjusted",
    "The steel wire rope of car door operator must be properly installed and the guiding pulley must be smoothly working",
    "All car and CWT guide shoes/rollers must completely and properly have installed and aligned, 10-12mm distance from guide rail with not greater than 1mm deference on both side vertical plane",
    "The travelling cable hanger under the car must securely installed",
    "The elevator car and counterweight must provisionally balance (Indicate Pieces of CWT initially installed)",
    "The balance block must install properly behind the car",
    "Door key release must properly functioning (hook engagement depth must not less than 7mm and not greater than 8mm)",
    "Car top barricade must properly have installed according to the manual specification",
    "The Car apron/toe guard must properly installed",
    "The CWT diversion sheave cover must be properly installed",
    "CWT lock bracket must be properly installed using the rail clips",
    "The hoisting rope tension must provisionally equal with not greater than 20mm tension",
    "Limit Switch cam must be properly installed opposite side of the governor or in line with the buttons",
    "Inductor or leveling switch and leveling board must be provisionally installed with 8 to 12mm operation distance and 0.5 vertical alignment",
    "Guide rail bracket for car and ctw 1st span must be 300-700mm elevated from the finish floor line of PIT, the next bracket span must be simultaneously 2000mm or not greater than 2500mm until reach the last floor with 300mm distance from OH ceiling (double check as per installation drawing requirement). Ensure the quality of welding, welding flux must be removed before the application of paints.",
    "Guide rail plate jointer must be properly tightened the presence of the lock washer",
    "Guide rail must have at least 2 sets of brackets on every span.",
    "Guide rail alignment/straightness must not greater than 5mm",
    "Guide rail clips must be properly tightened with the presence of the lock washer and shim/spacer for the adjustment purposes",
    "All connecting parts with the provision of bolts must properly tightened",
    "All connecting parts with the provision of welding must properly cleaned and painted without flux",

    // Elevator PIT – 68 to 74
    "The pit buffers must properly have installed, aligned at the center of Car & CWT bottom frame and properly leveled to the PIT flooring with no more than 2mm height deference from the others",
    "Buffer distance from car and CWT is not less than 200mm (check as per plan)",
    "The pit must free from debris and water. It must be water proofed",
    "If any, The compensating device or rollers must installed properly",
    "The governor pulley and tensioner must installed properly and safety circuit must function correctly",
    "The CWT cover must be installed not higher than 300mm from pit flooring",
    "The pit ladder must correctly and safety installed",
    "Compensating chain must be properly installed, the buffer deflation must be considered upon installation"
  ];

  // 2️⃣ Initialize the full 74-item object array
  const [checklistData, setChecklistData] = useState({
    project_id: '',
    project_name: '',
    order_number: '',
    location: '',
    lift_type: '',
    foreman: '',
    general_comments: '',
    foreman_signature: '',
    inspector_signature: '',
    qaqc_signature: '',
    date: new Date().toISOString().split('T')[0],
    items: Array.from({ length: 74 }, () => ({ accepted: '', remarks: '' }))

  });

useEffect(() => {
  const fetchChecklist = async () => {
    try {
      const response = await Axios.get(`${backendURL}/projects/checklist-ptnc/${projId}`);
      const fetched = response.data.data; // ✅ correct level

      console.log("Fetched checklist:", fetched);

      setChecklistData({
        project_id: fetched.project_id || '',
        project_name: fetched.project_name || '',
        order_number: fetched.order_number || '',
        location: fetched.location || '',
        lift_type: fetched.lift_type || '',
        foreman: fetched.foreman || '',
        general_comments: fetched.general_comments || '',
        foreman_signature: fetched.foreman_signature || '',
        inspector_signature: fetched.inspector_signature || '',
        qaqc_signature: fetched.qaqc_signature || '',
        date: fetched.date ? fetched.date.split("T")[0] : new Date().toISOString().split("T")[0],
        items: Array.isArray(fetched.items_json)
          ? fetched.items_json
          : Array.from({ length: 74 }, () => ({ accepted: '', remarks: '' }))
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading checklist:', error);
      setLoading(false);
    }
  };

  fetchChecklist();
}, [projId, backendURL]);


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
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // ✅ Save/Update checklist
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...checklistData,
        items: checklistData.items
      };
      console.log(payload)
      await Axios.put(`${backendURL}/projects/checklist-ptnc/${projId}`, payload);
      alert('Checklist saved successfully!');
    } catch (error) {
      console.error('Error saving checklist:', error);
      alert('Error saving checklist.');
    }
  };

  if (loading) return <div>Loading checklist...</div>;

  // 3️⃣ Define sections with correct index ranges
  const sections = [
    { title: "With Machine Room (MMR)", start: 0, end: 14 },
    { title: "Machine Room Less (MRL)", start: 15, end: 22 },
    { title: "Shaft/Hoistway & Landing", start: 23, end: 36 },
    { title: "CAR, MAIN & CWT Rail", start: 37, end: 67 },
    { title: "Elevator PIT", start: 68, end: 74 }
  ];

if (loading) {
  return (
    <div className="loading-barrier">
      <div className="spinner"></div>
      <p>Loading checklist...</p>
    </div>
  );
}

  return (
    <div className='Content QAQCChecklist'>
      <div className="checklist-header">
        <h1>QA/QC Checklist - Prior Testing and Commissioning</h1>
        <p className="control-number">Control No.: VTSA-RF-0005-21</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Project Info */}
        <div className="form-section basic-info">
          {["project_name", "order_number", "location", "lift_type", "foreman"].map((field, i) => (
            <div className="form-row" key={i}>
              <label>{field.replace(/([A-Z])/g, " $1")}:</label>
              <input
                type="text"
                name={field}
                value={checklistData[field]}
                onChange={handleInputChange}
                
              />
            </div>
          ))}
        </div>

        {/* Checklist Sections */}
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
                   const current = checklistData.items[globalIndex] || { accepted: '', remarks: '' };
                  return (
                    <div key={globalIndex} className="table-row">
                      <div className="col-description">
                        <span className="item-number">{globalIndex + 1}.</span> {item}
                      </div>
                      <div className="col-accepted">
                        <select
                          value={current.accepted}
                          onChange={(e) => handleItemChange(globalIndex, 'accepted', e.target.value)}
                       
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
                          value={current.remarks}
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

        {/* Comments */}
        <div className="form-section comments-section">
          <label>General Comments:</label>
          <textarea
            name="generalComments"
            value={checklistData.generalComments}
            onChange={handleInputChange}
            rows="4"
          ></textarea>
        </div>

        {/* Signatures */}
        <div className="signatures-section">
          <div className="signature-row">
            {[
              { label: "Foreman", name: "foremanSignature" },
              { label: "Inspected by", name: "inspectorSignature" },
              { label: "Conformed by (QA/QC)", name: "qaqcSignature" }
            ].map((sig, i) => (
              <div className="signature-field" key={i}>
                <label>{sig.label}:</label>
                <input
                  type="text"
                  name={sig.name}
                  value={checklistData[sig.name]}
                  onChange={handleInputChange}
               
                />
                <span className="date">Date: {checklistData.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">Save Checklist</button>
          <button type="button" className="print-btn">Print Checklist</button>
        </div>
      </form>
    </div>
  );
};

export default QAQC_Checklist;
