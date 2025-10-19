import { ProjectModel as projects } from "../model/ProjectModel.js";
import { UtilitiesModel as utilities } from "../model/UtilitiesModel.js";
import { NotificationModel as notifications } from "../model/NotificationModel.js";

export default function utilitiesNamespace (usp) {
    usp.on("connection", (socket) => {
        console.log("Utilities namespace connected: ", socket.id)
        // refresh project data for updated data
        socket.on("refresh_project_data", async () => {
            const results = await projects.getAllProjects()
   
            socket.emit("update_done", results)
        })
        // get real time data for corresponding project engineers
        socket.on("pe_projects", async () => {
            const results = await utilities.peProjects()
     
            socket.emit("pe_projects_fetch_done", results)
        })
        // make and distribute notifications
        socket.on("new_notification", async (data, callback) => {
            // const results = await utilities.peProjects()
            console.log(data)
            try {
                await notifications.newNotification(data)
                const results = await notifications.getAllNotifications()
                console.log(results)
                callback({success: true})
                socket.broadcast.emit("notification_update_done", results)
            } catch (error) {
                callback({success: false, error: error.message})
            }
        })
    })
}