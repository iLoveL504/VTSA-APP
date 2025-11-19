import { pool } from '../config/database.js'
import { UtilitiesModel as utility } from './UtilitiesModel.js';
import dotenv from 'dotenv'
import LinkedList from '../../DataStructs/LinkedList.js';
import dayjs from 'dayjs'
dotenv.config()

const formatLocalDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  // Add 1 day to compensate for UTC to Philippines time conversion
  return date.toLocaleDateString("en-GB", { timeZone: "Asia/Manila" });
};

const summaryMap = {
  'Mechanical Installation': 'Installation',
  'Preliminaries': 'Preliminaries',
  'Structural/Civil Works': 'Structural/Manufacturing',
  'Manufacturing and Importation': 'Structural/Manufacturing',
  'Planning For Mobilization And Execution': 'Planning',
  'Testing and Commissioning': 'Test and Comm'
};

class ProjectModel {
    static async findById(id){
        const [results] = await pool.query(
            `           SELECT 
          p.*, 
          pm.project_engineer_id,
          e.username AS project_engineer,
          concat(e.last_name, ' ', e.first_name) as 'pe_fullname'
      FROM projects p
      LEFT JOIN project_manpower pm 
          ON p.id = pm.project_id 
          left join employees e on e.employee_id = pm.project_engineer_id where p.handover_done = 0 and p.archived = 0 and p.id = ?`,
            [id]
        )
        return results[0]
    }

