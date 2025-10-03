import express from 'express'
import path from 'path'
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
    getProjectAccomplishment 
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

const upload = multer({ dest: 'public/data/uploads' });

router.route('/')
    .get(getProjects)
    .post(createProject)

router.route('/update-status')
    .put(updateProjectStatus)

router.route('/report/:id')
    .post(upload.array('photos', 5), sendDailyReport)
    .get(getDailyReport)

router.route('/schedule/:id')
    .get(getProjectSchedule)
    .post(makeProjectSchedule)
    .put(completeTask)

router.route('/accomplishment/:id')
    .get(getProjectAccomplishment)

router.route('/:id')
    .get(findProject)
    .put(updateProject)






export { router }





















