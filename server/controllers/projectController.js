import { ProjectModel as projects } from '../model/ProjectModel.js'

export const getProjects = async (req, res) => {
    const results = await projects.getAllProjects()
    res.json(results)
}

export const findProject = async (req, res) => {
    const results = await projects?.findById(req.params.id)
    res.json(results)
}

export const createProject = async (req, res) => {
    await projects.createProject(req.body)
    console.log('project created')
    const results = await projects.getAllProjects()
    res.status(200).json(results)
}
export const updateProject = async (req, res) => {
    try{
        const results = await projects.updateProjects(req.body)
        if (results.length === 0) return res.status(404).json({"message": "not found"})
        res.json({"message": "found"})
    } catch (e) {
        console.error("Error updating project:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }

    
}
const deleteProject = async (req, res) => {

}

export const makeProjectSchedule = async (req, res) => {
    const { id } = req.params
    try{
        console.log(id)
        console.log(req.body.date.length)
        projects.makeProjectSchedule(Number(id), req.body.date)
    } catch (e) {
        console.error("Error making project schedule:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }

}

export const getProjectSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const results = await projects.getProjectSchedule(Number(id))
         if (results.length === 0) return res.status(404).json({"message": "not found"})
            console.log(results)
        res.json(results)
    } catch (e) {
        console.error("Error making project schedule:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }
}
export const completeTask = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const { task } = req.body
    console.log(task)
    try {
        const results = await projects.completeTask(task, Number(id))
        res.json(results)
    } catch (e) {
        console.error("Error updating project task:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }
}