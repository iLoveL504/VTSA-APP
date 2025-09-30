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
        console.log('this is the result', results)
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

    static async completeTask(task, id) {
        if (!id || isNaN(id)) {
            throw new Error("Invalid project ID");
        }

        const query = `
            UPDATE project_${id}_schedule
            SET task_done = 1
            WHERE task_name = ?
        `;
        // set current task to done
        await pool.query(query, [task]);
     
        const percentQuery = `select task_percent from project_${id}_schedule where task_name = ?`
        // get percent of task
        const [percent] = await pool.query(percentQuery, [task]);
        console.log(percent[0].task_percent)
        const percentToAdd = percent[0].task_percent

        const updateProgressQuery = `
            update projects set progress = progress + ? where id = ?;
        `
        //add that percent to progress
        await pool.query(updateProgressQuery, [percentToAdd, id])
        return
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
        console.log(tasks)
        await pool.query(createTableQuery);
        console.log(`Table project_${id}_schedule created successfully`);
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
        console.log('-----sorted tasks------')
        console.log(`All ${tasks.length} tasks inserted successfully`);

        return { success: true, message: `Schedule created with ${tasks.length} tasks` };
        
    } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
    }

}

    static async updateProjectStatus(updates) {
        console.log('here in project model')
        console.log(updates)
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
}

export { ProjectModel }
