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

    static async getDesignatedProject(id, role) {

        const filter = role === 'Project Engineer' ? 'pm.project_engineer_id' 
                            : role === 'Foreman' ? 't.foreman_id' 
                                : 'tm.emp_id'
        // Get team info
        const filterQuery = `
            select pm.id, pm.project_engineer_id, pe.username as 'pe_username', pm.tnc_tech_id as 'tnc_id', tnc.username as 'tnc_username', pm.team_id, t.Foreman, t.foreman_id, tm.emp_id, e.username as 'e_username', e.job , p.id as 'project_id', p.lift_name, p.status, p.manufacturing_end_date as 'operations_start_date', p.project_end_date
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id where ${filter} = ?
        `

        const [result] = await pool.query(
            filterQuery
        , [id]);
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
