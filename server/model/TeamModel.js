import { pool } from '../config/database.js'

class TeamModel {
    static async getAllTeams() {
        const [results] = await pool.query(`
            SELECT t.project_engineer_id, CONCAT(pe.first_name, ' ', pe.last_name) AS Project_Engineer,
                   t.Foreman, f.employee_id AS foreman_id, CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
            FROM teams t
            LEFT JOIN employees f ON f.employee_id = t.foreman_id
            LEFT JOIN team_members tm ON tm.foreman_id = t.team_id
            LEFT JOIN employees e ON e.employee_id = tm.emp_id
            LEFT JOIN projects p ON p.id = t.project_id
            LEFT JOIN employees pe ON pe.employee_id = t.project_engineer_id
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
            `SELECT t.team_id, t.Foreman, f.employee_id AS foreman_id,
                    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                    e.employee_id, e.job, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
             FROM teams t
             LEFT JOIN employees f ON f.employee_id = t.foreman_id
             LEFT JOIN team_members tm ON tm.foreman_id = t.team_id
             LEFT JOIN employees e ON e.employee_id = tm.emp_id
             LEFT JOIN projects p ON p.id = t.project_id
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
            SELECT t.team_id, t.Foreman, f.employee_id AS foreman_id,
                   CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
            FROM teams t
            JOIN employees f ON f.employee_id = t.foreman_id
            JOIN team_members tm ON tm.foreman_id = t.team_id
            JOIN employees e ON e.employee_id = tm.emp_id
            JOIN projects p ON p.id = t.project_id
            WHERE project_end_date < ?`,
            [date]
        );

        const employees = await Promise.all(
            results.map(async (e) => {
                const [emp] = await pool.query(
                    `SELECT * FROM employees WHERE employee_id = ?`,
                    [e.employee_id]
                );
                return emp[0];
            })
        );

        return employees;
    }

    static async getNotAssignedPE() {
        const [result] = await pool.query(`
            SELECT * FROM employees
            WHERE job = 'Project Engineer'
            AND employee_id NOT IN (
            SELECT project_engineer_id FROM teams WHERE project_engineer_id IS NOT NULL
            )
        `);
        return result;
    }

static async assignTeam(pe, foreman, members, projId) {
    await pool.query(
        `UPDATE teams SET project_engineer_id = ? WHERE foreman_id = ?`,
        [pe, foreman]
    );

    await pool.query(
        `UPDATE teams SET project_id = ? WHERE foreman_id = ?`,
        [projId, foreman]
    );

    const [foreman_team_id] = await pool.query(
        `SELECT team_id FROM teams WHERE foreman_id = ?`,
        [foreman]
    );

    const fId = foreman_team_id[0]['team_id'];

    await pool.query(
        `INSERT INTO team_members (foreman_id, emp_id) VALUES(?, ?)`,
        [fId, pe]
    );

    console.log('should be ok');
}

}

export { TeamModel }
