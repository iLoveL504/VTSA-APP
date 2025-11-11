import { pool } from '../config/database.js'
import { ProjectModel as projects } from '../model/ProjectModel.js'


export const getProjects = async (req, res) => {
    const results = await projects.getAllProjects()
    res.json(results)
}

export const findProject = async (req, res) => {
  
    const results = await projects?.findById(Number(req.params.id))
    //console.log(results)
    res.json(results)
}

export const createProject = async (req, res) => {
    try {
    await projects.createProject(req.body, req.files)

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
    console.log('--------------------')
    try {
        const results = await projects.getProjectSchedule(Number(id))
         if (results.length === 0) return res.status(200).json({})
     
        res.json(results)
    } catch (e) {
        console.error("Error making project schedule:", e);
        res.status(500).json({ message: "Internal Server Error" });        
    }
}

export const projectHolidays = async (req, res) => {
    const {id} = req.params
    try {
        const results = await projects.holidaysPerProject(Number(id))
        res.status(200).json(results)
    } catch (err) {
        console.error("Error making project schedule:", e);
        res.status(500).json({ message: "Internal Server Error" });         
    }
}

export const adjustInstallation = async (req, res) => {
    const {id} = req.params
    try {
        await projects.adjustInstallationStart(Number(id), req.body)
        res.status(200).json({
            success: true,
            message: "Project saved successfully!",
        });
    } catch (err) {
        console.error("Error making project schedule:", err);
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
    console.log('make project schedule controller')
   console.log('here in make project schedule')
    try {
        const results = await projects.makeProjectSchedule(req.body, id)
        
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
        console.log('fsfsfs')
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

export const projectContract = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await projects.getContractPhoto(Number(id))
        const photos = results.map(p => p.photo_url)
        res.status(200).json({
            success: true,
            message: "Contract photos",
            data: photos
        });        
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error saving checklist." });        
    }
}

export const foremanApprove = async (req, res) => {
    const { id } = req.params
    try {
        console.log(req.body)
        const { task_id } = req.body
        await projects.foremanApprove(Number(id), req.body, req.files)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

//QAQC Controllers
export const requestProjQAQC = async (req, res) => {
    const { project_id, scheduled_date, reason } = req.body
 
    try {
        await projects.requestProjQAQC(project_id, scheduled_date, reason)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const assignProjQAQC = async (req, res) => {
    try {
        await projects.assignProjQAQC(req.body)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const ongoingProjQAQC = async (req, res) => {
    const { id } = req.params
    console.log('i run')
    try {
        await projects.ongoingProjQAQC(Number(id))
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error ongoing" });         
    }
}

export const completeProjQAQC = async (req, res) => {
    const {id} = req.params
    console.log(req.files)
    console.log(req.body)
    console.log('in complete qaqc')
    try {
        await projects.completeProjQAQC(Number(id), req.body, req.files)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, message: "Error completing" })
    }
}

export const qaqcPunchlisting = async (req, res) => {
    const {id} = req.params
    console.log('reaching punchlist')
    try {
        await projects.qaqcPunchlisting(Number(id), req.files)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, message: "Error completing" })
    }
}

export const rectifyItems = async (req, res) => {
    const {id} = req.params
    console.log('rectifying punchlist')
    try {
        await projects.rectifyItems(Number(id))
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, message: "Error completing" })
    }
}

//TNC Controllers
export const requestProjTNC = async (req, res) => {
    const { project_id, scheduled_date } = req.body
  
    console.log('here in request proj tnc')
    try {
        await projects.requestProjTNC(project_id, scheduled_date)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const assignProjTNC = async (req, res) => {
    const { project_id, tnc_technician_id } = req.body
    
    try {
        await projects.assignProjTNC(project_id, tnc_technician_id)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const ongoingProjTNC = async (req, res) => {
    const { projId } = req.params
    try {
        await projects.ongoingProjTNC(Number(projId))
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error ongoing" });         
    }
}

export const approveProjTaskTNC = async (req, res) => {
    console.log('hihih')
    const { id } = req.params
    try {
        console.log(req.body)
        console.log(req.files)
        console.log(req.files.documents === undefined)
        const { task_id } = req.body
        await projects.approveProjTaskTNC(Number(id), req.body, req.files)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const completeProjTNC = async (req, res) => {
  try {
    const projectId = req.params.id;
    const files = req.files; // multer-uploaded files
    const { document_names } = req.body; // from formData (array of doc types)

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No photos uploaded" });
    }

    // Pass to model for DB insertion
    await projects.completeProjTNC(projectId, files, document_names);

    res.status(200).json({
      message: "TNC completion photos uploaded successfully",
      count: files.length,
    });
  } catch (error) {
    console.error("Error in completeProjTNC controller:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//PMS
export const requestProjPMS = async (req, res) => {
    const { project_id, scheduled_date } = req.body
  
    console.log('here in request proj tnc')
    try {
        await projects.requestProjPMS(project_id, scheduled_date)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const approveProjPMS = async (req, res) => {
    const {id} = req.params
    const {pmsId} = req.body
    try {
        await projects.approveProjPMS(Number(id), pmsId)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }    
}

export const completePMSJoint = async (req, res) => {
    const {id} = req.params
    try {
        await projects.completePMSJoint(Number(id), req.body, req.files)
        res.status(200).json({
            success: true,
            message: "complete"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });   
    }
}

//Handover control transferred to pms
export const prepareProjHandover = async (req, res) => {
    const {id} = req.params
    console.log(req.body)
    console.log(req.files)
    try {
        await projects.prepareProjHandover(Number(id), req.body, req.files)
        res.status(200).json({
            success: true,
            message: "complete"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const getTaskPhotos = async (req, res) => {
    const {id} = req.params
    try {
        const results = await projects.getTaskPhotos(Number(id))
        console.log('line 307')
        res.status(200).json(results)
    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, message: "Error fetching" })
    }
}

export const requestProjHold = async (req, res) => {
    const {id} = req.params
    try {
        await projects.requestProjHold(Number(id))
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const approveProjHold = async (req, res) => {
    const {id} = req.params
    try {
        await projects.approveProjHold(Number(id))
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
}

export const resumeProj = async (req, res) => {
    const {id} = req.params
    try {
        const result = await projects.resumeProject(Number(id))
        console.log('here')
        res.status(200).json({
            success: true,
            message: "approved",
            result
        })        
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" }); 
    }
}

export const projHandoverDone = async (req, res) => {
    const {id} = req.params
    console.log(req.files)
    try {
        await projects.projHandoverDone(id, req.files, req.body)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });           
    }
}

