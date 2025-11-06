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
        console.log(results)
        res.status(200).json(results);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const assignProjPIC = async (req, res) => {
    const {id} = req.params
    const {picId} = req.body
    try {
        await teams.assignPIC(Number(id), picId)
        res.status(200).json({
            success: true,
            message: "Project Engineer Assigned"
        });        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

export const editTeam = async (req, res) => {
    try {
        const { id } = req.params
        const {editedTeam} = req.body
        console.log('---------------eidt team -------')
        console.log(editedTeam)
        await teams.editTeam(Number(id), editedTeam)
                res.status(200).json({
            success: true,
            message: "Project Engineer Assigned"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

export const getCompositionPerId = async (req, res) => {
    try {
        const {id} = req.params
        const results = await teams.getProjectManpowerById(Number(id));
        console.log(results)
        res.status(200).json(results);        
    } catch (err) {
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

export const getProjectManpower = async (req, res) => {
        try {
        const results = await teams.getProjectManpower()
        res.status(200).json(results);
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

export const getTncTechProjects = async (req, res) => {
        try {
        const results = await teams.tncTechProjects()
        res.status(200).json(results);
    } catch (error) {

        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
export const getqaqcTechProjects = async (req, res) => {
        try {
        const results = await teams.qaqcTechProjects()
        res.status(200).json(results);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
