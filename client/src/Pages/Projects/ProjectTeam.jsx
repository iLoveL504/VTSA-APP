import React, { useState, useEffect } from 'react'
import '../../css/ProjectTeam.css'
import { Grid } from 'ldrs/react'
import { Axios } from '../../api/axios'

const ProjectTeam = ({teamInfo, proj, teamTechs, projId}) => {
    const[teamMIds, setTeamMIds] = useState([])
    const[pic, setPIC] = useState(null)
    console.log(teamTechs)
    console.log(teamInfo)
    // Get Foreman
    const Foreman = teamInfo[0]
    console.log(teamMIds)
    // Get unique team composition
    const teamComposition = teamTechs[0] || null;
    console.log(teamInfo)
    // Group team members by job role
    const groupedTeamMembers = {};
 if (teamTechs && teamTechs.length > 0) {
    teamTechs.forEach(member => {
        const job = member.job || 'Unassigned'; // fallback if null/undefined
        if (!groupedTeamMembers[job]) {
            groupedTeamMembers[job] = [];
        }
        groupedTeamMembers[job].push(member);
    });
}

    const handlePICChange = (e) => {
        const value = e.target.value
        
        console.log(value)
        setPIC(value)
    }

    const handleSavePIC = async () => {
        console.log(pic)
        try {
            const response = await Axios.put(`/api/teams/assign-pic/${projId}`, {picId: pic})
            if(!response?.data.success) {
                window.alert('Error updating PIC')
            } else {
                window.alert('PIC Updated')
                window.location.reload()
            }
        } catch (err) {
            console.error(err)
        }

    }

    useEffect(() => {
        if (teamInfo.length !== 0) {
            const eIds = teamInfo.map(t => {
                return {
                    id: t.emp_id,
                    fullname: t.e_fullname,
                    job: t.job
                }
            })
            const fId = teamInfo[0].foreman_id
            const fname = teamInfo[0].Foreman
            const ids = [...eIds, {id: fId, fullname: fname, job: 'Foreman'}]
            setPIC(proj.project_PIC)
            setTeamMIds(ids)            
        }

    }, [teamInfo])

    console.log(groupedTeamMembers)
    return (
        <div className='ProjectTeam'>
            <h3>Project Team Composition</h3>
            
            {/* Team Composition Overview */}
            <div className="team-composition">
                <h4>Key Roles</h4>
                <div className="composition-grid">
                    <div className="role-item">
                        <strong>Project Engineer:</strong>
                        <span>{teamComposition?.pe_fullname || 'Not assigned'}</span>
                    </div>
                    <div className="role-item">
                        <strong>TNC Tech:</strong>
                        <span>{teamComposition?.tnc_fullname || 'Not assigned'}</span>
                    </div>
                    <div className="role-item">
                        <strong>QAQC Tech:</strong>
                        <span>{teamComposition?.qaqc_fullname || 'Not assigned'}</span>
                    </div>
                    <div className="role-item">
                        <strong>PMS Tech:</strong>
                        <span>{teamComposition?.pms_fullname || 'Not assigned'}</span>
                    </div>
                </div>
            </div>

            {/* Installation Team */}
            <div className="installation-team">
                <h4>Installation Team</h4>
                {/* Project In Charge */}
                <div className='team-section'>
                    <h5>Project In Charge</h5>
                    <div>
                  <label htmlFor="equipmentType">Project In Charge</label>
                    <select
                        id="equipmentType"
                        name="equipmentType"
                        value={pic || ''}
                        onChange={handlePICChange}
                        required
                    >
                        <option value=""></option>
                        {teamMIds.map((type) => (
                        <option key={`M-${type.id}`} value={type.id} >
                            {type.fullname}
                        </option>
                        ))}
                    </select>                    
                </div>
                <button onClick={handleSavePIC}>Save Project In-Charge</button>
                </div>
                
                {/* Foreman */}
                {Foreman && (
                    <div className="team-section">
                        <h5>Foreman</h5>
                        <div className="team-member foreman">
                            <span className="member-name">{Foreman.Foreman}</span>
                            <span className="member-username">({Foreman.foreman_id})</span>
                        </div>
                    </div>
                )}
                {/* Skilled Installers */}
                <div className="team-section">
                    <h5>Skilled Installer(s)</h5>
                    {teamInfo.filter(m => m.job === 'Skilled Installer').map((m) => {
                    return (
                            <div className="team-members-list">
                                <div className="member-name">{m.e_fullname}</div> 
                            </div>
                    );
                })}
                </div>
                {/* Installers by Job Type */}
                <div className="team-section">
                    <h5>Skilled Installer(s)</h5>
                    {teamInfo.filter(m => m.job === 'Installer').map((m) => {
                    return (
                            <div className="team-members-list">
                                <div className="member-name">{m.e_fullname}</div>
                            </div>
                    );
                })}
                </div>                


            </div>

            {/* Empty State */}
            {(!teamTechs || teamTechs.length === 0) && (!teamInfo || teamInfo.length === 0) && (
                <div className="empty-state">
                    <p>No team information available for this project.</p>
                </div>
            )}
        </div>
    )
}

export default ProjectTeam