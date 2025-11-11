import { pool } from "../config/database.js";

class UtilitiesModel {
    static async peProjects () {
        const [results] = await pool.query(`
                select pm.id, pm.project_engineer_id, pe.job, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, p.id as \`project_id\`, p.lift_name, p.client, p.status, p.installation_start_date as \`operations_start_date\`, p.project_end_date
                from project_manpower pm 
                left join employees pe on pm.project_engineer_id = pe.employee_id
                left join employees tnc on pm.tnc_tech_id = tnc.employee_id
                left join teams t on pm.team_id = t.team_id
                left join projects p on pm.project_id = p.id;
            `)
        return results
    }

static async changeUserStatus(userIds, status) {
    if (!Array.isArray(userIds) || userIds.length === 0) return;
    console.log(userIds)
    const placeholders = userIds.map(() => '?').join(', ');
    console.log(placeholders)
    const sql = `
        UPDATE employees 
        SET is_active = ? 
        WHERE employee_id IN (${placeholders})
    `;

    const values = [status === 'active' ? 1 : 0, ...userIds];
    await pool.query(sql, values);
}

static async setContractAmount(projId, amount) {
    console.log('setting amount...')
    await pool.query(`update projects set contract_amount = ? where id = ?`, [amount, projId])
}

static async setContractContinuation(projId, approve_proposal) {
    console.log('setting amount...')
    await pool.query(`update pms_projects set approve_proposal = ? where id = ?`, [approve_proposal, projId])
}



}

export { UtilitiesModel }