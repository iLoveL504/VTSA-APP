import { pool } from '../config/database.js'

class UserModel {
    static async findById(id){
        const [results] = await pool.query(
            'SELECT * FROM employees WHERE employee_id = ?',
            [id]
        );
        return results[0];
    }

    static async getAllUsers(){
        const [results] = await pool.query(
            'SELECT * FROM employees'
        );
        return results;
    }

    static async updateUser(user){
        const { last_name, first_name, employee_id } = user;
        const [results] = await pool.query(
            `UPDATE employees 
             SET last_name = ?, first_name = ? 
             WHERE employee_id = ?`,
            [last_name, first_name, employee_id]
        );
        return results;
    }

    static async getDesignatedProject(id) {
        // Get team info
        const [result] = await pool.query(`
            SELECT t.project_engineer_id, 
                   CONCAT(pe.first_name, ' ', pe.last_name) AS Project_Engineer,
                   t.Foreman, f.employee_id AS foreman_id,
                   CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, t.project_id,
                   p.lift_name, p.created_at, p.manufacturing_end_date
            FROM teams t
            LEFT JOIN employees f ON f.employee_id = t.foreman_id
            LEFT JOIN team_members tm ON tm.foreman_id = t.team_id
            LEFT JOIN employees e ON e.employee_id = tm.emp_id
            LEFT JOIN projects p ON p.id = t.project_id
            LEFT JOIN employees pe ON pe.employee_id = t.project_engineer_id
            WHERE e.employee_id = ?;
        `, [id]);

        if (!result.length) return result;

        const projectId = result[0].project_id;

        // Get project info
        const [project] = await pool.query(
            `SELECT * FROM projects WHERE id = ?`,
            [projectId]
        );

        return project;
    }
}

export { UserModel }
