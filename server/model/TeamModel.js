import { pool } from '../config/database.js'
import { UtilitiesModel as utility } from './UtilitiesModel.js';

class TeamModel {
    static async getAllTeams() {
        const [results] = await pool.query(`
            select  pm.project_id, p.lift_name, p.client, pm.project_engineer_id, concat(pe.last_name , ' ', pe.first_name) as \`pe_fullname\`, pe.job,
            pm.tnc_tech_id, concat(tnc.last_name , ' ', tnc.first_name) as \`tnc_fullname\`, tnc.job,
            pm.qaqc_id, concat(qaqc.last_name , ' ', qaqc.first_name) as \`qaqc_fullname\`, tnc.job,
            pm.pms_id, concat(pms.last_name , ' ', pms.first_name) as \`pms_fullname\`, pms.job from project_manpower pm
            left join employees pe on pm.project_engineer_id = pe.employee_id
            left join employees tnc on pm.tnc_tech_id = tnc.employee_id
            left join employees qaqc on pm.qaqc_id = qaqc.employee_id
            left join employees pms on pm.pms_id = pms.employee_id
            join projects p on p.id = pm.project_id where p.archived = 0 and p.status <> 'Completed';
        `);

    
        return results;
    }

    static async getTeamsWithNoProject() {
        const [results] = await pool.query(`
            SELECT t.team_id, t.Foreman, f.employee_id AS foreman_id, f.branch as \`foreman_branch\`,
                   CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                   e.employee_id, e.job, e.branch, t.project_id, p.lift_name, p.created_at, p.manufacturing_end_date
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
        // console.log(data)
        // console.log(id)
        const foreman = data.find(t => t.job === 'Foreman')
        const foremanId = foreman.employee_id
        const installers = data.filter(t => t.job !== 'Foreman').map(t => t.employee_id)
        await pool.query(`update project_manpower set team_id = ? where project_id = ?`, [foremanId, id])

        await pool.query(`delete from team_members where foreman_id = ?`, [foremanId])
        await pool.query(`delete from forecast_team_members where project_id = ?`, [id])
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

static async getTeamDashboard() {
    const [result1] = await pool.query(`
        SELECT pm.project_id, p.lift_name, p.client, pm.project_engineer_id, 
               CONCAT(pe.last_name, ' ', pe.first_name) AS \`pe_fullname\`, pe.job, pe.branch as \`pe_branch\`,
               pm.tnc_tech_id, CONCAT(tnc.last_name, ' ', tnc.first_name) AS \`tnc_fullname\`, tnc.job, tnc.branch as \`tnc_branch\`,
               pm.qaqc_id, CONCAT(qaqc.last_name, ' ', qaqc.first_name) AS \`qaqc_fullname\`, qaqc.job, qaqc.branch as \`qaqc_branch\`,
               pm.pms_id, CONCAT(pms.last_name, ' ', pms.first_name) AS \`pms_fullname\`, pms.job, pms.branch as \`pms_branch\`
        FROM project_manpower pm
        LEFT JOIN employees pe ON pm.project_engineer_id = pe.employee_id
        LEFT JOIN employees tnc ON pm.tnc_tech_id = tnc.employee_id
        LEFT JOIN employees qaqc ON pm.qaqc_id = qaqc.employee_id
        LEFT JOIN employees pms ON pm.pms_id = pms.employee_id
        JOIN projects p ON p.id = pm.project_id 
        WHERE p.archived = 0 AND p.status <> 'Completed';
    `);
 
    const [result2] = await pool.query(`
        SELECT pm.id AS \`project_manpower_id\`, pm.project_engineer_id, pe.username AS \`pe_username\`, pe.branch as \`pe_branch\`, 
               pm.team_id, t.Foreman, t.foreman_id, f.branch as \`foreman_branch\`, 
               tm.emp_id, e.username AS \`e_username\`, e.branch as \`e_branch\`,
               CONCAT(e.last_name, ' ', e.first_name) AS \`e_fullname\`, e.job, 
               p.id AS \`project_id\`, p.lift_name, p.status, 
               p.installation_start_date AS \`operations_start_date\`, p.project_end_date
        FROM project_manpower pm 
        LEFT JOIN employees pe ON pm.project_engineer_id = pe.employee_id
        LEFT JOIN teams t ON pm.team_id = t.team_id
        LEFT JOIN projects p ON pm.project_id = p.id
        LEFT JOIN team_members tm ON t.team_id = tm.foreman_id
        LEFT JOIN employees f ON tm.foreman_id = f.employee_id
        LEFT JOIN employees e ON e.employee_id = tm.emp_id
        WHERE p.archived = 0 AND p.status <> 'Completed';
    `);
      
    // Merge the data
    const projectsMap = new Map();

    // First, process the techs data (result1)
    result1.forEach(projectTech => {
        const projectId = projectTech.project_id;
        
        projectsMap.set(projectId, {
            project_id: projectId,
            lift_name: projectTech.lift_name,
            client: projectTech.client,
            project_engineer: {
                id: projectTech.project_engineer_id,
                fullname: projectTech.pe_fullname,
                job: projectTech.job,
                branch: projectTech.pe_branch
            },
            technicians: {
                tnc_tech: projectTech.tnc_tech_id ? {
                    id: projectTech.tnc_tech_id,
                    fullname: projectTech.tnc_fullname,
                    job: 'Test and Commission',
                    branch: projectTech.tnc_branch
                } : null,
                qaqc_tech: projectTech.qaqc_id ? {
                    id: projectTech.qaqc_id,
                    fullname: projectTech.qaqc_fullname,
                    job: 'QA/QC',
                    branch: projectTech.qaqc_branch
                } : null,
                pms_tech: projectTech.pms_id ? {
                    id: projectTech.pms_id,
                    fullname: projectTech.pms_fullname,
                    job: 'PMS',
                    branch: projectTech.pms_branch
                } : null
            },
            foreman: null,
            team: [],
            status: null,
            operations_start_date: null,
            project_end_date: null
        });
    });

    // Then, process the team data (result2)
    result2.forEach(teamMember => {
        const projectId = teamMember.project_id;
        
        if (!projectsMap.has(projectId)) {
            // Create project if it doesn't exist
            projectsMap.set(projectId, {
                project_id: projectId,
                lift_name: teamMember.lift_name,
                client: null, // Not available in result2
                project_engineer: {
                    id: teamMember.project_engineer_id,
                    fullname: null,
                    job: null,
                    branch: teamMember.pe_branch
                },
                technicians: {
                    tnc_tech: null,
                    qaqc_tech: null,
                    pms_tech: null
                },
                foreman: null,
                team: [],
                status: teamMember.status,
                operations_start_date: teamMember.operations_start_date,
                project_end_date: teamMember.project_end_date
            });
        }

        const project = projectsMap.get(projectId);
        
        // Update project details if missing from result1
        if (!project.status) {
            project.status = teamMember.status;
            project.operations_start_date = teamMember.operations_start_date;
            project.project_end_date = teamMember.project_end_date;
        }

        // Update project engineer branch if missing
        if (teamMember.project_engineer_id && !project.project_engineer.branch && teamMember.pe_branch) {
            project.project_engineer.branch = teamMember.pe_branch;
        }

        // Set foreman with branch information
        if (teamMember.Foreman && !project.foreman) {
            project.foreman = {
                id: teamMember.foreman_id,
                name: teamMember.Foreman,
                branch: teamMember.foreman_branch
            };
        }

        // Add team member if valid (with branch information)
        if (teamMember.emp_id && teamMember.e_fullname) {
            const teamMemberObj = {
                id: teamMember.emp_id,
                username: teamMember.e_username,
                fullname: teamMember.e_fullname,
                job: teamMember.job,
                branch: teamMember.e_branch
            };

            // Check if team member already exists to avoid duplicates
            const exists = project.team.some(member => 
                member.id === teamMemberObj.id
            );
            
            if (!exists) {
                project.team.push(teamMemberObj);
            }
        }
    });

    // Convert map to array and return
    return Array.from(projectsMap.values());
}
}

export { TeamModel }
