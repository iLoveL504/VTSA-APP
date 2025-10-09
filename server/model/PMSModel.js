import { pool } from '../config/database.js'

class PMSModel {
    
    static async makePMSEntry(id, contract) {
        console.log('here in the model')
        await pool.query('update projects set status = \'Completed\', contract_type = ? where id = ?', [contract, id])
        return
    }
}

export { PMSModel }