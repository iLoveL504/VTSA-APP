import { TeamModel as teams } from '../model/TeamModel.js'

export const getAllTeams = async (req, res) => {
    const results = await teams.getAllTeams()
  
    res.json(results).status(200)
}
export const getLastTeamId = async (req, res) => {
    const results = await teams.getLastTeamId()
  
    res.json(results).status(200)
}
export const getTeamPerId = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await teams.getTeamPerId(Number(id));
        res.status(200).json(results);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTeamDesignation = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await teams.getTeamDesignation(Number(id))
        console.log(id)
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const forecastTeam = async (req, res) => {
    try {
        console.log('hi')
        const { manufacturing_end_date } = req.body;
        console.log(manufacturing_end_date)
        const results = await teams.forecastTeam(manufacturing_end_date)
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTeamsWithNoProject = async (req, res) => {
    try {
        const results = await teams.getTeamsWithNoProject()
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getNotAssignedPE = async (req, res) => {
    try {
        const results = await teams.getNotAssignedPE()
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const assignTeam = async (req, res) => {
    const {
        projId,
        ProjectEngineer,
        Team: {members}
    } = req.body
    const pe = {
        employee_id: ProjectEngineer.employee_id,
        full_name: `${ProjectEngineer.first_name} ${ProjectEngineer.last_name}`,
        job: ProjectEngineer.job
    }
    const foreman = members.find(m => m.job === 'Foreman')
    // console.log(foreman.employee_id)
    members.push(pe)
    const memberIds = members.map(m => m.employee_id)
    // console.log(memberIds)
    // console.log(pe.employee_id)

    try {
        const results = await teams.assignTeam(pe.employee_id, foreman.employee_id, memberIds, projId)
        res.status(200).json({
            success: true,
            message: "Schedule saved successfully!",
            results
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
