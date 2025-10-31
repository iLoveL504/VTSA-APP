import { pool } from '../config/database.js';

export class PMSModel {
  // ==========================
  //  FETCH PMS CLIENTS
  // ==========================
    static async getAllPMS() {
        const [rows] = await pool.query(`
        SELECT 
            p.id,
            p.lift_name,
            p.client,
            p.product_type,
            p.island_group,
            p.\`city\/municipality\` AS location,
            p.project_end_date,
            p.handover_date,
            p.handover_done,
            CASE
                WHEN pp.free_pms = 1 THEN 'Free PMS'
                else 'PMS with contract'
            END as pms_contract,
            pp.pms_inspection_date,
            pp.inspection_pending,
            pp.inspection_assigned,
            pp.inspection_ongoing,
            pp.inspection_id,
            -- Status calculation based on PMS inspection flags
            CASE 
                WHEN pp.inspection_ongoing = 1 THEN 'PMS Inspection Ongoing'
                WHEN pp.inspection_assigned = 1 THEN 'PMS Inspection Assigned'
                WHEN pp.inspection_pending = 1 THEN 'PMS Inspection Pending'
                ELSE 'No PMS Scheduled'
            END AS pms_status,
            -- Days since handover
            DATEDIFF(CURDATE(), p.handover_date) AS days_since_handover
        FROM 
            projects p
        LEFT JOIN 
            pms_projects pp ON p.id = pp.id
        WHERE 
            p.handover_done = 1
        ORDER BY 
            pp.pms_inspection_date ASC, 
            p.id ASC;
        `);
        return rows;
    }

    // ==========================
    //  GET TECHNICIANS BY ISLAND
    // ==========================
    static async getAvailableTechnicians(islandGroup) {
        // const [rows] = await pool.query(
        // `SELECT employee_id, full_name, island_group
        // FROM employees
        // WHERE role = 'PMS Technician' AND island_group = ?`,
        // [islandGroup]
        // );
        // return rows;
    }

    // ==========================
    //  ASSIGN TECHNICIANS
    // ==========================
    static async assignTechnicians(pmsId, technicianIds = []) {
        // if (!Array.isArray(technicianIds) || technicianIds.length === 0)
        // throw new Error('At least one technician must be assigned.');

        // // Check how many techs are already assigned
        // const [existing] = await pool.query(
        // 'SELECT COUNT(*) AS count FROM pms_inspection_team WHERE id = ?',
        // [pmsId]
        // );

        // if (existing[0].count >= 2)
        // throw new Error('This PMS already has 2 assigned technicians.');

        // // Validate island group match
        // const [[pmsProject]] = await pool.query(
        // `SELECT p.island_group 
        // FROM projects p 
        // INNER JOIN pms_projects pp ON p.id = pp.id 
        // WHERE p.id = ?`,
        // [pmsId]
        // );

        // const [techs] = await pool.query(
        // `SELECT employee_id, island_group FROM employees WHERE employee_id IN (?)`,
        // [technicianIds]
        // );

        // for (const tech of techs) {
        // if (tech.island_group !== pmsProject.island_group) {
        //     throw new Error(
        //     `Technician ${tech.employee_id} is not from ${pmsProject.island_group}.`
        //     );
        // }
        // }

        // // Insert each technician
        // const inserts = technicianIds.map((techId) =>
        // pool.query(
        //     `INSERT INTO pms_inspection_team (id, pms_technician)
        //     VALUES (?, ?)`,
        //     [pmsId, techId]
        // )
        // );

        // await Promise.all(inserts);

        // // Update PMS project status to "assigned"
        // await pool.query(
        // `UPDATE pms_projects 
        // SET inspection_assigned = 1, inspection_pending = 0 
        // WHERE id = ?`,
        // [pmsId]
        // );

        // return { message: 'Technicians successfully assigned.' };
    }

    // ==========================
    //  MARK INSPECTION COMPLETE
    // ==========================
    static async markInspectionComplete(pmsId, reportDetails) {
        // const connection = await pool.getConnection();
        // try {
        // await connection.beginTransaction();

        // // Insert PMS history record
        // await connection.query(
        //     `INSERT INTO pms_history (pms_id, report_details, date_conducted)
        //     VALUES (?, ?, CURDATE())`,
        //     [pmsId, reportDetails]
        // );

        // // Mark PMS as completed
        // await connection.query(
        //     `UPDATE pms_projects
        //     SET inspection_ongoing = 0, inspection_assigned = 0, inspection_pending = 0
        //     WHERE id = ?`,
        //     [pmsId]
        // );

        // await connection.commit();
        // return { message: 'Inspection marked as completed.' };
        // } catch (err) {
        // await connection.rollback();
        // throw err;
        // } finally {
        // connection.release();
        // }
    }

    // ==========================
    //  FILE UPLOAD HANDLING
    // ==========================
    static async addPMSFile(pmsId, fileName, fileUrl) {
    //     await pool.query(
    //     `INSERT INTO pms_files (pms_id, file, file_url)
    //     VALUES (?, ?, ?)`,
    //     [pmsId, fileName, fileUrl]
    //     );
    // }

    // static async getPMSFiles(pmsId) {
    //     const [files] = await pool.query(
    //     `SELECT id, file, file_url FROM pms_files WHERE pms_id = ?`,
    //     [pmsId]
    //     );
    //     return files;
    }

    static async deletePMSFile(fileId) {
        // await pool.query(`DELETE FROM pms_files WHERE id = ?`, [fileId]);
        // return { message: 'File deleted successfully.' };
    }

    
    static async markInspectionComplete(pmsId, reportDetails) {
    //     const connection = await pool.getConnection();
    //     try {
    //     await connection.beginTransaction();

    //     // Step 1: Insert PMS history record
    //     await connection.query(
    //         `INSERT INTO pms_history (pms_id, report_details, date_conducted)
    //         VALUES (?, ?, CURDATE())`,
    //         [pmsId, reportDetails]
    //     );

    //     // Step 2: Get contract type for the PMS project
    //     const [[contract]] = await connection.query(
    //         `SELECT pp.contract_type, pp.pms_inspection_date 
    //         FROM pms_projects pp 
    //         WHERE pp.id = ?`,
    //         [pmsId]
    //     );

    //     let nextInspectionDate = null;
    //     if (contract && contract.contract_type) {
    //         const current = contract.pms_inspection_date
    //         ? dayjs(contract.pms_inspection_date)
    //         : dayjs();

    //         switch (contract.contract_type.toLowerCase()) {
    //         case 'monthly':
    //             nextInspectionDate = current.add(1, 'month').format('YYYY-MM-DD');
    //             break;
    //         case 'quarterly':
    //             nextInspectionDate = current.add(3, 'month').format('YYYY-MM-DD');
    //             break;
    //         case 'yearly':
    //             nextInspectionDate = current.add(12, 'month').format('YYYY-MM-DD');
    //             break;
    //         }
    //     }

    //     // Step 3: Update project status and next inspection date
    //     await connection.query(
    //         `UPDATE pms_projects
    //         SET 
    //         inspection_ongoing = 0,
    //         inspection_assigned = 0,
    //         inspection_pending = 0,
    //         pms_inspection_date = ?
    //         WHERE id = ?`,
    //         [nextInspectionDate, pmsId]
    //     );

    //     await connection.commit();

    //     return {
    //         message: 'Inspection marked as completed.',
    //         nextInspectionDate,
    //     };
    //     } catch (err) {
    //     await connection.rollback();
    //     throw err;
    //     } finally {
    //     connection.release();
    //     }
     }
}
