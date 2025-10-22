import express from 'express'
import path from 'path'
import fs from 'fs'
import { 
    getProjects, 
    findProject, 
    createProject, 
    updateProject, 
    makeProjectSchedule, 
    getProjectSchedule, 
    completeTask,
    updateProjectStatus,
    sendDailyReport,
    getDailyReport,
    getProjectAccomplishment,
    fillKickOffChecklist,
    getKickOffChecklist,
    getPTNCChecklist, 
    fillPTNCChecklist,
    projectContract,
    foremanApprove,
    requestProjQAQC,
    assignProjQAQC
} from "../../controllers/projectController.js"
const router = express.Router()
import multer from 'multer'
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd(), "public/data/uploads")); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // rename to avoid collisions
//   },
// });

const uploadPath = path.join(process.cwd(), 'public/data/uploads')
console.log('Upload path:', uploadPath)

// Create directory if needed
if(!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
    console.log('Created upload directory: ', uploadPath)
}

// Use diskStorage to properly configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Preserve original filename with timestamp
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});


router.route('/')
    .get(getProjects)
    .post(upload.array('photos', 5), createProject)


router.route('/update-status')
    .put(updateProjectStatus)

router.route('/photos/:id')
    .get(projectContract)

router.route('/report/:id')
    .post(upload.array('photos', 5), sendDailyReport)
    .get(getDailyReport)

router.route('/schedule/:id')
    .get(getProjectSchedule)
    .post(makeProjectSchedule)
    .put(completeTask)

router.route('/qaqc/request/:id')
    .post(requestProjQAQC)

router.route('/qaqc/assign/:id')
    .put(assignProjQAQC)

router.route('/kickoff/:id')
    .put(fillKickOffChecklist)
    .get(getKickOffChecklist)

router.route('/checklist-ptnc/:id')
    .get(getPTNCChecklist)
    .put(fillPTNCChecklist)

router.route('/accomplishment/:id')
    .get(getProjectAccomplishment)

router.route('/task/approval/:id')
    .put(foremanApprove)

router.route('/:id')
    .get(findProject)
    .put(updateProject)

export { router }
