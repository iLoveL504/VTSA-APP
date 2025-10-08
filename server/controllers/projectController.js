import { ProjectModel as projects } from '../model/ProjectModel.js'


export const getProjects = async (req, res) => {
    const results = await projects.getAllProjects()
    res.json(results)
}

export const findProject = async (req, res) => {
    console.log('i run ')
    const results = await projects?.findById(req.params.id)
    //console.log(results)
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
    const { taskUpdates } = req.body
    const { percentCompleted } = req.body
    const { id } = req.params
    try {
        const results = await projects.completeTask(taskUpdates, percentCompleted, Number(id))
        res.json(results)
    } catch (e) {
        console.error("Error updating project task:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }

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
    console.log(req.body)
    await projects.updateProjectStatus(req.body)
    // console.log(results)
    res.status(200).json({
        success: true,
        message: "Schedule saved successfully!",
    });
}

export const getDailyReport = async (req, res) => {
    try {
        const results = await projects.retrieveProjectReport(Number(req.params.id))
        res.status(200).json(
            results
        );
    } catch (e) {
         console.log(e)
    }
}

export const sendDailyReport = async (req, res) => {

    try {
        console.log(req.body)
        await projects.submitProjectReport(req.body, req.files, Number(req.params.id))
        res.status(200).json({
            success: true,
            message: "Report saved successfully!",
        });
    } catch (e) {
        console.log(e)
    }
}

export const getProjectAccomplishment = async (req, res) => {
    const {id} = req.params
    try {
        const results =  await projects.retrieveProjectAccomplishment(Number(id))
     
        res.status(200).json(results);
    } catch (e) {
        console.log(e)
    }
}

export const fillKickOffChecklist = async (req, res) => {
  const { id } = req.params;
  try {
    await projects.fillKickOffChecklist(req.body, Number(id));

    res.status(200).json({
      success: true,
      message: "Kick-off checklist saved successfully!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error saving checklist." });
  }
};

export const getKickOffChecklist = async (req, res) => {
  const { id } = req.params; // project_id
    console.log(id)
  try {
    const rows = await projects.getKickOffChecklist(Number(id))
    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching checklist:", error);
    res.status(500).json({ success: false, message: "Error fetching checklist" });
  }
};

export const getPTNCChecklist = async (req, res) => {
    const {id} = req.params
    try {
        const results = await projects.getPTNCChecklist(Number(id))
        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching checklist" });
    }
}

export const fillPTNCChecklist = async (req, res) => {
  const { id } = req.params;
  try {
    await projects.fillPTNCChecklist(Number(id), req.body);

    res.status(200).json({
      success: true,
      message: "Kick-off checklist saved successfully!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error saving checklist." });
  }
}
