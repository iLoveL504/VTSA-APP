import { pool } from '../config/database.js'

class UserModel {
    static async findById(id){
        const [results] = await pool.query(
            'SELECT * FROM employees WHERE employee_id = ?',
            [id]
        );
        return results[0];
    }

    //READ
    static async getAllUsers(){
        const [results] = await pool.query(
            'SELECT * FROM employees'
        );
   
        return results;
    }

    //UPDATE
    static async updateUser (user, id) {
        const { username, password, last_name, first_name, job, in_house, island_group, branch } = user;
        await pool.query(`
            update employees set username = ?, password = ?,
            last_name = ?, first_name = ?, job = ?, in_house = ?, island_group = ?, branch = ? where employee_id = ? 
        `, [username, password, last_name, first_name, job, in_house, island_group, branch, id]);
    }

    //CREATE
    static async addUser (user) {
        const { username, password, first_name, last_name, job, island } = user
        const [result] =  await pool.query(`
            insert into employees (username, password, first_name, last_name, job, island_group)
            values (?, ?, ?, ?, ?)    
        `, [username, password, first_name, last_name, job, island])

        if (job === 'Foreman') {
            const foremanId = result.insertId
            const foreman_full_name = `${first_name} ${last_name}`
            await pool.query(`
                insert into teams (team_id, Foreman, foreman_id) values
                (?, ?, ?)
            `, [foremanId, foreman_full_name, foremanId])
        }
    }

    //DELETE
    static async deleteUser (id) {
        await pool.query(`
            delete from employees where employee_id = ?   
        `, [id])
        
    }

    static async getDesignatedProject(id, role) {
        const filter = role === 'Project Engineer' ? 'pm.project_engineer_id' 
                            : role === 'Foreman' ? 't.foreman_id' 
                                : role === 'QAQC' ? 'pm.qaqc_id' 
                                    : role === 'TNC Technician' ? 'pm.tnc_tech_id'
                                        : role === 'PMS Technician' ? 'pm.pms_id' : 'tm.emp_id'
        // Get team info
        console.log(role)
        console.log(filter)
        const filterQuery = role !== 'Project Engineer' ? `
            select p.id as 'project_id'
            from project_manpower pm 
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join teams t on pm.team_id = t.team_id
            left join projects p on pm.project_id = p.id
            left join team_members tm on t.team_id = tm.foreman_id
            left join employees e on e.employee_id = tm.emp_id where ${filter} = ?
        ` : `select project_id from project_manpower where project_engineer_id = ?`

        const [result] = await pool.query(
            filterQuery
        , [id]);
        if (!result.length) return result;
        const ids = result.map(r => r.project_id)
        const projectId = [...new Set(ids)]
         
        // Get project info

        const projectsPromises = projectId.map(p => {
            return pool.query(`SELECT * FROM projects WHERE id = ?`, [p])
        })

        const projectResults = await Promise.all(projectsPromises);

        // Extract only the rows from each query result
        const projects = projectResults.map(([rows]) => rows[0]);

        return projects;
    }
}

export { UserModel }
