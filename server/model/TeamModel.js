import { pool } from '../config/database.js'
import { UtilitiesModel as utility } from './UtilitiesModel.js';

class TeamModel {
    static async getAllTeams() {
        const [results] = await pool.query(`
            select pm.id, pm.project_engineer_id, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, tm.emp_id, e.username as \`e_username\`, e.job , p.id as \`project_id\`, p.lift_name, p.status, p.installation_start_date as \`operations_start_date\`, p.project_end_date
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id;
        `);

    
        return results;
    }

    static async getTeamsWithNoProject() {
        const [results] = await pool.query(`
            SELECT t.team_id, t.Foreman, f.employee_id AS foreman_id,
                   CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
            FROM teams t
            LEFT JOIN employees f ON f.employee_id = t.foreman_id
            LEFT JOIN team_members tm ON tm.foreman_id = t.team_id
            LEFT JOIN employees e ON e.employee_id = tm.emp_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE t.project_id IS NULL
        `);
        return results;
    }

    static async getLastTeamId() {
        const [results] = await pool.query(`
            SELECT team_id FROM (
                SELECT tm.team_id, t.team_name, e.username
                FROM team_members tm
                JOIN employees e ON tm.emp_id = e.employee_id
                JOIN teams t ON tm.team_id = t.team_id
            ) AS aggregate_team
            ORDER BY team_id DESC LIMIT 1
        `);
        return results;
    }

    static async getTeamPerId(id) {
        console.log('sfad',id)
        if (id === undefined || id === null) {
            throw new Error('ID parameter is required');
        }

        const [results] = await pool.query(
            `select pm.id, pm.project_engineer_id, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, tm.emp_id, e.username as \`e_username\`, e.job , p.id as \`project_id\`, p.lift_name, p.status, p.installation_start_date as \`operations_start_date\`, p.project_end_date
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id
             WHERE p.id = ?`,
            [id]
        );
        console.log('blah');
        return results;
    }

    static async getTeamDesignation(id) {
        const [results] = await pool.query(`
            SELECT t.team_id, t.Foreman, f.employee_id AS foreman_id,
                   CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
            FROM teams t
            LEFT JOIN employees f ON f.employee_id = t.foreman_id
            LEFT JOIN team_members tm ON tm.foreman_id = t.team_id
            LEFT JOIN employees e ON e.employee_id = tm.emp_id
            LEFT JOIN projects p ON p.id = t.project_id
            WHERE e.employee_id = ?`,
            [id]
        );
        return results;
    }

    static async forecastTeam(date) {
        const [results] = await pool.query(`
            select pm.id, pm.project_engineer_id, pe.username as 'pe_username', pm.tnc_tech_id as 'tnc_id', tnc.username as 'tnc_username', pm.team_id, t.Foreman, t.foreman_id, tm.emp_id, e.username as 'e_username', e.job , p.id as 'project_id', p.lift_name, p.status, p.manufacturing_end_date as 'operations_start_date', p.project_end_date
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id
            where p.project_end_date < ?`,
            [date]
        );


        return results;
    }

    static async getNotAssignedPE() {
        const [result] = await pool.query(`
	select * from employees where employee_id in (
			select  pm.project_engineer_id
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id where p.project_end_date < curdate()
    ) and job = 'Project Engineer';
        `);


        return result;
    }

static async assignTeam(projId, pe) {
    await pool.query(`update project_manpower set project_engineer_id = ? where project_id = ?`, [pe, projId])
    await utility.changeUserStatus([pe], 'active')
    return
}

    static async getProjectManpower() {
        const [results] = await pool.query(`select * from project_manpower`)
        return results
    }

}

export { TeamModel }
