import { PMSModel } from '../model/PMSModel.js';
import path from 'path';

export const PMSController = {
  async getAll(req, res) {
    try {
      const clients = await PMSModel.getAllPMS();
      res.json(clients);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  async getClient(req, res) {
    try {
      const {id} = req.params
      const client = await PMSModel.getPMSClient(Number(id))
      console.log('here in get client')
      console.log(client)
      res.json(client[0])
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });      
    }
  },

  async getInspectionStatus (req, res) {
    try {
      const {id} = req.params
      const result = await PMSModel.getStatus(id)
      res.json(result)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });    
    }
  },
  async getCallbackStatus (req, res) {
    try {
      const {id} = req.params
      const result = await PMSModel.getCallbackStatus(Number(id))
      res.json(result)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });    
    }
  },

  async getDesignatedProjects(req, res) {
    try {
      const {id} = req.params
      const clients = await PMSModel.getDesignatedProject(Number(id))
      res.json(clients)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });      
    }
  },

  async getTechs(req, res) {
    try {
      console.log('get teachs')
      const techs = await PMSModel.getAvailableTechnicians();
      res.json(techs);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  async setInspectionDate(req, res) {
    try {
      const {id} = req.params
      const {date} = req.body
      await PMSModel.setInspectionDate(id, date)
      res.status(200).json({
          success: true,
          message: "approved"
      })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async beginInspection(req, res) {
    console.log('try beginning inspeciton')
    try {
      const {id} = req.params
      await PMSModel.ongoingPMS(Number(id))
            res.status(200).json({
          success: true,
          message: "approved"
      })
      console.log('here')
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error approving" }); 
    }
  },

  async assignTechs(req, res) {
    try {
      const { pmsId } = req.params;
      const { technicianIds } = req.body;
      const { inspection_date } = req.body
      await PMSModel.assignTechnicians(pmsId, technicianIds, inspection_date);
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: "Error approving" });         
    }
  },

  async setInspectionDate (req, res) {
    try {
      const {id} = req.params
      const {inspection_date} = req.body
      console.log(inspection_date)
      await PMSModel.scheduleInspection(Number(id), inspection_date)
         res.status(200).json({
            success: true,
            message: "approved"
        })     
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error approving" });        
    }
  },

  async completeInspection(req, res) {
    try {
      const { pmsId } = req.params;
      const { reportDetails } = req.body;
      const photos = req.files || [];
      console.log('complete inspection')
      await PMSModel.markInspectionComplete(Number(pmsId), req.files);
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  },

  async getBabyBook (req, res) {
    try {
      const { id } = req.params
      const result = await PMSModel.getBabyBook(Number(id))
      res.json(result)
    } catch (err) {
      console.log(err)
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

  async scheduleCallback(req, res) {
    try {
      const {clientId} = req.params
      const { technicianIds } = req.body
      const { inspection_date } = req.body
      await PMSModel.scheduleCallback(Number(clientId), technicianIds, inspection_date)
        res.status(200).json({
            success: true,
            message: "approved"
        })
    } catch (err) {
      res.status(400).json({ error: err.message });      
    }
  },

  async callbackDesignations(req, res) {
    try {
      const {techId} = req.params
      const results = await PMSModel.callbackDesignation(Number(techId))
      res.status(200).json(results)
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  },

  async beginCallback(req, res) {
    try {
      const {clientId} = req.params
      await PMSModel.ongoingCallback(Number(clientId))
          res.status(200).json({
        success: true,
        message: "approved"
    })
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message });      
    }
  },
  // ==========================
//  COMPLETE CALLBACK
// ==========================
  async completeCallback (req, res) {
    try {
        const { clientId } = req.params;
        const photos = req.files || {};

        console.log('Completing callback for client:', clientId);
        console.log('Uploaded files:', photos);

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required'
            });
        }

        const result = await PMSModel.markCallbackComplete(clientId, photos);
        
        res.status(200).json({
            success: true,
            message: 'Callback completed successfully',
            data: result
        });
    } catch (error) {
        console.error('Error completing callback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete callback',
            error: error.message
        });
    }
}
};
