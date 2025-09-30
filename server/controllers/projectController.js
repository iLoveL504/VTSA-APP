import { ProjectModel as projects } from '../model/ProjectModel.js'

export const getProjects = async (req, res) => {
    const results = await projects.getAllProjects()
    res.json(results)
}

export const findProject = async (req, res) => {
    console.log('i run ')
    const results = await projects?.findById(req.params.id)
    res.json(results)
}

export const createProject = async (req, res) => {
    try {
    await projects.createProject(req.body)
    console.log('projec')

    const [projectId] = await projects.findByName(req.body.liftName)
    if (!projectId) return res.status(404).json({"message": "not found"})
        res.status(200).json({
            success: true,
            message: "Schedule saved successfully!",
            projectId // optional: send results back if you want
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Internal Server Error" });
    }

       
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

const updateStatus = async (req, res) => {
    try {

    } catch (e) {
        
    }
}

export const getProjectSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const results = await projects.getProjectSchedule(Number(id))
         if (results.length === 0) return res.status(404).json({message: "not found", scheduleExists: false})
        console.log('project schedule')
        res.json(results)
    } catch (e) {
        console.error("Error making project schedule:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }
}
export const completeTask = async (req, res) => {
    const { id } = req.body
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
    console.log(req.body)
}

export const makeProjectSchedule = async (req, res) => {
    const {id} = req.params
    console.log('lalabas dto')
    try {
        const results = await projects.makeProjectSchedule(req.body.tasks, id)
        
        //console.log(results)
        res.status(200).json({
            success: true,
            message: "Project saved successfully!",
            results // optional: send results back if you want
        });
    } catch (e) {
        console.error("Error updating project task:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProjectStatus = async (req, res) => {
    console.log('update project status')
    await projects.updateProjectStatus(req.body)
    res.status(200).json({
        success: true,
        message: "Schedule saved successfully!",
    });
}
