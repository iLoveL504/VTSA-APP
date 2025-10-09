import { PMSModel as pms } from '../model/PMSModel.js'

export const makePMSEntry = async (req, res) => {
    const {id} = req.params
    const {contract_type} = req.body
    console.log('hi from pms')
    try {
        await pms.makePMSEntry(Number(id), contract_type)
        res.status(200).json({
            success: true,
            message: "PMS entry saved successfully!",
        });
    } catch (e) {
       console.error(e);
        res.status(500).json({ success: false, message: "Error saving checklist." });     
    }
}