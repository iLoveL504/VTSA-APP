import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { PMSController } from '../../controllers/pmsController.js';

const router = express.Router();

// =============== MULTER CONFIG ===============
const uploadPath = path.join(process.cwd(), 'public/data/pms_uploads');
console.log('PMS Upload path:', uploadPath);

// Create directory if not existing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Created PMS upload directory:', uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// =============== ROUTES ===============

// PMS main clients
router.get('/clients', PMSController.getAll);

// Get technicians by island group
// router.get('/techs/:islandGroup', PMSController.getTechs);

// // Assign technicians
// router.post('/assign/:pmsId', PMSController.assignTechs);

// // Mark inspection as complete (with photos)
// router.post(
//   '/complete/:pmsId',
//   upload.array('photos', 10),
//   PMSController.completeInspection
// );

// // Get PMS files (“baby book”)
// router.get('/files/:pmsId', PMSController.getPMSFiles);

// // Upload additional files manually (optional)
// router.post(
//   '/files/:pmsId',
//   upload.array('photos', 10),
//   PMSController.uploadPMSFiles
// );

// // Delete file
// router.delete('/files/:fileId', PMSController.deletePMSFile);

export { router };
