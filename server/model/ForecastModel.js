import { pool } from '../config/database.js'

class ForecastModel {
    //get teams in project that has installation end dates earlier than the start date of another project
    static async forecastTeam (date) {
        const [results] = await pool.query(`
            SELECT employee_id, username, job 
            FROM employees e
            WHERE EXISTS (
                SELECT 1
                FROM project_manpower pm 
                LEFT JOIN teams t ON pm.team_id = t.team_id
                LEFT JOIN team_members tm ON t.team_id = tm.foreman_id
                left join projects p on pm.project_id = p.id
                where (tm.emp_id = e.employee_id or tm.foreman_id = e.employee_id)
                and not EXISTS (SELECT 1 FROM forecast_team_members ftm WHERE ftm.emp_id = e.employee_id or ftm.foreman_id = e.employee_id)
                and p.project_end_date < ?
            ) and job in ('Foreman', 'Skilled Installer', 'Installer');`, [date])

        return results
    }        
    
    static async teamsNoProject () {
        const [results] = await pool.query(`
            SELECT employee_id, username, job 
            FROM employees e
            WHERE NOT EXISTS (
                SELECT 1
                FROM project_manpower pm 
                LEFT JOIN teams t ON pm.team_id = t.team_id
                LEFT JOIN team_members tm ON t.team_id = tm.foreman_id
                left join projects p on pm.project_id = p.id
                where tm.emp_id = e.employee_id or tm.foreman_id = e.employee_id
                OR EXISTS (SELECT 1 FROM forecast_team_members ftm WHERE ftm.emp_id = e.employee_id or ftm.foreman_id = e.employee_id)
            ) and job in ('Foreman', 'Skilled Installer', 'Installer');
        `)
            console.log('hihih')
        return results
    }

    static async tentativeProjectTeams () {
        const [results] = await pool.query(`
            select ftm.project_id, p.lift_name, ftm.foreman_id, f.username, f.job, ftm.emp_id, e.username, e.job
            from forecast_team_members ftm
            left join projects p on p.id = ftm.project_id
            left join employees f on f.employee_id = ftm.foreman_id
            left join employees e on e.employee_id = ftm.emp_id;
        `)
            console.log('hihih')
        return results
    }
}

export { ForecastModel }