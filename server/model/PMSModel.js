import { pool } from '../config/database.js';
import dayjs from 'dayjs';


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
            p.contract_amount,
            p.product_type,
            p.island_group,
            p.\`city\/municipality\` AS location,
            p.project_end_date,
            p.handover_date,
            p.handover_done,
            
            CASE
                WHEN pp.free_pms = 1 THEN 'Free PMS'
                ELSE 'PMS with contract'
            END AS pms_contract,
            pp.free_pms_end,
            pp.contract_type,
            pp.last_inspection_date,
            pp.pms_inspection_date,
            pp.inspection_pending,
            pp.inspection_assigned,
            pp.inspection_ongoing,
            pp.inspection_id,
            pp.callback_date,
            CASE 
                WHEN pp.inspection_ongoing = 1 THEN 'PMS Inspection Ongoing'
                WHEN pp.inspection_assigned = 1 THEN 'PMS Inspection Assigned'
                WHEN pp.inspection_pending = 1 THEN 'PMS Inspection Pending'
                ELSE 'No PMS Scheduled'
            END AS pms_status,
            DATEDIFF(CURDATE(), p.handover_date) AS days_since_handover
        FROM 
            projects p
        LEFT JOIN 
            pms_projects pp ON p.id = pp.id
        WHERE 
            p.handover_done = 1 and p.archived = 0
        ORDER BY 
            pp.pms_inspection_date ASC, 
            p.id ASC;
    `);
        console.log('in get pms')

        //If client refuses proposal, set client to be archived
        

    for (const r of rows) {
        if (new Date() === new Date(r.free_pms_end)) {
            if (!r.approve_proposal) {
                await pool.query(`update projects set archived = 1 where id = ?`, [r.id])
            }
        }

        console.log(`${r.id} has: ${(r.pms_inspection_date === null && r.last_inspection_date === null)}`)
        if (r.pms_inspection_date === null) {
            console.log('meron ba')
            // Determine base date (handover date or last inspection)
            const baseDate = r.last_inspection_date 
                ? dayjs(r.last_inspection_date)
                : r.handover_date 
                    ? dayjs(r.handover_date)
                    : dayjs();
            console.log(baseDate.format('YYYY-MM-DD'))
            // Determine interval based on contract type
            let setInspectionDate;

            switch (r.contract_type) {
                case 'Monthly':
                    setInspectionDate = baseDate.add(30, 'day').format('YYYY-MM-DD');
                    break;
                case 'Quarterly':
                    setInspectionDate = baseDate.add(3, 'month').format('YYYY-MM-DD');
                    break;
                case 'Yearly':
                    setInspectionDate = baseDate.add(12, 'month').format('YYYY-MM-DD');
                    break;
            }

            await pool.query(`
                UPDATE pms_projects 
                SET pms_inspection_date = ?, inspection_pending = 1 
                WHERE id = ?
            `, [setInspectionDate, r.id]);
        }
    }

    return rows;
}

    // ==========================
    //  GET PMS Client by Id
    // ==========================

    static async getPMSClient(projId) {
        const [rows] = await pool.query(`
            SELECT 
            p.id,
            p.lift_name,
            p.contract_amount,
            p.client,
            p.product_type,
            p.island_group,
            p.\`city\/municipality\`,
            p.province,
            p.region,
            p.\`city\/municipality\` AS location,
            p.project_end_date,
            p.handover_date,
            p.handover_done,
            CASE
                WHEN pp.free_pms = 1 THEN 'Free PMS'
                else 'PMS with contract'
            END as pms_contract,
            pp.free_pms_end,
            pp.contract_type,
            pp.last_inspection_date,
            pp.approve_proposal,
            pp.pms_inspection_date,
            pp.inspection_pending,
            pp.inspection_assigned,
            pp.inspection_ongoing,
            pp.inspection_id,
            pp.callback_date,
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
            p.handover_done = 1 and p.id = ? and p.archived = 0
        ORDER BY 
            pp.pms_inspection_date ASC, 
            p.id ASC;

        `, [projId]);
        return rows;
    }    

    // ==========================
    //  GET TECHNICIANS BY ISLAND
    // ==========================
    static async getAvailableTechnicians() {
        const [rows] = await pool.query(
        `select p.id, concat(p.lift_name, ' ', p.client) as \`project_name\`, concat(p.region, ', ', p.province, ', ', p.\`city\/municipality\`) as \`project_location\`, pp.pms_inspection_date, 
            pp.free_pms, cbb.book_name, c.id as \`contract_id\`, pp.inspection_ongoing, 
            e.employee_id, concat(e.last_name, ' ', e.first_name) as \`full_name\`, e.job, e.island_group
            from projects p 
            join pms_projects pp on p.id = pp.id
            left join client_baby_book cbb on pp.id = cbb.pms_id
            left join contracts c on c.baby_book_id = cbb.pms_id
            left join pms_inspection_team pt on pt.pms_id = pp.id
            right join employees e on e.employee_id = pt.pms_technician_id where e.job = 'PMS Technician'
; `
        );
        console.log('before')
        const teams = rows.reduce((acc, val) => {
            const key = val.full_name
            if(!acc[key]){
                acc[key] = {}
                acc[key].projects = []
                acc[key].island_group = val.island_group
            }

            const projInfo = {
                project_id: val.id,
                project_name: val.project_name,
                inspection_date: val.pms_inspection_date,
                project_location: val.project_location,
                ongoing: val.inspection_ongoing
            }
            acc[key].projects.push(projInfo)
            return acc
        }, {})

        const sortedTeam = Object.entries(teams).map(t => {
            console.log('inside object entries')
            console.log(t[1])
            if (t[1].projects[0].project_id === null) {
                t[1].projects = []
                return t
            } else {
                return t
            }
        })

        console.log(sortedTeam)
        // console.log(teams)

        // const [technicianTally] = await pool.query(`
        //     select pt.pms_technician_id, concat(e.last_name, ' ', e.first_name) as \`tech_full_name\`, count(pt.pms_id) as projects from pms_inspection_team pt
        //     join employees e on e.employee_id = pt.
        //     group by(pms_technician_id);
        //     `)

        const data ={teams}

        return sortedTeam;
    }

    // ==========================
    //  Get Designated Project for the Technician
    // ==========================

    static async getDesignatedProject(techId) {
        const [techs] = await pool.query(`
           select p.id, concat(p.lift_name, ' ', p.client) as \`project_name\`, concat(p.region, ', ', p.province, ', ', p.\`city\/municipality\`) as \`project_location\`, pp.pms_inspection_date, 
            pp.free_pms, cbb.book_name, c.id as \`contract_id\`, 
            e.employee_id, concat(e.last_name, ' ', e.first_name) as \`full_name\`, e.job
            from projects p 
            join pms_projects pp on p.id = pp.id
            left join client_baby_book cbb on pp.id = cbb.pms_id
            left join contracts c on c.baby_book_id = cbb.id
            left join pms_inspection_team pt on pt.pms_id = pp.id
            left join employees e on e.employee_id = pt.pms_technician_id where e.employee_id = ?
            `, [techId])
        const designated = techs.filter(t => t.employee_id === techId)

        const getPromises = designated.map(async (d) => {
             const [p] = await this.getPMSClient(d.id)
             return p
        })

        const resolvedProjects = await Promise.all(getPromises)
        return resolvedProjects
    } 

    static async setInspectionDate(pmsId, date) {
        console.log(pmsId)
        console.log(date)
        await pool.query(`
            update pms_projects set pms_inspection_date = ? where id = ?
        `, [date, pmsId])
    }

    // ==========================
    //  ASSIGN TECHNICIANS
    // ==========================
    static async assignTechnicians(pmsId, technicianIds) {
        console.log(technicianIds)
        console.log(pmsId)

        //refresh inspectionId (no id generated until inspection is conducted)
        await pool.query(`update pms_projects set inspection_id = null where id = ?`, [pmsId])
        //If it returns 0 it assigns otherwise edit clear technician_ids to make room for team
        const [exists] = await pool.query(`SELECT COUNT(pms_technician_id) FROM pms_inspection_team WHERE pms_id = ?;`, [pmsId])
        const edit = exists.length > 0 ? true : false

        if (edit) {
            await pool.query(`delete from pms_inspection_team where pms_id = ?`, [pmsId])
        }

        // Insert each technician
        const inserts = technicianIds.map((techId) =>
        pool.query(
            `INSERT INTO pms_inspection_team (pms_id, pms_technician_id)
            VALUES (?, ?)`,
            [pmsId, techId]
        )
        );

        await Promise.all(inserts);

        // // Update PMS project status to "assigned"
        await pool.query(
            `UPDATE pms_projects 
            SET inspection_assigned = 1 
            WHERE id = ?`,
            [pmsId]
        );

        // return { message: 'Technicians successfully assigned.' };
    }

    static async ongoingPMS (pmsId) {
        await pool.query(`update pms_projects set inspection_ongoing = 1 where id = ?`, [pmsId])
        const [results] =  await pool.query(`insert into pms_history (pms_id) values (?)`, [pmsId])
        const insertId = results.insertId
        await pool.query(`update pms_projects set inspection_id = ? where id = ?`, [insertId, pmsId])
    }

    // ==========================
    //  Project get inspection status
    // ==========================    
    static async getStatus (pmsId) {
        const [inspId] = await pool.query(`select inspection_id from pms_projects where id = ?`, [pmsId])
        const inspectionId = inspId[0].inspection_id
        const [results] = await pool.query (`
                select p.id, p.lift_name, pp.pms_inspection_date, ph.inspection_done from projects p 
                join pms_projects pp on p.id = pp.id
                join pms_history ph on ph.pms_id = pp.id where p.id = ? and pp.inspection_id = 1;
            `, [pmsId, inspectionId])
        console.log(results)
        return results[0]
    }

    // ==========================
    //  MARK INSPECTION COMPLETE
    // ==========================
    static async markInspectionComplete(pmsId, photos, inspectionDetails) {
        const {service_reports, evidence} = photos
        const [inspId] = await pool.query(`select inspection_id from pms_projects where id = ?`, [pmsId])
        const inspectionId = inspId[0].inspection_id
        console.log(service_reports)
        console.log('inside mark inspection')

        //update pms status
        await pool.query(`
            update pms_projects set inspection_assigned = 0, inspection_ongoing = 0, pms_inspection_date = null, last_inspection_date = curdate() where id = ?
        `, [pmsId])
        //mark inspection done
        await pool .query(`
            update pms_history set inspection_done = 1 where id = ?
            `, [inspectionId])
        //get inspectionId
        console.log('contract id')
        const [cId] = await pool.query(`
            select c.id as \`contract_id\`
            from projects p
            join pms_projects pp on p.id = pp.id
            left join client_baby_book cbb on pp.id = cbb.pms_id
            left join contracts c on c.baby_book_id = cbb.id where p.id = ? and c.current_contract = 1;
            `, [pmsId])
        console.log('i got hte ocntract id')
        
        const contractId = cId[0].contract_id
        if (service_reports !== undefined){
            for (const photo of service_reports) {
                const filePath = "/uploads/" + photo.filename;
                const originalName = photo.originalname
                console.log(filePath)
                await pool.query(
                    `INSERT INTO pms_inspection_documents (inspection_id, doc_url, contract_id, inspection_document_name) values (?, ?, ?, ?)`,
                    [inspectionId, filePath, contractId, originalName]
                );
            }             
        }

        if (evidence !== undefined) {
        for (const photo of evidence) {
            const filePath = "/uploads/" + photo.filename;
            await pool.query(
                `INSERT INTO pms_inspection_photos (inspection_id, doc_url, contract_id) values (?, ?, ?)`,
                [inspectionId, filePath, contractId]
            );
        }             
        console.log('delte queyr here')
        //clear team for that client
        
        }
        await pool.query(`delete from pms_inspection_team where pms_id = ?`, [pmsId])
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

    static async getBabyBook (id) {
        const [handoverDocs] = await pool.query(`
                select * from handover_documents where project_id = ?;
            `, [id])
        const [service_reports] = await pool.query(`
            select p.id, p.lift_name, pp.free_pms, ph.id as \`inspection_history_id\`, ph.report_details, ph.date_conducted, c.id as \`contract_id\`, pid.inspection_document_name, pid.doc_url
            from projects p join pms_projects pp on p.id = pp.id
            join client_baby_book cbb on cbb.pms_id = pp.id
            join contracts c on c.baby_book_id = cbb.pms_id
            join pms_history ph on ph.pms_id = pp.id
            join pms_inspection_documents pid on pid.contract_id = c.id
            where p.id = ?;   
            `, [id])
        const [contract_documents] = await pool.query(`
                select p.id, p.lift_name, pp.free_pms, cd.*
                from projects p join pms_projects pp on p.id = pp.id
                join client_baby_book cbb on cbb.pms_id = pp.id
                join contracts c on c.baby_book_id = cbb.pms_id
                join contract_documents cd on cd.contract_id = c.id where p.id = ?;
            `, [id])
        const [contract_photo] = await pool.query(`
                select * from project_contract_photos where project_id = ?;
            `, [id])
        const baby_book = {
            handOverDocs: handoverDocs,
            service_reports: service_reports,
            contract_documents: contract_documents,
            contract_photo: contract_photo
        }
        return baby_book
    }

    static async scheduleInspection (pmsId, date) {
        await pool.query(`
                update pms_projects set pms_inspection_date = ? where id = ?
            `, [date, pmsId])
    }
    
    //static async markInspectionComplete(pmsId, reportDetails) {
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
    // }
}