    static async findByName(name){
        const [results] = await pool.query(
            'select id from projects where lift_name = ?',
            [name]
        )
   
        return results
    }

static async getAllProjects() {
    try {
        // First get all projects
        const [results] = await pool.query(`
           SELECT 
              p.*, 
              pm.project_engineer_id,
              e.username AS project_engineer,
              concat(e.last_name, ' ', e.first_name) as 'pe_fullname'
          FROM projects p
          LEFT JOIN project_manpower pm 
              ON p.id = pm.project_id 
              left join employees e on e.employee_id = pm.project_engineer_id 
          WHERE p.handover_done = 0;
        `);

        // Update statuses for projects with schedules
        const projectsWithSchedule = results.filter(p => p.schedule_created === 1);
        if (projectsWithSchedule.length > 0) {
            await this.updateProjectStatusesBatch(projectsWithSchedule);
            
            // Re-fetch the projects to get updated statuses
            const [updatedResults] = await pool.query(`
               SELECT 
                  p.*, 
                  pm.project_engineer_id,
                  e.username AS project_engineer,
                  concat(e.last_name, ' ', e.first_name) as 'pe_fullname'
              FROM projects p
              LEFT JOIN project_manpower pm 
                  ON p.id = pm.project_id 
                  left join employees e on e.employee_id = pm.project_engineer_id 
              WHERE p.handover_done = 0;
            `);
            
            return updatedResults;
        }
        console.log('got all results easy peasy')
        return results;
    } catch (error) {
        console.error('Error in getAllProjects:', error);
        throw error;
    }
}

static async updateProjectStatusesBatch(projects) {
    const currentDate = new Date().toISOString().split('T')[0]; // Use current date
    
    for (const project of projects) {
        if (project.schedule_created !== 1) continue;
        console.log(project.id)
        try {
            // Get project schedule
            const tasks = await this.getProjectSchedule(project.id);
            if (!tasks || tasks.length === 0) continue;
            
            // Calculate status (similar to your client-side logic)
            const statusInfo = await this.calculateProjectStatus(project, tasks, currentDate);
            
            // Update project in database
            await this.updateSingleProjectStatus(project.id, statusInfo);
            
        } catch (error) {
            console.error(`Error updating status for project ${project.id}:`, error);
        }
    }
}

static async calculateProjectStatus(project, tasks, currentDate) {
    // Use UTC dates consistently
    const now = new Date(currentDate);
    const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    // ---- HOLD DAYS ----
    let holdDays = null;
    const isOnHold = !!project.on_hold;
    if (project.hold_date) {
        const holdDate = new Date(project.hold_date);
        const utcHoldDate = new Date(Date.UTC(holdDate.getUTCFullYear(), holdDate.getUTCMonth(), holdDate.getUTCDate()));
        holdDays = Math.floor((utcNow - utcHoldDate) / (1000 * 60 * 60 * 24));
    }
    
    let willResume = false;
    if (isOnHold) {
        const today = dayjs().utc().startOf('day');
        const resume = dayjs(project.resume_date).utc().startOf('day');
        willResume = (project.will_resume && today.isSame(resume));
        
        if (!willResume) {
            return {
                status: 'Pending',
                isOnHold: true,
                holdDays,
                current_task: project.current_task,
                task_phase: project.task_phase,
                willResume
            };        
        } else {
            return {
                status: 'Testing and Comm',
                isOnHold: true,
                holdDays,
                current_task: project.current_task,
                current_task_id: 601,
                task_phase: 'Testing and Commissioning',
                willResume          
            };
        }
    }
    
    // ---- CURRENT TASKS ----
    // Convert all dates to UTC for comparison
    const foundParentTask = tasks.find(t => {
        if (t.task_type !== 'summary') return false;
        
        const taskStart = new Date(t.task_start);
        const taskEnd = new Date(t.task_end);
        const utcTaskStart = new Date(Date.UTC(taskStart.getUTCFullYear(), taskStart.getUTCMonth(), taskStart.getUTCDate()));
        const utcTaskEnd = new Date(Date.UTC(taskEnd.getUTCFullYear(), taskEnd.getUTCMonth(), taskEnd.getUTCDate()));
        
        return utcNow >= utcTaskStart && utcNow <= utcTaskEnd;
    });
    
    const projectedTask = tasks.find(t => {
        if (t.task_type !== 'task') return false;
        
        const taskStart = new Date(t.task_start);
        const taskEnd = new Date(t.task_end);
        const utcTaskStart = new Date(Date.UTC(taskStart.getUTCFullYear(), taskStart.getUTCMonth(), taskStart.getUTCDate()));
        const utcTaskEnd = new Date(Date.UTC(taskEnd.getUTCFullYear(), taskEnd.getUTCMonth(), taskEnd.getUTCDate()));
        
        return utcNow >= utcTaskStart && utcNow < utcTaskEnd;
    });
    
    const actualTask = tasks.find(
        t => t.task_type === 'task' && (!t.task_done || t.task_actual_current)
    );
    
    if (!actualTask || !projectedTask || !foundParentTask) {
        return {
            status: 'Unknown',
            current_task: project.current_task,
            task_phase: project.task_phase,
            is_behind: false
        };
    }
    
    // ---- TASK DATES ----
    const findDate = (name, key = 'task_start') => {
        const task = tasks.find(t => t.task_name === name);
        if (!task || !task[key]) return null;
        
        // Convert to ISO string and extract date part only
        const dateValue = new Date(task[key]);
        return isNaN(dateValue.getTime()) ? null : dateValue.toISOString().split('T')[0];
    };
    
    const installation_start_date = findDate('Mechanical Installation', 'task_start');
    const end_date = findDate('Final Cleaning / Hand over', 'task_end');
    const start_date = findDate('Preliminaries', 'task_start');
    const tnc_start_date = findDate('Testing and Commissioning', 'task_start');
    const manufacturing_end_date = findDate('Manufacturing and Importation Process', 'task_end');
    const prepFinalHandoverDate = findDate('Final Cleaning / Hand over', 'task_start')
    const templateSettingDate = findDate('Template Setting', 'task_start')
    
    // ---- STATUS FLAGS ----
    const in_tnc = project.tnc_assign_date ? 
        (new Date(project.tnc_assign_date) <= now ? 1 : 0) : 0;
    
    const in_qaqc = project.qaqc_inspection_date ? 
        (new Date(project.qaqc_inspection_date) <= now) : false;
    
    const joint_inspection = project.pms_joint_inspection ? 
        (new Date(project.pms_joint_inspection) <= now) : false;
    
    // ---- STATUS CALCULATION ----
    const phaseName = foundParentTask ? 
        (summaryMap[foundParentTask.task_name] || foundParentTask.task_name) : 
        'Unknown Phase';
    
    const foundCurrentTask = actualTask.task_name;
    const is_behind = actualTask.task_id !== projectedTask.task_id;

    
    // console.log('---------------line 214---------------')
    // console.log(`project ${project.id} is in ${foundCurrentTask}`)
    // Resuming Project
    
    return {
        status: summaryMap[foundParentTask.task_name] || 'N/A',
        start_date,
        end_date,
        manufacturing_end_date,
        tnc_start_date,
        installation_start_date,
        current_task: foundCurrentTask,
        task_start: actualTask.task_start,
        task_end: actualTask.task_end,
        task_done: actualTask.task_done,
        task_phase: phaseName,
        phase_full_name: foundParentTask.task_name,
        in_tnc,
        in_qaqc: in_qaqc ? 1 : 0,
        joint_inspection: joint_inspection ? 1 : 0,
        current_task_id: actualTask.task_id,
        task_phase_id: foundParentTask.task_id,
        is_behind: is_behind ? 1 : 0,
        holdDays,
        isOnHold: false,
        willResume,
        prepFinalHandoverDate,
        templateSettingDate
    };
}

static async updateSingleProjectStatus(projectId, statusInfo) {
    const {
        status,
        start_date,
        end_date,
        manufacturing_end_date,
        tnc_start_date,
        installation_start_date,
        current_task,
        task_start,
        task_end,
        task_done,
        task_phase,
        phase_full_name,
        in_tnc,
        in_qaqc,
        joint_inspection,
        current_task_id,
        is_behind,
        holdDays,
        isOnHold,
        willResume,
        task_phase_id,
        prepFinalHandoverDate,
        templateSettingDate
    } = statusInfo;
    // console.log(`project ${projectId} will resume: ${willResume}`)
    if (isOnHold && !willResume) {
        await pool.query(
            `UPDATE projects SET status = 'Pending', days_since_hold = ? WHERE id = ?`,
            [holdDays, projectId]
        );
        return;
    }
    
    // Update current task in schedule
    if (current_task_id) {
        await pool.query(
            `UPDATE project_${projectId}_schedule SET task_actual_current = 0 WHERE task_actual_current = 1`
        );
        await pool.query(
            `UPDATE project_${projectId}_schedule SET task_actual_current = 1 WHERE task_id = ?`,
            [current_task_id]
        );
    }
    // console.log(`project ${projectId} will resume: `, willResume, `Task Phase: ${task_phase} Full Name: ${phase_full_name}`)
    // console.log(projectId)
    // Resume Project
    if (willResume) {
      await pool.query(`update projects set on_hold = 0, will_resume = 0, 
        resume_date = null, request_resume = 0, request_hold = 0, status = ? where id = ?`, [task_phase, projectId])
    }
    
    // Update project main data
    await pool.query(
        `UPDATE projects SET 
            start_date = ?,
            manufacturing_end_date = ?,
            project_end_date = ?,
            status = ?,
            tnc_start_date = ?,
            installation_start_date = ?,
            current_task = ?,
            task_start = ?,
            task_end = ?,
            task_done = ?,
            task_phase = ?,
            in_tnc = ?,
            current_task_id = ?,
            is_behind = ?,
            days_since_hold = ?,
            task_phase_id = ?,
            prep_handover_date = ?,
            template_setting_date = ?
        WHERE id = ?`,
        [
            start_date,
            manufacturing_end_date,
            end_date,
            status,
            tnc_start_date,
            installation_start_date,
            current_task,
            task_start,
            task_end,
            task_done,
            phase_full_name,
            in_tnc,
            current_task_id,
            is_behind,
            holdDays,
            task_phase_id,
            prepFinalHandoverDate,
            templateSettingDate,
            projectId
        ]
    );
    // console.log(`project ${projectId} is in ${current_task}`)
    // Handle QAQC and TNC flags
    if (in_qaqc) {
        await pool.query(
            `UPDATE projects SET qaqc_ongoing = 1, qaqc_approval = 1 WHERE id = ?`,
            [projectId]
        );
    }
    
    if (joint_inspection) {
        await pool.query(
            `UPDATE projects SET pms_ongoing = 1 WHERE id = ?`,
            [projectId]
        );
    }
}

    static async getContractPhoto(id) {
      const [results] = await pool.query(`
          select p.id, p.lift_name, c.photo_url from projects p 
          join project_contract_photos c on p.id = c.project_id where project_id = ?; 
        `, [id])
      return results
    }

