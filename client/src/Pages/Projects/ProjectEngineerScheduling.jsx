import React from 'react'
import { DatePickerInput } from '@mantine/dates'
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

const ProjectEngineerScheduling = ({ 
    qaqcDate, 
    setQaqcDate, 
    tncDate, 
    setTncDate, 
    pmsDate,
    setPmsDate,
    qaqcReason, 
    handleQaqcReason, 
    qaqcReasons, 
    handleScheduleQAQC, 
    handleScheduleTNC, 
    handleSchedulePMS,
    saveStatus,
    includeTncSchedule,
    proj
}) => {
    return (
        <div className="scheduling-sections">
            <div className="schedule-section">
            {proj.qaqc_ongoing === 0 ? (
                    <>
                            <div className="section-header">
                                <h4>Schedule QAQC Inspection</h4>
                            </div>
                            <div className="schedule-content">
                                <div className="schedule-input-group">
                                    <DatePickerInput
                                        label="Select QAQC Date"
                                        placeholder="Pick date"
                                        value={qaqcDate}
                                        onChange={setQaqcDate}
                                        className="date-picker"
                                    />
                                </div>
                                <div className="schedule-input-group">
                                    <FormControl className="form-control-professional" size="small">
                                        <InputLabel id="qaqc-reason-label">Inspection Reason</InputLabel>
                                        <Select
                                            labelId="qaqc-reason-label"
                                            id="qaqc-reason-select"
                                            value={qaqcReason}
                                            label="Inspection Reason"
                                            onChange={handleQaqcReason}
                                        >
                                            {qaqcReasons.map((r, index) => (
                                                <MenuItem value={r} key={index}>{r}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <button 
                                    className="schedule-btn"
                                    onClick={handleScheduleQAQC}
                                    disabled={saveStatus === 'saving'}
                                >
                                    Schedule QAQC Inspection
                                </button>
                            </div>  
                    </>
                ) : (
                    <>
                        Ongoing QAQC Inspection
                    </>
                )}
            </div>


            {includeTncSchedule && (
                <div className="schedule-section">
                    {proj.tnc_assign_date === null ? (
                        <>
                            <div className="section-header">
                            <h4>Schedule Testing & Commissioning</h4>
                            </div>
                            <div className="schedule-content">
                                <div className="schedule-input-group">
                                    <DatePickerInput
                                        label="Select T&C Date"
                                        placeholder="Pick date"
                                        value={tncDate}
                                        onChange={setTncDate}
                                        className="date-picker"
                                    />
                                </div>
                                <button 
                                    className="schedule-btn"
                                    onClick={handleScheduleTNC}
                                    disabled={saveStatus === 'saving'}
                                >
                                    Schedule T&C Inspection
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            Ongoing TNC Schedule
                        </>
                    )}

                </div>                
            )}   
    
            {includeTncSchedule && (
                <div className="schedule-section">
                    {(proj.pms_joint_inspection === null) ? (
                        <>
                            <div className="section-header">
                            <h4>Schedule PMS (Preventive Maintenance Service) for  final inspection</h4>
                            </div>
                            <div className="schedule-content">
                                <div className="schedule-input-group">
                                    <DatePickerInput
                                        label="Select PMS Date"
                                        placeholder="Pick date"
                                        value={pmsDate}
                                        onChange={setPmsDate}
                                        className="date-picker"
                                    />
                                </div>
                                <button 
                                    className="schedule-btn"
                                    onClick={handleSchedulePMS}
                                    disabled={saveStatus === 'saving'}
                                >
                                    Schedule PMS Inspection
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            {proj.pms_ongoing ? 'Ongoing PMS Checking' :
                            proj.pms_is_assigned ?  `PMS Technician will conduct inspection at ${new Date(proj.pms_joint_inspection).toLocaleDateString('en-GB')}` : 'PMS Inspection'}
                        </div>
                    )}

                </div>                
            )}                    

        </div>
    )
}

export default ProjectEngineerScheduling