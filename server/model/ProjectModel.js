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
        console.log(name)
        const [results] = await pool.query(
            'select id from projects where lift_name = ?',
            [name]
        )
   
        return results
    }

    static async getAllProjects(){
        const [results] = await pool.query(
            'SELECT * FROM projects'
        )
        return results
    }

    static async createProject(project){
        console.log('hits')
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
            equipmentType
        } = project;

        const [results] = await pool.query(
            `INSERT INTO projects 
                (lift_name, description, cap, drive, door_operator, speed,
                 control, stops, serving_floor, travel, power_supply, shaft, shaft_size, 
                 car_size, door_size, overhead_height, pit_depth, client, address, product_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                address,
                equipmentType
            ]
        );
        console.log("Insert results:", results);
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
        console.log(typeof id)
        const promises = Object.keys(updates).map(key => {
            const { task_id } = updates[key];
            console.log(task_id)
            console.log(id)
            const tableQuery = `update project_${id}_schedule set task_done = 1 where task_id = ?`
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
        // Create the table
        const createTableQuery = `CREATE TABLE IF NOT EXISTS project_${id}_schedule (
            id INT AUTO_INCREMENT PRIMARY KEY,  -- Added for insertion order
            task_id INT,
            task_name VARCHAR(255),
            task_start DATE,
            task_end DATE,
            task_duration INT,
            task_type VARCHAR(255),
            task_parent INT,
            task_done TINYINT(1) DEFAULT 0,
            task_percent int default 0
        )`;
        await pool.query(createTableQuery);
        const sortedTasks = tasks.sort((a, b) => {
        const dateDiff = new Date(a.task_start) - new Date(b.task_start);

        if (dateDiff !== 0) return dateDiff;

        if (a.task_type === "summary" && b.task_type !== "summary") return -1;
        if (a.task_type !== "summary" && b.task_type === "summary") return 1;

        return 0; 
        });

        // Use Promise.all() to insert all tasks concurrently
        const insertPromises = sortedTasks.map(async (t) => {
            const insertQuery = `INSERT INTO project_${id}_schedule 
                (task_id, task_name, task_start, task_end, task_duration, task_type, task_parent, task_percent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            
            const values = [
                t.task_id,
                t.task_name,
                t.task_start, // Convert to YYYY-MM-DD
                t.task_end,   // Convert to YYYY-MM-DD
                t.task_duration || 1,
                t.task_type || 'task',
                t.task_parent || null,
                t.task_percent
            ];

            return pool.query(insertQuery, values);
        });

        
        await Promise.all(insertPromises);
        const [rsult] = await pool.query('select * from project_799_schedule')
    

        return { success: true, message: `Schedule created with ${tasks.length} tasks` };
        
    } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
    }

}

    static async updateProjectStatus(updates) {
        console.log('here in project model')
      
        const promises = Object.keys(updates).map(key => {
            const { id, status } = updates[key];
            return pool.query(
            'UPDATE projects SET status = ? WHERE id = ?',
            [status, id]  
            ).then(() => {
            console.log(`Updated project ${id} -> ${status}`);
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
        const [results] = await pool.query(`select * from project_daily_report where project_id = ?`, [id])
        return results
    }

    static async retrieveProjectAccomplishment(id) {
        const query = `select * from project_${id}_accomplishment`
        const [results] = await pool.query(query)
        return results
    }
}

export { ProjectModel }
