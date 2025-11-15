import { pool } from '../config/database.js'
import { io } from '../server.js'

class NotificationModel {
    static async getAllNotifications() {
        const [results] = await pool.query(`
            SELECT nr.id, n.notification_id, n.subject, n.body, e.username, e.employee_id, n.notify_date, nr.mark_read
            FROM notification n
            JOIN notification_recipients nr
                ON n.notification_id = nr.notification_id
            JOIN employees e
                ON nr.employee_id = e.employee_id
        `)
         return results
    }

    static async getNotificationsById(id) {
        const [results] = await pool.query(`
            SELECT nr.id n.notification_id, n.subject, n.body, nr.employee_id, e.username, n.notify_date
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
        const [results] =  await pool.query(`
            INSERT INTO notification (subject, body) VALUES (?, ?)
        `, [notification.subject, notification.body]) // ✅ use array

        console.log('-----------------------------this is create-----------------------------------')
        const notificationId = results.insertId

        const insertPromises = notification.Ids.map(i => {
            return pool.query('insert into notification_recipients (notification_id, employee_id) values (?, ?);', [notificationId, i])
        })
        await Promise.all(insertPromises)
        // Get latest notification ID + row
        // const [latestId] = await pool.query('SELECT notification_id FROM notification ORDER BY notification_id DESC LIMIT 1;')
        // const [latestNotification] = await pool.query('SELECT * FROM notification ORDER BY notification_id DESC LIMIT 1;')

        // await this.distributeNotification(latestId, latestNotification)
    }

    static async readNotification(id) {
        console.log('here in read notification')
        console.log(id)
        await pool.query(`update notification_recipients set mark_read = 1 where id = ?`, [id])
    }
    static async readAllNotifications(empId) {
        console.log('here in read all notification')
        
        await pool.query(`update notification_recipients set mark_read = 1 where employee_id = ?`, [empId])
    }
}

export { NotificationModel }
