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

        

       // console.log(`${r.id} has: ${(r.pms_inspection_date === null && r.last_inspection_date === null)}`)
        if (r.pms_inspection_date === null) {
            console.log('meron ba')
            // Determine base date (handover date or last inspection)
            const baseDate = r.last_inspection_date 
                ? dayjs(r.last_inspection_date)
                : r.handover_date 
                    ? dayjs(r.handover_date)
                    : dayjs();
          //  console.log(baseDate.format('YYYY-MM-DD'))
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
            pp.callback_ongoing,
            pp.callback_id,
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
                acc[key].employee_id = val.employee_id
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
        // console.log('---------------teams---------------')
        // console.log(teams)
        const sortedTeam = Object.entries(teams).map(t => {
            // console.log('inside object entries')
            // console.log(t[1])
            if (t[1].projects[0].project_id === null) {
                t[1].projects = []
                return t
            } else {
                return t
            }
        })

        // console.log(sortedTeam)
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
            left join contracts c on c.baby_book_id = cbb.pms_id
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
    static async assignTechnicians(pmsId, technicianIds, date) {
        console.log(technicianIds)
        console.log(pmsId)

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
            SET inspection_assigned = 1, pms_inspection_date = ?
            WHERE id = ?`,
            [date, pmsId]
        );

        // return { message: 'Technicians successfully assigned.' };
    }

    static async ongoingPMS (pmsId) {
        await pool.query(`update pms_projects set inspection_ongoing = 1 where id = ?`, [pmsId])

        //Get current contract id
        const [contract] = await pool.query(`select id from contracts where baby_book_id = ? and current_contract = 1`, [pmsId])
        const contractId = contract[0].id
        const [results] =  await pool.query(`insert into pms_history (pms_id, contract_id) values (?, ?)`, [pmsId, contractId])
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
            left join contracts c on c.baby_book_id = cbb.pms_id where p.id = ? and c.current_contract = 1;
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
        left join pms_inspection_documents pid on pid.contract_id = c.id
        where p.id = ?;   
        `, [id])
    
    const [callback_reports] = await pool.query(`
        select p.id, p.lift_name, pp.free_pms, ch.id as \`callback_history_id\`, c.id as \`contract_id\`, cd.document_name, cd.doc_url
        from projects p 
        join pms_projects pp on p.id = pp.id
        join client_baby_book cbb on cbb.pms_id = pp.id
        join contracts c on c.baby_book_id = cbb.pms_id
        join callback_history ch on ch.pms_id = pp.id
        left join callback_documents cd on cd.callback_id = ch.id
        where p.id = ?;   
        `, [id])
    
    const [callback_photos] = await pool.query(`
        select p.id, p.lift_name, pp.free_pms, ch.id as \`callback_history_id\`,  c.id as \`contract_id\`, cp.doc_url
        from projects p 
        join pms_projects pp on p.id = pp.id
        join client_baby_book cbb on cbb.pms_id = pp.id
        join contracts c on c.baby_book_id = cbb.pms_id
        join callback_history ch on ch.pms_id = pp.id
        left join callback_photos cp on cp.callback_id = ch.id
        where p.id = ?;   
        `, [id])
    
    const [contract_documents] = await pool.query(`
            select photo_url from project_contract_photos where project_id = ?;
        `, [id])
    
    const [contract_photo] = await pool.query(`
            select photo_url from project_contract_photos where project_id = ?;
        `, [id])
    console.log(contract_photo)
    const baby_book = {
        handOverDocs: handoverDocs,
        service_reports: service_reports,
        callback_reports: callback_reports,
        callback_photos: callback_photos,
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

    static async scheduleCallback (pmsId, technicianIds, date) {
        console.log('here to schedule callbak')
        await pool.query(`
                update pms_projects set callback_date = ? where id = ?
            `, [date, pmsId])

        //check if a callback is assigned/scheduled
        const [check] = await pool.query(`select * from callback_inspection_team where client_id = ?`, [pmsId])

        //delete if there is assigned
        if (check.length > 0) await pool.query(`delete from callback_inspection_team where client_id = ?`, [pmsId])

        const insertPromises = technicianIds.map(t => (
            pool.query(`insert into callback_inspection_team (pms_tech_id, client_id) values (?, ?)`, [t, pmsId])
        ))

        await Promise.all(insertPromises)
    }

    //Get all callback clients
    static async callbackDesignation (techId) {
        console.log(`Employee ${techId} logged in and is asking for callback designations`)
        const [results] = await pool.query(`
               select p.id, concat(p.lift_name, ' ', p.client) as \`project_name\`, concat(p.region, ', ', p.province, ', ', p.\`city\/municipality\`) as \`project_location\`, pp.callback_date, 
                pp.free_pms, cbb.book_name, c.id as \`contract_id\`, 
                e.employee_id, concat(e.last_name, ' ', e.first_name) as \`full_name\`, e.job
                from projects p 
                join pms_projects pp on p.id = pp.id
                left join client_baby_book cbb on pp.id = cbb.pms_id
                left join contracts c on c.baby_book_id = cbb.pms_id
                left join callback_inspection_team pt on pt.client_id = pp.id
                left join employees e on e.employee_id = pt.pms_tech_id 
                where e.employee_id = ?
            `, [techId])

        return results
    }

    //Begin callback
    static async ongoingCallback (pmsId) {

        await pool.query(`update pms_projects set callback_ongoing = 1 where id = ?`, [pmsId])

        //Get current contract id
        const [contract] = await pool.query(`select id from contracts where baby_book_id = ? and current_contract = 1`, [pmsId])
        const contractId = contract[0].id
        const [results] =  await pool.query(`insert into callback_history (pms_id, contract_id) values (?, ?)`, [pmsId, contractId])
        const insertId = results.insertId
        await pool.query(`update pms_projects set callback_id = ? where id = ?`, [insertId, pmsId])
    }

    static async getCallbackStatus (pmsId) {
        const [inspId] = await pool.query(`select callback_id from pms_projects where id = ?`, [pmsId])
        const inspectionId = inspId[0].callback_id
        const [results] = await pool.query (`
				select p.id, p.lift_name, pp.callback_date, ch.inspection_done from projects p 
                join pms_projects pp on p.id = pp.id
                join callback_history ch on ch.pms_id = pp.id where p.id = ? and pp.callback_id = 1;
            `, [pmsId, inspectionId])
        console.log('here in get callback status')
        console.log(results)
        return results[0]
    }

    //Callback Complete
// ==========================
//  MARK CALLBACK COMPLETE
// ==========================
static async markCallbackComplete(clientId, photos) {
    const { service_reports, evidence } = photos;
    
    // Get callback ID
    const [callbackIdResult] = await pool.query(
        `SELECT callback_id FROM pms_projects WHERE id = ?`, 
        [clientId]
    );
    const callbackId = callbackIdResult[0].callback_id;
    
    console.log('Completing callback for client:', clientId);
    console.log('Callback ID:', callbackId);
    console.log('Service reports:', service_reports);
    console.log('Evidence:', evidence);

    // // Update callback status - reset callback flags and set completion
    await pool.query(`
        UPDATE pms_projects 
        SET callback_ongoing = 0, callback_date = NULL, callback_id = NULL 
        WHERE id = ?
    `, [clientId]);

    // // Mark callback inspection as done in history
    await pool.query(`
        UPDATE callback_history 
        SET inspection_done = 1
        WHERE id = ?
    `, [callbackId]);

    // // Get current contract ID
    const [contractResult] = await pool.query(`
        SELECT id FROM contracts 
        WHERE baby_book_id = ? AND current_contract = 1
    `, [clientId]);
    const contractId = contractResult[0].id;

    // // Upload service report documents
    if (service_reports && service_reports.length > 0) {
        for (const report of service_reports) {
            const filePath = "/uploads/" + report.filename;
            const originalName = report.originalname;
            console.log('Uploading service report:', filePath);
            
            await pool.query(
                `INSERT INTO callback_documents (callback_id, doc_url, contract_id, document_name) 
                 VALUES (?, ?, ?, ?)`,
                [callbackId, filePath, contractId, originalName]
            );
        }
    }

    // Upload evidence photos
    if (evidence && evidence.length > 0) {
        for (const photo of evidence) {
            const filePath = "/uploads/" + photo.filename;
            console.log('Uploading evidence:', filePath);
            
            await pool.query(
                `INSERT INTO callback_photos (callback_id, doc_url, contract_id) 
                 VALUES (?, ?, ?)`,
                [callbackId, filePath, contractId]
            );
        }
    }

    // Clear callback inspection team
    await pool.query(
        `DELETE FROM callback_inspection_team WHERE client_id = ?`, 
        [clientId]
    );

    console.log('Callback completed successfully for client:', clientId);
    return { success: true, callbackId };
}

    //Client will renew contract
    static async renewContract (clientId, data) {
        const {contract_start_date, contract_end_date} = data
        await pool.query(`insert into contracts (baby_book_id, contract_start_date, contract_end_date, current_contract = 1, free_pms = 0)
            values (?, ?, ?, 1, 0)`, [clientId, contract_start_date, contract_end_date])
    }

    //Archive Project (Client will not renew contract)
    static async cancelContract (clientId) {
        await pool.query(`update projects set archived = 1 where id = ?`, [clientId])
    }

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