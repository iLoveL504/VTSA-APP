import { pool } from "../config/database.js";

class UtilitiesModel {
    static async peProjects () {
        const [results] = await pool.query(`
                select pm.id, pm.project_engineer_id, pe.job, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, p.id as \`project_id\`, p.lift_name, p.status, p.installation_start_date as \`operations_start_date\`, p.project_end_date
                from project_manpower pm 
                left join employees pe on pm.project_engineer_id = pe.employee_id
                left join employees tnc on pm.tnc_tech_id = tnc.employee_id
                left join teams t on pm.team_id = t.team_id
                left join projects p on pm.project_id = p.id;
            `)
        return results
    }

    
}

export { UtilitiesModel }