import { pool } from '../config/database.js'
import dotenv from 'dotenv'
dotenv.config()

class ProjectModel {
    static async findById(id){
        const [results] = await pool.query(
            'SELECT * FROM projects WHERE id = ?',
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

    static async getAllProjects(){
        const [results] = await pool.query(`
           SELECT 
          p.*, 
          pm.project_engineer_id,
          e.username AS project_engineer,
          concat(e.last_name, ' ', e.first_name) as 'pe_fullname'
      FROM projects p
      LEFT JOIN project_manpower pm 
          ON p.id = pm.project_id 
          left join employees e on e.employee_id = pm.project_engineer_id;
        `)
        return results
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
            city
        } = project;

        const [results] = await pool.query(
            `INSERT INTO projects 
                (lift_name, description, cap, drive, door_operator, speed,
                 control, stops, serving_floor, travel, power_supply, shaft, shaft_size, 
                 car_size, door_size, overhead_height, pit_depth, client, product_type, region, \`province/municipality\`, city) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                city
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
    const query = `SELECT * FROM project_${id}_schedule`;
    const [results] = await pool.query(query);
    if (!results) return
    const sortedTasks = results.sort((a, b) => {
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
    
    return sortedTasks;
}

    static async completeTask(updates, percent, id) {
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
         await pool.query(`update projects set progress = ? where id = ?`, [percent, id])
    }

   static async makeProjectSchedule(tasks, id) {
  try {
    const checkQuery = `show tables like 'project_${id}_schedule'`
    const [results] = await pool.query(checkQuery)
    console.log(results)
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

    // Sort tasks by start date and hierarchy
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

    await Promise.all(insertPromises);
    await pool.query(`update projects set schedule_created = 1 where id = ?`, [id])
    return { success: true, message: `Schedule created with ${tasks.length} tasks` };
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}


    static async updateProjectStatus(updates) {
        
   
      
        const promises = Object.keys(updates).map(key => {
            const { id, status, start_date, end_date, manufacturing_end_date, tnc_start_date, installation_start_date, foundCurrentTask } = updates[key];
            return pool.query(
            'UPDATE projects SET created_at = ?, manufacturing_end_date = ?, project_end_date = ? , status = ?, tnc_start_date = ?, installation_start_date = ?, current_task = ? WHERE id = ?',
            [start_date, manufacturing_end_date, end_date, status, tnc_start_date, installation_start_date, foundCurrentTask, id]  
            ).then(() => {

            }).catch(err => {
            console.error(`Error updating project ${id}:`, err);
            });
        });

        await Promise.all(promises)
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
        console.log(results)
        console.log('------------------------------')
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

    console.log(rows)
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

  static async foremanApprove (projId, taskId) {
    const query = `update project_${projId}_schedule set task_approval = 1 where task_id = ?;`
    await pool.query(query, [taskId])
  }
}

export { ProjectModel }
