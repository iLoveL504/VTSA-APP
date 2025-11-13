import { pool } from '../config/database.js'
import { UtilitiesModel as utility } from './UtilitiesModel.js';

class TeamModel {
    static async getAllTeams() {
        const [results] = await pool.query(`
            select pm.id, pm.project_engineer_id, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, 
            tm.emp_id, e.username as \`e_username\`, e.job , p.id as \`project_id\`, 
            p.lift_name, p.status, p.installation_start_date as \`operations_start_date\`, 
            p.project_end_date, p.tnc_start_date, p.project_end_date
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
        if (id === undefined || id === null) {
            throw new Error('ID parameter is required');
        }

        const [results] = await pool.query(
            `select pm.id as \`project_manpower_id\`, pm.project_engineer_id, pe.username as \`pe_username\`, pm.tnc_tech_id as 'tnc_id', tnc.username as \`tnc_username\`, pm.team_id, t.Foreman, t.foreman_id, tm.emp_id, e.username as \`e_username\`, concat(e.last_name, ' ', e.first_name) as \`e_fullname\`, e.job , p.id as \`project_id\`, p.lift_name, p.status, p.installation_start_date as \`operations_start_date\`, p.project_end_date,
            p.project_PIC
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
        return results;
    }

    static async assignPIC(projId, picId) {
        await pool.query(`update projects set project_PIC = ? where id = ?`, [picId, projId])
    }

    static async editTeam(id, data) {
        console.log(data)
        console.log(id)
        const foreman = data.find(t => t.job === 'Foreman')
        const foremanId = foreman.employee_id
        const installers = data.filter(t => t.job !== 'Foreman').map(t => t.employee_id)
        await pool.query(`update project_manpower set team_id = ? where project_id = ?`, [foremanId, id])

        await pool.query(`delete from team_members where foreman_id = ?`, [foremanId])
        const insertPromises = installers.map(i => (
            pool.query(`insert into team_members (foreman_id, emp_id, project_id) values (?, ?, ?)`, [foremanId, i, id])
        ))

        await Promise.all(insertPromises)
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

    static async getProjectManpowerById(projId) {
        const [result] = await pool.query(`
            select  pm.project_id, pm.project_engineer_id, concat(pe.last_name , ' ', pe.first_name) as \`pe_fullname\`, pe.job,
            pm.tnc_tech_id, concat(tnc.last_name , ' ', tnc.first_name) as \`tnc_fullname\`, tnc.job,
            pm.qaqc_id, concat(qaqc.last_name , ' ', qaqc.first_name) as \`qaqc_fullname\`, tnc.job,
            pm.pms_id, concat(pms.last_name , ' ', pms.first_name) as \`pms_fullname\`, pms.job from project_manpower pm
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join employees qaqc on pm.qaqc_id = qaqc.employee_id
            left join employees pms on pm.pms_id = pms.employee_id where project_id = ?
        `, [projId])

        return result
    }

    static async tncTechProjects() {
        const [result] = await pool.query(`
            select tnc.employee_id, concat(tnc.last_name, ' ', tnc.first_name) as \`full_name\`, p.id \`project_id\`, p.lift_name,
            p.tnc_start_date, p.project_end_date from project_manpower pm
            right join employees tnc on tnc.employee_id = pm.tnc_tech_id
            left join projects p on p.id = pm.project_id where tnc.job = 'TNC Technician';

        `)
        return result
        
    }
    static async qaqcTechProjects() {
        const [result] = await pool.query(`
 select qaqc.employee_id, concat(qaqc.last_name, ' ', qaqc.first_name) as \`full_name\`, p.id as \`project_id\`, p.lift_name,
            p.qaqc_inspection_date from project_manpower pm
            right join employees qaqc on qaqc.employee_id = pm.qaqc_id
            left join projects p on p.id = pm.project_id where qaqc.job = 'QAQC';

        `)
        return result
        
    }
}

export { TeamModel }
