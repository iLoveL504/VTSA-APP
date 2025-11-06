import { pool } from '../config/database.js'
import { UtilitiesModel as utility } from './UtilitiesModel.js';
import dotenv from 'dotenv'
import LinkedList from '../../DataStructs/LinkedList.js';
dotenv.config()

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
          left join employees e on e.employee_id = pm.project_engineer_id where p.handover_done = 0 and p.id = ?`,
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
          left join employees e on e.employee_id = pm.project_engineer_id where p.handover_done = 0;
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

static async getTaskPhotos(id) {
  const [results] = await pool.query('select * from task_photos where project_id = ?', [id])
  return results
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
         await pool.query(`update projects set progress = ?, qaqc_approval = 0, tnc_approval = 0 where id = ?`, [percent, id])
    }

   static async makeProjectSchedule(data, id) {
    const {tasks, holidays, isCalendarDays} = data
    const days = !isCalendarDays ? 'working' : 'calendar'
    console.log(holidays)
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
    console.log('inside holidy inserts')
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
        phaseName, in_tnc, in_qaqc, currentTask_id, joint_inspection,
        handover_done, is_behind, holdDays, isOnHold
      } = updates[key];

      if(handover_done) return
      if(holdDays) {
        await pool.query(`update projects set days_since_hold = ? where id = ?`, [holdDays, id])
      }
      if(isOnHold) {
        console.log('doint this dang hold query')
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
            currentTask_id,
            id,
          ]
        );

        console.log(`proj ${id} is in: ${foundCurrentTask}`)
        console.log(`proj ${id} is in: ${phaseName}`)
        console.log(installation_start_date)
        const cleanScheduleQuery = `update project_${id}_schedule set task_actual_current = 0`
        await pool.query(cleanScheduleQuery)
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
          console.log(Ids)
          
          await utility.changeUserStatus(Ids, 'active')
        }

        if (joint_inspection){
          await pool.query( 
            `update projects set pms_ongoing = 1 where id = ?`,
            [id]
          )
        }
        if(is_behind){
          console.log(`project ${id} is behind`)
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

  static async foremanApprove (projId, data, photos) {
    const { task_id, task_name, start_date, end_date, task_duration, task_percent} = data
    const query = `update project_${projId}_schedule set task_approval = 1 where task_id = ?;`
    await pool.query(query, [task_id])
    console.log('safda')

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

  static async addQAQCInspectionRecord (projId, data) {
    const {inspection_type, inspection_reason, inspection_date} = data
    const [results] =  await pool.query(`
        insert qaqc_inspection_history (project_id, inspection_type, inspection_reason, inspection_date)
        values (?, ?, ?, ?)
      `, [projId, inspection_type, inspection_reason, inspection_date])

    const newInspectionId = results.insertId;
    //set the current qaqc inspection id of the projct
    await pool.query(`update projects set current_qaqc_id = ? where id = ?`, [newInspectionId, projId])
  }

  static async assignProjQAQC (data) {
    const {projId, qaqcId} = data
    await pool.query(`update project_manpower set qaqc_id = ? where project_id = ?`, [qaqcId, projId])
    console.log('do I run')
    await pool.query(`update projects set qaqc_pending = 0, qaqc_is_assigned = 1, qaqc_ongoing = 0 where id = ?`, [projId])
    await this.addQAQCInspectionRecord(projId, data)

  }

  static async ongoingProjQAQC (projId) {
    await pool.query(`update projects set qaqc_approval = 1, qaqc_ongoing = 1, qaqc_pending = 0 where id = ?`, [projId])
  }

static async completeProjQAQC (projId, data, photos) {
  const { inspection_id, checklist } = data;
  const { documents, evidence } = photos
  console.log('here at projQAQC')
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
    console.log(Ids)
    
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
  console.log(photos)
  const {punchlist, evidence} = photos
  const [result] = await pool.query(`select current_qaqc_id from projects where id = ?`, [projId])
  const inspectionId = result[0].current_qaqc_id
  await pool.query(`update projects set qaqc_punchlist = 1 where id = ?`, [projId])
    for (const photo of punchlist) {
  const filePath = "/uploads/" + photo.filename;
    await pool.query(
        `insert into qaqc_punchlisting (inspection_id, doc_url) values (?, ?)`,
        [inspectionId, filePath]
    );
  }
}

static async rectifyItems (projId) {
  console.log('rectify')
  await pool.query(`update projects set qaqc_punchlist = 0 where id = ?`, [projId])
}

  //TNC Area
  static async requestProjTNC (projId, date) {
    //sets tnc inspection date and renders it in pending status
    await pool.query(`update projects set tnc_is_assigned = 0, tnc_assign_date = ?, tnc_pending = 1, tnc_ongoing = 0 where id = ?`, [date, projId])
  }

  static async assignProjTNC (projId, tncId) {
    await pool.query(`update project_manpower set tnc_tech_id = ? where project_id = ?`, [tncId, projId])
    console.log('do I run')
    await pool.query(`update projects set tnc_pending = 1, tnc_is_assigned = 1, tnc_ongoing = 0 where id = ?`, [projId])
  }

  static async ongoingProjTNC (projId) {
    await pool.query(`update projects set tnc_ongoing = 1, tnc_pending = 0 where id = ?`, [projId])
  }

  static async approveProjTaskTNC(projId, data, photos){
    const { task_id, task_name, start_date, end_date, task_duration, task_percent, checklist_type} = data
    const query = `update project_${projId}_schedule set task_approval = 1 where task_id = ?;`
    await pool.query(query, [task_id])
    console.log('safda')

    const {evidence, documents} = photos
    console.log(evidence)

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
    console.log(results)
    await pool.query(`update project_manpower set pms_id = ? where project_id = ?`, [pmsId, projId])
  }

  //PMS finishes in joint inspection
  static async completePMSJoint (projId, data, photos) {
  const { task_id, task_name, start_date, end_date, task_duration, task_percent} = data
  console.log('complete pms approval')
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
  static async requestProjHold (projId) {
    await pool.query(`update projects set request_hold = 1 where id = ?`, [projId])
  }

  static async approveProjHold (projId) {
    await pool.query(`update projects set on_hold = 1, request_hold = 0, hold_date = curdate() where id = ?`, [projId])
  }

  // Resuem Project
  static async resumeProject (projId, data) {
    const schedQuery = `select * from project_${projId}_schedule`
    const [schedule] = await pool.query(schedQuery)
    console.log('so It wen heree')
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
    console.log(getData)
    console.log('0-------------------------------------0')
    console.log(start_date)
    const adjustedSchedule = new LinkedList(new Date(start_date), (days === 'working' ? false : true), holidays)
    sortedTasks.forEach((t) => adjustedSchedule.insertLast(t))
    adjustedSchedule.postponeProject(lastTaskId)
    adjustedSchedule.resumeProject(daysPassed)
    console.log('0-----------------------------------------------0')
    
    const editedSchedule = adjustedSchedule.toArray()
    console.log(adjustedSchedule.printListData())
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
    await Promise.all(insertPromises)
    await pool.query(`update projects set on_hold = 0, request_hold = 0 where id = ?`,[projId])

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
    console.log (data)
    await pool.query(`update projects set status = 'Completed', handover_done = 1, handover_date = curdate() where id =  ?`, [projId])
    //create pms entry
    await pool.query(`insert into pms_projects(id, contract_type) values (?, ?)`, [projId, contract])

    //get team id
    const [getId] = await pool.query(`select team_id from project_manpower where project_id = ?`, [projId])
    const team_id = getId[0].team_id

    //clear team members
    await pool.query(`delete from team_members where foreman_id = ?`, [team_id])

    //clear project team since it is now in handover
    await pool.query(`delete from project_manpower where project_id = ?`, [projId])

    const [result] =  await pool.query(`insert into client_baby_book (pms_id, book_name) values (?, ?)`, [projId, client])
    const insertId = result.insertId
    await pool.query(`insert into contracts (baby_book_id) values (?)`, [insertId])
      for (const photo of photos) {
      const filePath = "/uploads/" + photo.filename;
      await pool.query(
          `INSERT INTO handover_documents (project_id, doc_url) values (?, ?)`,
          [projId, filePath]
      );
    } 
  }

}

export { ProjectModel }
