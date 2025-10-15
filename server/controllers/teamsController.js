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
        console.log('hii')
        const results = await teams.getTeamPerId(Number(id));
        console.log(results)
        res.status(200).json(results);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTeamDesignation = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await teams.getTeamDesignation(Number(id))
     
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const forecastTeam = async (req, res) => {
    try {
  
        const { manufacturing_end_date } = req.body;
    
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
        console.log('hii')
        const results = await teams.getNotAssignedPE()
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const assignTeam = async (req, res) => {
    
    const {
        projId,
        id
    } = req.body
    console.log('here in assign team')
    console.log(req.body)
    try {
    
        const results = await teams.assignTeam(Number(projId), Number(id))
        res.status(200).json({
            success: true,
            message: "Project Engineer Assigned"
        });
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
