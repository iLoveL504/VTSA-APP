import { pool } from '../config/database.js'
import { io } from '../server.js'

class NotificationModel {
    static async getAllNotifications() {
        const [results] = await pool.query(`
            SELECT n.notification_id, n.subject, n.body, e.username
            FROM notification n
            JOIN notification_recipients nr
                ON n.notification_id = nr.notification_id
            JOIN employees e
                ON nr.employee_id = e.employee_id
        `)
        console.log(results)
        return results
    }

    static async getNotificationsById(id) {
        const [results] = await pool.query(`
            SELECT n.notification_id, n.subject, n.body, e.username
            FROM notification n
            JOIN notification_recipients nr
                ON n.notification_id = nr.notification_id
            JOIN employees e
                ON nr.employee_id = e.employee_id
            WHERE e.employee_id = ?
        `, [id]) // ✅ use array, not object
        return results
    }

    static async newNotification(notification) {
        // Insert new notification
        await pool.query(`
            INSERT INTO notification (subject, body) VALUES (?, ?)
        `, [notification.subject, notification.body]) // ✅ use array

        console.log('-----------------------------this is create-----------------------------------')

        // Get latest notification ID + row
        const [latestId] = await pool.query('SELECT notification_id FROM notification ORDER BY notification_id DESC LIMIT 1;')
        const [latestNotification] = await pool.query('SELECT * FROM notification ORDER BY notification_id DESC LIMIT 1;')

        await this.distributeNotification(latestId, latestNotification)
    }

    static async distributeNotification(latestId, latestNotification) {
        console.log('-----------------------------this is distribute-----------------------------------')
        console.log(latestId)

        const [id_results] = await pool.query(`
            SELECT employee_id FROM employees WHERE job = 'Project Engineer'
        `)

        for (const result of id_results) {
            await pool.query(`
                INSERT INTO notification_recipients (notification_id, employee_id) 
                VALUES (?, ?)
            `, [latestId[0].notification_id, result.employee_id]) // ✅ array

            console.log('--------------------notifications-----------------------')
            console.log(latestNotification)

            // Distribute real-time notifications to select employees
            io.to(`notifications_${result.employee_id}`).emit(
                'new_notification',
                latestNotification[0]
            )
        }
    }
}

export { NotificationModel }
