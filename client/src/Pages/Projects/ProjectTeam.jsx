import React, { useState, useEffect } from 'react'
import '../../css/ProjectTeam.css'
import { Grid } from 'ldrs/react'
import { Axios } from '../../api/axios'

const ProjectTeam = ({teamInfo, proj, teamTechs, projId}) => {
    const[teamMIds, setTeamMIds] = useState([])
    const[pic, setPIC] = useState(null)
    
    console.log(teamTechs)
    console.log(teamInfo)
    
    // ADD GUARDS: Safe access to arrays
    const teamInfoArray = Array.isArray(teamInfo) ? teamInfo : [];
    const teamTechsArray = Array.isArray(teamTechs) ? teamTechs : [];
    
    // Get Foreman safely
    const Foreman = teamInfoArray.length > 0 ? teamInfoArray[0] : null;
    
    console.log(teamMIds)
    
    // Get unique team composition safely
    const teamComposition = teamTechsArray.length > 0 ? teamTechsArray[0] : null;
    
    console.log(teamInfoArray)

    // Group team members by job role SAFELY
    const groupedTeamMembers = {};
    if (teamTechsArray.length > 0) {
        teamTechsArray.forEach(member => {
            const job = member.job || 'Unassigned';
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
        if (teamInfoArray.length > 0) {
            const eIds = teamInfoArray.map(t => {
                return {
                    id: t.emp_id,
                    fullname: t.e_fullname,
                    job: t.job
                }
            })
            const fId = teamInfoArray[0].foreman_id
            const fname = teamInfoArray[0].Foreman
            const ids = [...eIds, {id: fId, fullname: fname, job: 'Foreman'}]
            setPIC(proj?.project_PIC || null)
            setTeamMIds(ids)            
        }
    }, [teamInfoArray, proj])

    console.log(groupedTeamMembers)

    // ADD LOADING STATE
    if (!teamInfo && !teamTechs) {
        return (
            <div className='ProjectTeam'>
                <div className="loading-state">
                    <Grid size="60" speed="1.5" color="#315a95"></Grid>
                    <p>Loading team information...</p>
                </div>
            </div>
        )
    }

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
                            {Array.isArray(teamMIds) && teamMIds.map((type) => (
                                <option key={`M-${type.id}`} value={type.id}>
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
                {teamInfoArray.filter(m => m.job === 'Skilled Installer').length > 0 && (
                    <div className="team-section">
                        <h5>Skilled Installer(s)</h5>
                        {teamInfoArray.filter(m => m.job === 'Skilled Installer').map((m, index) => (
                            <div key={index} className="team-members-list">
                                <div className="member-name">{m.e_fullname}</div> 
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Installers by Job Type */}
                {teamInfoArray.filter(m => m.job === 'Installer').length > 0 && (
                    <div className="team-section">
                        <h5>Installers</h5>
                        {teamInfoArray.filter(m => m.job === 'Installer').map((m, index) => (
                            <div key={index} className="team-members-list">
                                <div className="member-name">{m.e_fullname}</div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Empty State */}
            {(teamTechsArray.length === 0 && teamInfoArray.length === 0) && (
                <div className="empty-state">
                    <p>No team information available for this project.</p>
                </div>
            )}
        </div>
    )
}

export default ProjectTeam