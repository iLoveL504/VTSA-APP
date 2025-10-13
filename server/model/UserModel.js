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
            select pm.id, pm.project_engineer_id, pe.username, pm.tnc_tech_id as 'tnc_id', tnc.username, pm.team_id, t.Foreman, tm.emp_id, e.username, e.job , p.id as \`project_id\`, p.lift_name
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id where e.employee_id = ?;
        `, [id]);
        console.log(result)
            console.log('hi from hee')
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