    static async createProject(project, files){
      
        const {
            liftName,
            description,
            cap,
            drive,
            doorOperator,
            speed,
            control,
            stops,
            servingFloor,
            travel,
            powerSupply,
            shaft,
            shaftSize,
            carSize,
            doorSize,
            overheadHeight,
            pitDepth,
            clientName,
            address,
            equipmentType,
            region,
            province,
            city,
            island_group
        } = project;

        const [results] = await pool.query(
            `INSERT INTO projects 
                (lift_name, description, cap, drive, door_operator, speed,
                 control, stops, serving_floor, travel, power_supply, shaft, shaft_size, 
                 car_size, door_size, overhead_height, pit_depth, client, product_type, region, \`province\`, \`city/municipality\`, island_group) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                liftName,
                description,
                cap,
                drive,
                doorOperator,
                speed,
                control,
                stops,
                servingFloor,
                travel,
                powerSupply,
                shaft,
                shaftSize,
                carSize,
                doorSize,
                overheadHeight,
                pitDepth,
                clientName,
                equipmentType,
                region,
                province,
                city,
                island_group
            ]
        );
        const newProjectId = results.insertId;
        await pool.query(`insert into project_manpower(project_id) values (?)`, [newProjectId])
        for (const file of files) {
        const filePath = "/uploads/" + file.filename;
        await pool.query(
            `INSERT INTO project_contract_photos (project_id, photo_url) VALUES (?, ?)`,
            [newProjectId, filePath]
        );
        }
        return results
    }

    static async updateProjects(project){
        const {
            id,
            lift_name,
            description,
            cap,
            speed,
            stops,
            travel,
            overhead_height,
            pit_depth,
            manufacturing_end_date,
            project_end_date
        } = project;

        const formatDate = (date) => {
            if (!date) return null
            return new Date(date).toISOString().split("T")[0]
        }

        const [results] = await pool.query(
            `UPDATE projects 
             SET lift_name = ?, description = ?, cap = ?, speed = ?, stops = ?, 
                 travel = ?, overhead_height = ?, pit_depth = ?, 
                 manufacturing_end_date = ?, project_end_date = ?
             WHERE id = ?`,
            [
                lift_name,
                description,
                cap,
                speed,
                stops,
                travel,
                overhead_height,
                pit_depth,
                formatDate(manufacturing_end_date),
                formatDate(project_end_date),
                id
            ]
        );

        return results
    }


static async getProjectSchedule(id) {
    const checkQuery = `show tables like 'project_${id}_schedule'`
    const [check] = await pool.query(checkQuery)
    if (check.length === 0) return []
    
    // Convert UTC dates to your timezone in the query
    const query = `
        SELECT *, 
               CONVERT_TZ(task_start, '+00:00', '+08:00') as task_start_local,
               CONVERT_TZ(task_end, '+00:00', '+08:00') as task_end_local
        FROM project_${id}_schedule
    `;
    const [results] = await pool.query(query);
    if (!results) return []
    
    const sortedTasks = results.sort((a, b) => {
        // Use the local timezone dates for sorting
        const dateDiff = new Date(a.task_start_local) - new Date(b.task_start_local);
        if (dateDiff !== 0) return dateDiff;

        // ... rest of your sorting logic remains the same
        const customOrder = {
            104: 1,
            200: 2,
            201: 3,
            300: 4,
            301: 5
        };
        
        const orderA = customOrder[a.task_id] || 999;
        const orderB = customOrder[b.task_id] || 999;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        if (a.task_id !== b.task_id) {
            return a.task_id - b.task_id;
        }
        
        if (a.task_type === "summary" && b.task_type !== "summary") return -1;
        if (a.task_type !== "summary" && b.task_type === "summary") return 1;
        
        return 0;
    });

    return sortedTasks;
}

  // Get Project Holidays
  static async holidaysPerProject (projId) {
      // console.log(`Line 486: ${projId}`)
    const [result] = await pool.query(`select holiday from project_holidays where project_id = ?`, [projId])
    const holidays = result.map(r => new Date(r.holiday).toLocaleDateString())
    return holidays
  }

//adjust intsallation start
static async adjustInstallationStart(projId, data) {
  const { date } = data
  const getScheduleQuery = `select * from project_${projId}_schedule`
  const [schedule] = await pool.query(getScheduleQuery)
  const holidays = await this.holidaysPerProject(Number(projId))
  //project schedule parameters
  const [schedParams] = await pool.query(`select days, start_date from projects where id = ?`, [projId])
  const start_date = schedParams[0].start_date
  const isCalendarDays = schedParams[0].days === 'calendar' ? true : false
  const adjustedSchedule = new LinkedList(new Date(start_date), isCalendarDays, holidays)
        const sortedTasks = schedule.sort((a, b) => {
        // First, sort by start date as the primary criteria
        const dateDiff = new Date(a.task_start) - new Date(b.task_start);
        if (dateDiff !== 0) return dateDiff;

        // For tasks starting at the same time, apply custom ordering
        // Only reorder the specific concurrent projects (200, 201, 300, 301)
        const customOrder = {
            104: 1,  // Submission of PO to Factory (comes first)
            200: 2,  // Structural/Civil Works
            201: 3,  // Shaft Construction
            300: 4,  // Manufacturing and Importation Process
            301: 5   // Manufacturing and Importation
        };
        
        const orderA = customOrder[a.task_id] || 999; // Default high number for others
        const orderB = customOrder[b.task_id] || 999;
        
        // If both have custom ordering, use that
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        // For non-concurrent tasks or tasks with same custom order, 
        // sort by task_id numerically
        if (a.task_id !== b.task_id) {
            return a.task_id - b.task_id;
        }
        
        // Summary tasks before regular tasks
        if (a.task_type === "summary" && b.task_type !== "summary") return -1;
        if (a.task_type !== "summary" && b.task_type === "summary") return 1;
        
        return 0;
    });
    adjustedSchedule.importTasksWithDates(schedule)
    adjustedSchedule.printListData()
    console.log('-------here in line 567-------')
    console.log(date)
    adjustedSchedule.adjustInstallationStart(projId, new Date(date))
    //adjustedSchedule.printListData()
  
      const editedSchedule = adjustedSchedule.toArray()
      const checkQuery = `show tables like 'project_${projId}_schedule'`
    const [results] = await pool.query(checkQuery)
    if(results.length !== 0) {
      const deleteQuery = `drop table project_${projId}_schedule`
      await pool.query(deleteQuery)
    }
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS project_${projId}_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        task_name VARCHAR(255),
        task_start DATE,
        task_end DATE,
        task_duration INT,
        task_type VARCHAR(255),
        task_parent INT,
        task_approval TINYINT(1) DEFAULT 0,
        task_done TINYINT(1) DEFAULT 0,
        task_percent INT DEFAULT 0,
        task_actual_current tinyint default 0,

        -- Added columns
        section_title VARCHAR(255),
        item_code VARCHAR(10),
        description VARCHAR(255),
        unit VARCHAR(50),
        wt DECIMAL(5,2) DEFAULT 0.00,
        pres_acc DECIMAL(5,2) DEFAULT 0.00,
        prev_acc DECIMAL(5,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
      const insertPromises = editedSchedule.map(async (t) => {
      const insertQuery = `
        INSERT INTO project_${projId}_schedule 
          (task_id, task_name, task_start, task_end, task_duration, task_done, task_actual_current, task_type, task_parent, task_percent, section_title, item_code, wt, unit, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        t.task_id || t.task_id,
        t.task_name || t.task_name,
        t.task_start || null,
        t.task_end || null,
        t.task_duration || 1,
        t.task_done,
        t.task_actual_current,
        t.task_type || 'task',
        t.task_parent || null,
        t.task_percent || 0,
        t.section_title || null,
        t.item_code || null,
        t.wt || 0.00,
        t.unit || 1,
        t.task_name
      ];

      return pool.query(insertQuery, values);
    });
    await Promise.all(insertPromises)

}

