import { ProjectModel as projects } from "../model/ProjectModel.js";
import { UtilitiesModel as utilities } from "../model/UtilitiesModel.js";
import { NotificationModel as notifications } from "../model/NotificationModel.js";
import { UserModel as users } from "../model/UserModel.js";

export default function utilitiesNamespace (usp) {
    usp.on("connection", (socket) => {
        console.log("Utilities namespace connected: ", socket.id)
        const refreshProjects = async () => {
            const results = await projects.getAllProjects()
            socket.emit('update_done', results)
        }

        socket.on("begin_qaqc_inspection", async (id, callback) => {
        try {
            console.log('begin');
            await projects.ongoingProjQAQC(id);
            await refreshProjects();

            // Send acknowledgment back to client
            if (callback) callback({ status: 'ok' });
        } catch (error) {
            console.error('Error during inspection:', error);
            if (callback) callback({ status: 'error', message: error.message });
        }
        });

        socket.on("begin_tnc_inspection", async (id, callback) => {
        try {
            console.log('begin');
            await projects.ongoingProjTNC(id);
            await refreshProjects();

            // Send acknowledgment back to client
            if (callback) callback({ status: 'ok' });
        } catch (error) {
            console.error('Error during inspection:', error);
            if (callback) callback({ status: 'error', message: error.message });
        }
        });


        // refresh project data for updated data
        socket.on("refresh_project_data", async () => {
            const results = await projects.getAllProjects()
   
            socket.emit("update_done", results)
        })
        // get real time data for corresponding project engineers
        socket.on("pe_projects", async (_, callback) => {
            const results = await utilities.peProjects()
            socket.emit("pe_projects_fetch_done", results)

            if (callback) callback()
        })
        // make and distribute notifications
        socket.on("new_notification", async (data, callback) => {
            // const results = await utilities.peProjects()
  
            try {
                console.log(data)
                await notifications.newNotification(data)
                const results = await notifications.getAllNotifications()
                callback({success: true})
                socket.broadcast.emit("notification_update_done", results)
            } catch (error) {
                console.error('Error: ', error)
                callback({success: false, error: error.message})
            }
        })
        // set contract amount
        socket.on("set_contract", async (data) => {
            const {amount, projId} = data
            console.log(data)
            try {
                await utilities.setContractAmount(Number(projId), amount)
                const results = await projects.getAllProjects()
                socket.emit("update_done", results)
            } catch (e) {
                console.error('Error during inspection:', error);
            }
        })
    })
}