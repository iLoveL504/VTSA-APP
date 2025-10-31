import { PMSModel } from '../model/PMSModel.js';
import path from 'path';

export const PMSController = {
  async getAll(req, res) {
    try {
      const clients = await PMSModel.getAllPMS();
      console.log(clients)
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getTechs(req, res) {
    try {
      const { islandGroup } = req.params;
      const techs = await PMSModel.getAvailableTechnicians(islandGroup);
      res.json(techs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async assignTechs(req, res) {
    try {
      const { pmsId } = req.params;
      const { technicianIds } = req.body;
      const result = await PMSModel.assignTechnicians(pmsId, technicianIds);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async completeInspection(req, res) {
    try {
      const { pmsId } = req.params;
      const { reportDetails } = req.body;
      const photos = req.files || [];

      const uploadedFiles = await Promise.all(
        photos.map((file) =>
          PMSModel.addPMSFile(
            pmsId,
            file.originalname,
            path.join('/data/pms_uploads', file.filename)
          )
        )
      );

      const result = await PMSModel.markInspectionComplete(pmsId, reportDetails);
      res.json({ ...result, uploadedFiles });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getPMSFiles(req, res) {
    try {
      const { pmsId } = req.params;
      const files = await PMSModel.getPMSFiles(pmsId);
      res.json(files);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async uploadPMSFiles(req, res) {
    try {
      const { pmsId } = req.params;
      const photos = req.files || [];

      const uploadedFiles = await Promise.all(
        photos.map((file) =>
          PMSModel.addPMSFile(
            pmsId,
            file.originalname,
            path.join('/data/pms_uploads', file.filename)
          )
        )
      );

      res.json({ message: 'Files uploaded successfully.', uploadedFiles });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deletePMSFile(req, res) {
    try {
      const { fileId } = req.params;
      const result = await PMSModel.deletePMSFile(fileId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
