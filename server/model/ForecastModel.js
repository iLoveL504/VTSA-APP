import { pool } from "../config/database.js";

class ForecastModel {
  static async forecastTeam(date) {
    const [results] = await pool.query(`
      SELECT employee_id, username, job 
      FROM employees e
      WHERE EXISTS (
        SELECT 1
        FROM project_manpower pm 
        LEFT JOIN teams t ON pm.team_id = t.team_id
        LEFT JOIN team_members tm ON t.team_id = tm.foreman_id
        LEFT JOIN projects p ON pm.project_id = p.id
        WHERE (tm.emp_id = e.employee_id OR tm.foreman_id = e.employee_id)
        AND NOT EXISTS (
          SELECT 1 FROM forecast_team_members ftm
          WHERE ftm.emp_id = e.employee_id OR ftm.foreman_id = e.employee_id
        )
        AND p.project_end_date < ?
      ) AND job IN ('Foreman', 'Skilled Installer', 'Installer');
    `, [date]);

    return results;
  }

  static async teamsNoProject() {
    const [results] = await pool.query(`
      SELECT employee_id, username, job 
      FROM employees e
      WHERE NOT EXISTS (
        SELECT 1
        FROM project_manpower pm 
        LEFT JOIN teams t ON pm.team_id = t.team_id
        LEFT JOIN team_members tm ON t.team_id = tm.foreman_id
        LEFT JOIN projects p ON pm.project_id = p.id
        WHERE tm.emp_id = e.employee_id OR tm.foreman_id = e.employee_id
        OR EXISTS (SELECT 1 FROM forecast_team_members ftm WHERE ftm.emp_id = e.employee_id OR ftm.foreman_id = e.employee_id)
      ) AND job IN ('Foreman', 'Skilled Installer', 'Installer');
    `);
    return results;
  }

  static async tentativeProjectTeams() {
    const [results] = await pool.query(`
      SELECT ftm.project_id, p.lift_name, ftm.foreman_id,
      f.username AS foreman_username,
        ftm.emp_id, e.username, e.job
      FROM forecast_team_members ftm
      LEFT JOIN projects p ON p.id = ftm.project_id
      LEFT JOIN employees f ON f.employee_id = ftm.foreman_id
      LEFT JOIN employees e ON e.employee_id = ftm.emp_id;
    `);
    return results;
  }

  static async insertForecastMembers({ projectId, employee_id }) {
    await pool.query(`
      INSERT INTO forecast_team_members (project_id, emp_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE emp_id = VALUES(emp_id);
    `, [projectId, employee_id]);
  }

  // 🔥 NEW: Assign or update foreman
  static async assignOrUpdateForeman({ projectId, employee_id }) {
    // Check if any member already exists under this project
    const [existing] = await pool.query(
      `SELECT * FROM forecast_team_members WHERE project_id = ?;`,
      [projectId]
    );
    console.log(existing.length)

    if (existing.every(t => t.foreman_id === null)) {
      await pool.query(`
        INSERT INTO forecast_team_members (project_id, foreman_id)
        VALUES (?, ?);
      `, [projectId, employee_id]);
    }
  }

  // 🔥 NEW: Remove a forecast member (including foreman)
  static async removeForecastMember({ projectId, employee_id }) {
    // Try to remove from emp_id first
    await pool.query(`
      DELETE FROM forecast_team_members
      WHERE project_id = ? AND (emp_id = ? OR foreman_id = ?);
    `, [projectId, employee_id, employee_id]);
  }

  static async finalizeTeam(project) {
    const id = project.id
    const result = await this.tentativeProjectTeams()
    const teamToBeSaved = result.filter(t => t.project_id === id)
    const foremanId = teamToBeSaved.find(t => t.foreman_id !== null).foreman_id
    const installers = teamToBeSaved.filter(t => {
      if(t.foreman_id === null) return true
    }).map(t => t.emp_id)
    console.log(foremanId)
    console.log(installers)


    
    const insertPromises = installers.map(async(i) => {
      return pool.query(`insert into team_members (foreman_id, emp_id) values (?, ?)`, [foremanId, i])
    })

    await Promise.all(insertPromises)
    const [IU] = await pool.query('select * from project_manpower where project_id = ?', [id])
    if (IU.length > 0) {
      await pool.query(`update project_manpower set team_id = ? where project_id = ?`, [foremanId, id])      
    }

    await pool.query(`update projects set has_team = 1 where id = ?`, [id])
    return
  }
}

export { ForecastModel };