static async getTaskPhotos(id) {
  // console.log(`Line 608: ${id}`)
  const [results] = await pool.query('select * from task_photos where project_id = ?', [id])
  return results
}

    static async completeTask(updates, percent, id) {
      console.log('here in complete task')
        if (updates.length === 0) {
            throw new Error("Nothing to update");
        }
   
        const promises = Object.keys(updates).map(key => {
            const { task_id } = updates[key];
      
            const tableQuery = `update project_${id}_schedule set task_done = 1, pres_acc = 100.00 where task_id = ?`
            return pool.query(
                tableQuery,
                [task_id]  
                ).catch(err => {
                console.error(`Error updating project ${id}:`, err)
                })
        });

         await Promise.all(promises)
         await pool.query(`update projects set progress = ?, qaqc_approval = 0, tnc_approval = 0 where id = ?`, [percent, id])
    }

   static async makeProjectSchedule(data, id) {
    const {tasks, holidays, isCalendarDays} = data
    const days = !isCalendarDays ? 'working' : 'calendar'
  try {
    const checkQuery = `show tables like 'project_${id}_schedule'`
    const [results] = await pool.query(checkQuery)
    if(results.length !== 0) {
      const deleteQuery = `drop table project_${id}_schedule`
      await pool.query(deleteQuery)
    }
    // Create the table (with new columns already included)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS project_${id}_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        task_name VARCHAR(255),
        task_start DATE,
        task_end DATE,
        task_duration INT,
        task_type VARCHAR(255),
        task_parent INT,
        task_approval TINYINT(1) DEFAULT 0,
        task_done TINYINT(1) DEFAULT 0,
        task_percent INT DEFAULT 0,
        task_actual_current tinyint default 0,

        -- Added columns
        section_title VARCHAR(255),
        item_code VARCHAR(10),
        description VARCHAR(255),
        unit VARCHAR(50),
        wt DECIMAL(5,2) DEFAULT 0.00,
        pres_acc DECIMAL(5,2) DEFAULT 0.00,
        prev_acc DECIMAL(5,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Sort data by start date and hierar chy
    const sortedTasks = tasks.sort((a, b) => {
      const dateDiff = new Date(a.task_start) - new Date(b.task_start);
      if (dateDiff !== 0) return dateDiff;
      if (a.task_type === "summary" && b.task_type !== "summary") return -1;
      if (a.task_type !== "summary" && b.task_type === "summary") return 1;
      return 0;
    });

    // Insert all tasks with additional fields
    const insertPromises = sortedTasks.map(async (t) => {
      const insertQuery = `
        INSERT INTO project_${id}_schedule 
          (task_id, task_name, task_start, task_end, task_duration, task_type, task_parent, task_percent, section_title, item_code, wt, unit, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        t.task_id || t.task_id,
        t.task_name || t.task_name,
        t.task_start || null,
        t.task_end || null,
        t.task_duration || 1,
        t.task_type || 'task',
        t.task_parent || null,
        t.task_percent || 0,
        t.section_title || null,
        t.item_code || null,
        t.wt || 0.00,
        t.unit || 1,
        t.task_name
      ];

      return pool.query(insertQuery, values);
    });
    const holidayInserts = holidays.map(h => (
      pool.query(`insert into project_holidays (project_id, holiday) values (?, ?)`, [id, h])
    ))

    await Promise.all(insertPromises);
    await Promise.all(holidayInserts);
    const initializeQuery = `update project_${id}_schedule set task_actual_current = 1 where task_id = 101`
    await pool.query(initializeQuery)
    await pool.query(`update projects set schedule_created = 1, days = ? where id = ?`, [days, id])
    
    return { success: true, message: `Schedule created with ${tasks.length} tasks` };
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}


    static async updateProjectStatus(updates) {
    const promises = Object.keys(updates).map(async (key) => {
      const { 
        id, status, start_date, end_date, 
        manufacturing_end_date, tnc_start_date, 
        installation_start_date, foundCurrentTask, 
        phaseName, in_tnc, in_qaqc, actualTaskId, joint_inspection,
        handover_done, is_behind, holdDays, isOnHold, currentTask_id
      } = updates[key];

      if(handover_done) return
      if(holdDays) {
        await pool.query(`update projects set days_since_hold = ? where id = ?`, [holdDays, id])
      }
      if(isOnHold) {
        await pool.query(`update projects set status = 'Pending' where id = ?`, [id])
        return 
      }

      try {
        // Run main project update
        await pool.query(
          `UPDATE projects 
          SET start_date = ?, 
              manufacturing_end_date = ?, 
              project_end_date = ?, 
              status = ?, 
              tnc_start_date = ?, 
              installation_start_date = ?, 
              current_task = ?, 
              task_phase = ?, 
              in_tnc = ?,
              current_task_id = ? 
          WHERE id = ?`,
          [
            start_date,
            manufacturing_end_date,
            end_date,
            status,
            tnc_start_date,
            installation_start_date,
            foundCurrentTask,
            phaseName,
            in_tnc,
            actualTaskId,
            id,
          ]
        );

        const cleanScheduleQuery = `update project_${id}_schedule set task_actual_current = 0`
        await pool.query(cleanScheduleQuery)
        console.log('UMAABOT BA DITO')
        const projectScheduleQuery = `update project_${id}_schedule set task_actual_current = 1 where task_id = ?`
        await pool.query(projectScheduleQuery, [currentTask_id])

        
        // ✅ Check to see if TNC and QAQC should be ongoing
        if (in_tnc === 1) {
          // Example: update a related table or log it
          await pool.query(
            `UPDATE projects SET tnc_ongoing = 1 WHERE id = ?`,
            [id]
          );
        }
        if (in_qaqc) {
          await pool.query(
            `UPDATE projects SET qaqc_ongoing = 1, qaqc_approval = 1 WHERE id = ?`,
            [id]
          );

          const [qaqcId] = await pool.query(`select qaqc_id from project_manpower where project_id = ?`, [id])
          const Ids = qaqcId.map(q => q.qaqc_id)
          
          await utility.changeUserStatus(Ids, 'active')
        }

        if (joint_inspection){
          await pool.query( 
            `update projects set pms_ongoing = 1 where id = ?`,
            [id]
          )
        }
        if(is_behind){
          await pool.query(`update projects set is_behind = 1 where id =?`, [id])
        } else {
          await pool.query(`update projects set is_behind = 0 where id =?`, [id])
        }
      } catch (err) {
        console.error(`Error updating project ${id}:`, err);
      }
    });

    await Promise.all(promises);

        return
    }

    static async submitProjectReport(report, files, id){
        const {
            workCompleted,
            workPlannedNextDay,
            delaysIssues,
            remarks,
            fullName
        } = report
        const [result] =  await pool.query(`
                insert into project_daily_report (project_id, workCompleted, workPlannedNextDay, delaysIssues, remarks, author)
                values (?, ?, ?, ?, ?, ?)
            `, [id, workCompleted, workPlannedNextDay,delaysIssues, remarks, fullName])

      
        const reportId = result.insertId
        for (const file of files) {
        const filePath = "/uploads/" + file.filename;
        await pool.query(
            `INSERT INTO daily_report_photos (report_id, photo_url) VALUES (?, ?)`,
            [reportId, filePath]
        );
        }
        return
    }

    static async retrieveProjectReport(id) {
        const [results] = await pool.query(`select dr.*, drp.photo_url from project_daily_report dr join daily_report_photos drp on dr.id = drp.report_id where project_id = ?`, [id])
        return results
    }

    static async retrieveProjectAccomplishment(id) {
        const query = `select * from project_${id}_accomplishment`
        const [results] = await pool.query(query)
        return results
    }

  static async fillKickOffChecklist(data, projectId) {
    const query = `
      UPDATE kickoff_checklist
      SET
        project_name = ?,
        site_address = ?,
        project_no = ?,
        project_date = ?,
        client_name = ?,
        pic_name = ?,
        contact_no = ?,
        elevator_type = ?,
        finishes = ?,
        install_method = ?,
        design_req = ?,
        building_status = ?,
        project_others = ?,
        toolbox = ?,
        qaqc = ?,
        drawing = ?,
        installation_manual = ?,
        start_date = ?,
        project_schedule = ?,
        completion_date = ?,
        manpower = ?,
        tools = ?,
        program_others = ?,
        lodging = ?,
        other_req = ?
      WHERE id = ?
    `;

    const values = [
      data.projectName,
      data.siteAddress,
      data.projectNo,
      data.date || null,
      data.clientName,
      data.picName,
      data.contactNo,
      data.projectDetails.elevatorType,
      data.projectDetails.finishes,
      data.projectDetails.installMethod,
      data.projectDetails.designReq,
      data.projectDetails.buildingStatus,
      data.projectDetails.others,
      data.mobilization.toolbox ? 1 : 0,
      data.mobilization.qaqc ? 1 : 0,
      data.mobilization.drawing ? 1 : 0,
      data.mobilization.manual ? 1 : 0,
      data.program.startDate || null,
      data.program.schedule,
      data.program.completionDate || null,
      data.program.manpower,
      data.program.tools,
      data.program.others,
      data.otherReq.lodging,
      data.otherReq.others,
      projectId
    ];

    const [result] = await pool.query(query, values);

    // Optional: if no row was updated, insert new one
    if (result.affectedRows === 0) {
      await pool.query(
        `INSERT INTO kickoff_checklist (
          project_name, site_address, project_no, project_date,
          client_name, pic_name, contact_no,
          elevator_type, finishes, install_method, design_req, building_status, project_others,
          toolbox, qaqc, drawing, installation_manual,
          start_date, project_schedule, completion_date,
          manpower, tools, program_others,
          lodging, other_req,
          project_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values
      );
    }
  }

  static async getKickOffChecklist(id) {
    const [rows] = await pool.query(
      `SELECT * FROM kickoff_checklist WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
        await pool.query('insert into kickoff_checklist (id, project_name) values (?, ?)', [id, ''])
        const here = await pool.query(`SELECT * FROM kickoff_checklist WHERE id = ? LIMIT 1`, [id])
        return here
    }
    return rows
  }

  static async getPTNCChecklist (id) {
      const [rows] = await pool.query(
      "SELECT * FROM qaqc_checklist WHERE project_id = ?",
      [id]
    );

    if (rows.length > 0) {
      return rows[0] // ✅ checklist found
    }

    // ❌ no checklist found → create a new blank one
    const blankChecklist = {
      project_id: id,
      project_name: "",
      order_number: "",
      location: "",
      lift_type: "",
      foreman: "",
      general_comments: "",
      foreman_signature: "",
      inspector_signature: "",
      qaqc_signature: "",
      date: new Date(),
      items_json: JSON.stringify(Array(74).fill({ accepted: "", remarks: "" }))
    };

    await pool.query(
      `INSERT INTO qaqc_checklist 
        (project_id, project_name, order_number, location, lift_type, foreman, general_comments,
         foreman_signature, inspector_signature, qaqc_signature, date, items_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blankChecklist.project_id,
        blankChecklist.project_name,
        blankChecklist.order_number,
        blankChecklist.location,
        blankChecklist.lift_type,
        blankChecklist.foreman,
        blankChecklist.general_comments,
        blankChecklist.foreman_signature,
        blankChecklist.inspector_signature,
        blankChecklist.qaqc_signature,
        blankChecklist.date,
        blankChecklist.items_json
      ]
    );

    return blankChecklist
  }

  static async fillPTNCChecklist (id, data) {
      const {
        project_name,
        order_number,
        location,
        lift_type,
        foreman,
        general_comments,
        foreman_signature,
        inspector_signature,
        qaqc_signature,
        date,
        items
      } = data

          const [result] = await pool.query(
      `UPDATE qaqc_checklist SET
        project_name = ?,
        order_number = ?,
        location = ?,
        lift_type = ?,
        foreman = ?,
        general_comments = ?,
        foreman_signature = ?,
        inspector_signature = ?,
        qaqc_signature = ?,
        date = ?,
        items_json = ?
      WHERE project_id = ?`,
      [
        project_name,
        order_number,
        location,
        lift_type,
        foreman,
        general_comments,
        foreman_signature,
        inspector_signature,
        qaqc_signature,
        date,
        JSON.stringify(items),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Checklist not found" });
    }

  }

  static async foremanApprove (projId, data, photos) {
    const { task_id, task_name, start_date, end_date, task_duration, task_percent} = data
    const query = `update project_${projId}_schedule set task_approval = 1 where task_id = ?;`
    await pool.query(query, [task_id])

    for (const photo of photos) {
      const filePath = "/uploads/" + photo.filename;
        await pool.query(
            `INSERT INTO task_photos (project_id, task_name, task_id, start_date, end_date, photo_url, task_duration, task_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [projId, task_name, task_id, start_date, end_date, filePath, task_duration, task_percent]
        );
      }
    
  }

  // QAQC Area
  static async requestProjQAQC (projId, date, reason) {
    await pool.query(`update projects set qaqc_inspection_date = ?, qaqc_inspection_reason = ?, qaqc_pending = 1, qaqc_approval = 1, qaqc_ongoing = 0, qaqc_is_assigned = 0 where id = ?`, [date, reason, projId])
  }

  static async addQAQCInspectionRecord (projId, data, qaqcId) {
    const {inspection_type, inspection_reason, inspection_date} = data
    const [results] =  await pool.query(`
        insert qaqc_inspection_history (project_id, inspection_type, inspection_reason, inspection_date, qaqc_id)
        values (?, ?, ?, ?, ?)
      `, [projId, inspection_type, inspection_reason, inspection_date, qaqcId])

    const newInspectionId = results.insertId;
    //set the current qaqc inspection id of the projct
    await pool.query(`update projects set current_qaqc_id = ? where id = ?`, [newInspectionId, projId])
  }

  static async assignProjQAQC (data) {
    const {projId, qaqcId, inspection_date} = data
    await pool.query(`update project_manpower set qaqc_id = ? where project_id = ?`, [qaqcId, projId])
    await pool.query(`update projects set qaqc_pending = 0, qaqc_is_assigned = 1, qaqc_ongoing = 0, qaqc_inspection_date = ? where id = ?`, [inspection_date, projId])
    await this.addQAQCInspectionRecord(projId, data, qaqcId)

  }

  static async getQAQCHistory (projId) {
    const [results] = await pool.query(`
      select p.id, p.lift_name, qh.inspection_reason, qh.inspection_date, qh.inspection_complete,
            qh.qaqc_id, concat(e.last_name, ' ', e.first_name) as \`full_name\`, pip.photo_url, pip.checklist, qp.doc_url as \`punchlist_url\`
            from projects p 
			join qaqc_inspection_history qh on qh.project_id = p.id
            left join employees e on e.employee_id = qh.qaqc_id
            left join project_inspection_photos pip on pip.inspection_id = qh.id
            left join qaqc_punchlisting qp on qp.inspection_id = qh.id where p.id = ?    
      `, [projId])

const grouped = results.reduce((acc, item) => {
  const projectId = item.id;

  // 1. Initialize project
  if (!acc[projectId]) {
    acc[projectId] = {
      lift_name: item.lift_name,
      inspections: []
    };
  }

  // 2. Create unique key per inspection
  const inspectionKey =
    item.inspection_reason + "|" + item.inspection_date;

  // 3. Check if this inspection already exists
  let existing = acc[projectId].inspections.find(
    (i) => i._key === inspectionKey
  );

  // 4. If not found, create it
  if (!existing) {
    existing = {
      _key: inspectionKey, // internal key (remove later if needed)
      inspection_reason: item.inspection_reason,
      inspection_date: item.inspection_date,
      inspection_complete: item.inspection_complete,
      qaqc_id: item.qaqc_id,
      full_name: item.full_name,
      photos: [],
      checklists: [],
      punchlist_urls: []
    };

    acc[projectId].inspections.push(existing);
  }

  // 5. Push photo/checklist/punchlist if they exist
  if (item.photo_url) existing.photos.push(item.photo_url);
  if (item.checklist) existing.checklists.push(item.checklist);
  if (item.punchlist_url) existing.punchlist_urls.push(item.punchlist_url);

  return acc;
}, {});


    return grouped

  }

  static async ongoingProjQAQC (projId) {
    await pool.query(`update projects set qaqc_approval = 1, qaqc_ongoing = 1, qaqc_pending = 0 where id = ?`, [projId])
  }

static async completeProjQAQC (projId, data, photos) {
  const { inspection_id, checklist } = data;
  const { documents, evidence } = photos
  // get a connection for transaction
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // mark inspection record complete
    await conn.query(
      `UPDATE qaqc_inspection_history SET inspection_complete = 1 WHERE id = ?`,
      [inspection_id]
    );

    // insert photos
    if (documents !== undefined) {
      for (const photo of documents) {
        const filePath = "/uploads/" + photo.filename;
        await conn.query(
          `INSERT INTO project_inspection_photos (inspection_id, checklist, photo_url) VALUES (?, ?, ?)`,
          [inspection_id, checklist, filePath]
        );
      }    
    }


    // reset project inspection flags and set qaqc_approval = 0 (0 = done/no inspection)
    await conn.query(
      `UPDATE projects
       SET qaqc_inspection_date = NULL,
           qaqc_inspection_reason = NULL,
           current_qaqc_id = NULL,
           qaqc_pending = 0,
           qaqc_is_assigned = 0,
           qaqc_ongoing = 0,
           qaqc_approval = 0
       WHERE id = ?`,
      [projId]
    );

    // clear assigned qaqc_id in project_manpower for this project
    await conn.query(
      `UPDATE project_manpower SET qaqc_id = NULL WHERE project_id = ?`,
      [projId]
    );

    const [qaqcId] = await pool.query(`select qaqc_id from project_manpower where project_id = ?`, [projId])
    const Ids = qaqcId.map(q => q.qaqc_id)
    
    await utility.changeUserStatus(Ids, 'Inactive')

    await conn.commit();
    conn.release();
    return true;
  } catch (err) {
    await conn.rollback().catch(() => {});
    conn.release();
    console.error("Error in ProjectModel.completeProjQAQC:", err);
    throw err;
  }
}

static async qaqcPunchlisting (projId, photos) {
  const {punchlist, evidence} = photos
  const [result] = await pool.query(`select current_qaqc_id from projects where id = ?`, [projId])
  const inspectionId = result[0].current_qaqc_id
  await pool.query(`update projects set qaqc_punchlist = 1 where id = ?`, [projId])
    for (const photo of punchlist) {
  const filePath = "/uploads/" + photo.filename;
    await pool.query(
        `insert into qaqc_punchlisting (inspection_id, doc_url, project_id) values (?, ?, ?)`,
        [inspectionId, filePath, projId]
    );
  }
}

//GET TNC QAQC FOREMAN EVIDENCE PHOTOS
static async getQAQCPunchlist (inspectionId) {
  const [results] = await pool.query(`select photo_url from qaqc_punchlisting where inspection_id = ?`, [inspectionId])
  return results
}

static async getQAQCPhotos (inspectionId) {
  const [results] = await pool.query(`select photo_url from project_inspection_photos where inspection_id = ?`, [inspectionId])
  return results
}

static async getTaskEvidencePhotos (projId, taskId) {
  const [results] = await pool.query(`select photo_url from task_photos where project_id = ? and task_id = ?`, [projId, taskId])
  return results
}



static async rectifyItems (projId) {
  await pool.query(`update projects set qaqc_punchlist = 0 where id = ?`, [projId])
}

  //TNC Area
  static async requestProjTNC (projId, date) {
    //sets tnc inspection date and renders it in pending status
    await pool.query(`update projects set tnc_is_assigned = 0, tnc_assign_date = ?, tnc_pending = 1, tnc_ongoing = 0 where id = ?`, [date, projId])
  }

  static async assignProjTNC (projId, tncId) {
    await pool.query(`update project_manpower set tnc_tech_id = ? where project_id = ?`, [tncId, projId])
    await pool.query(`update projects set tnc_pending = 1, tnc_is_assigned = 1, tnc_ongoing = 0 where id = ?`, [projId])
  }

  static async ongoingProjTNC (projId) {
    await pool.query(`update projects set tnc_ongoing = 1, tnc_pending = 0 where id = ?`, [projId])
  }

  static async approveProjTaskTNC(projId, data, photos){
    const { task_id, task_name, start_date, end_date, task_duration, task_percent, checklist_type} = data
    const query = `update project_${projId}_schedule set task_approval = 1 where task_id = ?;`
    await pool.query(query, [task_id])

    const {evidence, documents} = photos

    if(evidence !== null) {
      if(evidence.length !== 0) {
        for (const photo of evidence) {
        const filePath = "/uploads/" + photo.filename;
          await pool.query(
              `INSERT INTO task_photos (project_id, task_name, task_id, start_date, end_date, photo_url, task_duration, task_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [projId, task_name, task_id, start_date, end_date, filePath, task_duration, task_percent]
          );
        }
      }     
    }


    if(documents !== undefined) {
      if(documents.length !== 0){
              for (const photo of documents) {
        const filePath = "/uploads/" + photo.filename;
          await pool.query(
              `INSERT INTO tnc_inspection_documents (project_id, checklist_type, photo_url) VALUES (?, ?, ?)`,
              [projId, checklist_type, filePath]
          );
        }
      }      
    }

    //console.log(photos.evidence)

  }

  static async completeProjTNC(projId, files, documentNames) {
    try {
      // Ensure documentNames is always an array
      const docNames = Array.isArray(documentNames)
        ? documentNames
        : [documentNames];

      const insertQueries = files.map((file, index) => {
        const documentName = docNames[index] || null; // match doc type
        const photoUrl = `/data/uploads/${file.filename}`;

        return pool.query(
          `INSERT INTO tnc_inspection_photos (project_id, document_name, photo_url) VALUES (?, ?, ?)`,
          [projId, documentName, photoUrl]
        );
      });

      await Promise.all(insertQueries);

      await pool.query(`
      update projects set tnc_pending = 0, tnc_is_assigned = 0, 
      tnc_ongoing = 0, tnc_approval = 0 where id = ?
    `, [projId])

      return true;
    } catch (error) {
      console.error("Error in Project.completeProjTNC:", error);
      throw error;
    }
  }

  //PMS
  static async requestProjPMS (projId, date) {
    await pool.query(`update projects set pms_joint_inspection = ?, pms_pending = 1, pms_ongoing = 0, pms_is_assigned = 0, pms_approval = 1 where id = ?`, [date, projId])
  }

  static async approveProjPMS (projId, pmsId) {
    console.log(`[${projId}, ${pmsId}]`)
    const results = await pool.query(`update projects set pms_pending = 0, pms_ongoing = 0, pms_is_assigned = 1 where id = ?`, [projId])
    await pool.query(`update project_manpower set pms_id = ? where project_id = ?`, [pmsId, projId])
  }

  //PMS finishes in joint inspection
  static async completePMSJoint (projId, data, photos) {
  const { task_id, task_name, start_date, end_date, task_duration, task_percent} = data
    await pool.query(`
        update projects set pms_approval = 0 where id = ?
      `, [projId])

      // insert photos

    for (const photo of photos) {
      const filePath = "/uploads/" + photo.filename;
        await pool.query(
            `INSERT INTO task_photos (project_id, task_name, task_id, start_date, end_date, photo_url, task_duration, task_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [projId, task_name, task_id, start_date, end_date, filePath, task_duration, task_percent]
        );
      } 
      

  }

  //Hold
  static async requestProjHold (projId, hold_reason) {
    await pool.query(`update projects set request_hold = 1, hold_reason = ? where id = ?`, [hold_reason, projId])
  }

  static async approveProjHold (projId) {
    await pool.query(`update projects set on_hold = 1, request_hold = 0, 
      hold_date = curdate(), tnc_is_assigned = 0, tnc_ongoing = 0, qaqc_is_assigned = 0,
      qaqc_ongoing = 0 where id = ?`, [projId])
    await pool.query(`delete from team_members where project_id = ?`, [projId])

    //clear project team since it is now in handover
    await pool.query(`update project_manpower set team_id = null, qaqc_id = null, pms_id = null, tnc_tech_id = null where project_id = ?`, [projId])
  }
  //Resume Process
  static async requestProjResume (projId, date) {
    await pool.query(`update projects set request_resume = 1, resume_date = ? where id = ?`, [date, projId])
  }

  // Resuem Project
  static async resumeProject (projId, resume_date) {
    const schedQuery = `select * from project_${projId}_schedule`
    const [schedule] = await pool.query(schedQuery)
        const sortedTasks = schedule.sort((a, b) => {
        // First, sort by start date as the primary criteria
        const dateDiff = new Date(a.task_start) - new Date(b.task_start);
        if (dateDiff !== 0) return dateDiff;

        // For tasks starting at the same time, apply custom ordering
        // Only reorder the specific concurrent projects (200, 201, 300, 301)
        const customOrder = {
            104: 1,  // Submission of PO to Factory (comes first)
            200: 2,  // Structural/Civil Works
            201: 3,  // Shaft Construction
            300: 4,  // Manufacturing and Importation Process
            301: 5   // Manufacturing and Importation
        };
        
        const orderA = customOrder[a.task_id] || 999; // Default high number for others
        const orderB = customOrder[b.task_id] || 999;
        
        // If both have custom ordering, use that
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        // For non-concurrent tasks or tasks with same custom order, 
        // sort by task_id numerically
        if (a.task_id !== b.task_id) {
            return a.task_id - b.task_id;
        }
        
        // Summary tasks before regular tasks
        if (a.task_type === "summary" && b.task_type !== "summary") return -1;
        if (a.task_type !== "summary" && b.task_type === "summary") return 1;
        
        return 0;
    });
    const [getData] = await pool.query(`select days, start_date, days_since_hold, current_task_id from projects where id = ?`, [projId])
    const daysPassed = getData[0].days_since_hold
    const lastTaskId = getData[0].current_task_id
    const start_date = getData[0].start_date
    const days = getData[0].days
    const holidays = []
    const adjustedSchedule = new LinkedList(new Date(start_date), (days === 'working' ? false : true), holidays)
    adjustedSchedule.importTasksWithDates(sortedTasks)
    console.log('last task_id-------------------------------------------------', lastTaskId)
    adjustedSchedule.postponeProject(601)
    console.log('--------------------resuming project-----------------------')
    adjustedSchedule.resumeProject(new Date(resume_date))
    
    const editedSchedule = adjustedSchedule.toArray()
    console.log(editedSchedule)
       const checkQuery = `show tables like 'project_${projId}_schedule'`
    const [results] = await pool.query(checkQuery)
    if(results.length !== 0) {
      const deleteQuery = `drop table project_${projId}_schedule`
      await pool.query(deleteQuery)
    }
    // Create the table (with new columns already included)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS project_${projId}_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT,
        task_name VARCHAR(255),
        task_start DATE,
        task_end DATE,
        task_duration INT,
        task_type VARCHAR(255),
        task_parent INT,
        task_approval TINYINT(1) DEFAULT 0,
        task_done TINYINT(1) DEFAULT 0,
        task_percent INT DEFAULT 0,
        task_actual_current tinyint default 0,

        -- Added columns
        section_title VARCHAR(255),
        item_code VARCHAR(10),
        description VARCHAR(255),
        unit VARCHAR(50),
        wt DECIMAL(5,2) DEFAULT 0.00,
        pres_acc DECIMAL(5,2) DEFAULT 0.00,
        prev_acc DECIMAL(5,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
      const insertPromises = editedSchedule.map(async (t) => {
      const insertQuery = `
        INSERT INTO project_${projId}_schedule 
          (task_id, task_name, task_start, task_end, task_duration, task_done, task_actual_current, task_type, task_parent, task_percent, section_title, item_code, wt, unit, description, pres_acc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        t.task_id || t.task_id,
        t.task_name || t.task_name,
        t.task_start || null,
        t.task_end || null,
        t.task_duration || 1,
        t.task_done,
        t.task_actual_current,
        t.task_type || 'task',
        t.task_parent || null,
        t.task_percent || 0,
        t.section_title || null,
        t.item_code || null,
        t.wt || 0.00,
        t.unit || 1,
        t.task_name,
         t.pres_acc || 0.00
      ];

      return pool.query(insertQuery, values);
    });
    await Promise.all(insertPromises)
    
    await pool.query(`update projects set will_resume = 1, resume_date = ? where id = ?`,[resume_date, projId])

  }

  //Handover process
  static async prepareProjHandover(projId, data, photos) {
    const { task_id, task_name, start_date, end_date, task_duration, task_percent} = data
    await pool.query(`update projects set prepare_handover = 1 where id = ?`, [projId])
    for (const photo of photos) {
      const filePath = "/uploads/" + photo.filename;
      await pool.query(
          `INSERT INTO task_photos (project_id, task_name, task_id, start_date, end_date, photo_url, task_duration, task_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [projId, task_name, task_id, start_date, end_date, filePath, task_duration, task_percent]
      );
    } 
      
  }

  static async projHandoverDone (projId, photos, data) {
    const { client, contract } = data
    await pool.query(`update projects set status = 'Completed', handover_done = 1, handover_date = curdate() where id =  ?`, [projId])
    //create pms entry
    await pool.query(`insert into pms_projects(id, contract_type) values (?, ?)`, [projId, contract])
    await pool.query(`
        update pms_projects set free_pms_end = DATE_ADD(handover_date, INTERVAL 1 YEAR) where id = ?
      `, [projId])
    //get team id


    // Before deleting the team members each one must first get their previous foreman ID for next rotation
    const [foremanToGet] = await pool.query(`
        select foreman_id from team_members where project_id = ? limit 1;
      `, [projId])
    const [membersToGet] = await pool.query(`
       select emp_id from team_members where project_id = ?;
      `, [projId])

    const foremandId = foremanToGet[0].foreman_id  
    const members = membersToGet.map(m => m.emp_id)
    for (const member of members) {
      await pool.query(`update employees set prev_foreman = ? where employee_id = ?`, [foremandId, member])
    }
    console.log('success')

    //clear team members
    await pool.query(`delete from team_members where project_id = ?`, [projId])

    //clear project team since it is now in handover
    await pool.query(`delete from project_manpower where project_id = ?`, [projId])

    await pool.query(`insert into client_baby_book (pms_id, book_name) values (?, ?)`, [projId, client])
    await pool.query(`insert into contracts (baby_book_id) values (?)`, [projId])
      for (const photo of photos) {
      const filePath = "/uploads/" + photo.filename;
      await pool.query(
          `INSERT INTO handover_documents (project_id, doc_url) values (?, ?)`,
          [projId, filePath]
      );
    } 
  }

  static async getScheduleTemplate (template) {
    console.log(`getting ${template} teplate`)
    if(template === null || template === undefined) {
      const [results] = await pool.query(`select * from default_tasks`)
      return results
    }
  }

}

export { ProjectModel }