/*--------------------------- Draft Schema ----------------------*/

/* Keep note of this join statement*/

// select p.lift_name, p.client, pp.free_pms, cbb.book_name, c.id
// from projects p
// join pms_projects pp on p.id = pp.id
// join client_baby_book cbb on pp.id = cbb.pms_id
// join contracts c on c.baby_book_id = cbb.id; 


/* ------------Projects inspection history ------*/

/* -----Get project contracts ------*/
// select p.id, concat(p.lift_name, ' ', p.client) as `project_name`, concat(p.region, ', ', p.province, ', ', p.`city/municipality`) as `project_location`, pp.pms_inspection_date, 
//             pp.free_pms, cbb.id, cbb.id as `baby_book_id`, cbb.book_name, c.id as `contract_id`, c.current_contract
//             from projects p
//             join pms_projects pp on p.id = pp.id
//             left join client_baby_book cbb on pp.id = cbb.pms_id
//             left join contracts c on c.baby_book_id = cbb.id 

/* ----------Get current contract id of project---------------- */
// select c.id as `contract_id`
//             from projects p
//             join pms_projects pp on p.id = pp.id
//             left join client_baby_book cbb on pp.id = cbb.pms_id
//             left join contracts c on c.baby_book_id = cbb.id where p.id = 45 and c.current_contract = 1;