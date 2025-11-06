import { pool } from '../config/database.js'

class MessageModel {
    // ✅ Get all messages (for admin or history view)
    static async getAllMessages() {
        const [results] = await pool.query(`
            SELECT 
                m.message_id,
                m.content,
                m.created_at,
                m.sender_id,
                CONCAT(e.first_name, ' ', e.last_name) AS sender_name,
                r.recipient_id,
                r.is_read,
                r.read_at
            FROM messages m
            JOIN message_recipients r ON m.message_id = r.message_id
            JOIN employees e ON m.sender_id = e.employee_id
         
              where m.is_deleted = 0
            ORDER BY m.created_at DESC
        `)
        return results
    }

    // ✅ Get inbox (messages received by a specific employee)
    static async getInboxByEmployeeId(employeeId) {
        console.log('it goes here')
        const [results] = await pool.query(`
            SELECT 
                m.message_id,
                m.content,
                m.created_at,
                m.sender_id,
                CONCAT(e.first_name, ' ', e.last_name) AS sender_name,
                r.is_read,
                r.read_at
            FROM messages m
            JOIN message_recipients r ON m.message_id = r.message_id
            JOIN employees e ON m.sender_id = e.employee_id
            WHERE r.recipient_id = ?
              AND m.is_deleted = 0
            ORDER BY m.created_at DESC
        `, [employeeId])
        console.log('----here in get Inbo by employee')
        return results
    }

    // ✅ Get sent messages by a specific employee
    static async getSentMessagesByEmployeeId(employeeId) {
        const [results] = await pool.query(`
             SELECT 
                m.message_id,
                m.sender_id,
                CONCAT(e.first_name, ' ', e.last_name) AS sender_name,
                m.content,
                m.created_at,
                JSON_ARRAYAGG(re.last_name) AS recipients
                FROM messages m
                JOIN employees e ON e.employee_id = m.sender_id
                JOIN message_recipients r ON r.message_id = m.message_id
                join employees re on re.employee_id = r.recipient_id
                WHERE m.sender_id = ?
                GROUP BY m.message_id
                ORDER BY m.created_at DESC;

        `, [employeeId])
        return results
    }

    // ✅ Send new message (supports multiple recipients)
    static async sendMessage({ sender_id, content, recipients }) {
        const [messageResult] = await pool.query(`
            INSERT INTO messages (sender_id, content)
            VALUES (?, ?)
        `, [sender_id, content])

        const messageId = messageResult.insertId

        const insertPromises = recipients.map(recipientId =>
            pool.query(`
                INSERT INTO message_recipients (message_id, recipient_id)
                VALUES (?, ?)
            `, [messageId, recipientId])
        )
        await Promise.all(insertPromises)

        return { message_id: messageId, sender_id, recipients }
    }

    // ✅ Mark a message as read by recipient
    static async markAsRead(message_id, recipient_id) {
        await pool.query(`
            UPDATE message_recipients
            SET is_read = 1,
                read_at = NOW()
            WHERE message_id = ?
              AND recipient_id = ?
        `, [message_id, recipient_id])
    }

    // ✅ Soft delete message (for sender)
    static async deleteMessage(message_id, sender_id) {
        const [result] = await pool.query(`
            UPDATE messages
            SET is_deleted = 1
            WHERE message_id = ?
              AND sender_id = ?
        `, [message_id, sender_id])
        return result
    }

    // ✅ (Optional) Get message thread if you plan to use thread_id later
    static async getMessagesByThread(thread_id) {
        const [results] = await pool.query(`
            SELECT 
                m.message_id,
                m.content,
                m.created_at,
                CONCAT(e.first_name, ' ', e.last_name) AS sender_name
            FROM messages m
            JOIN employees e ON m.sender_id = e.employee_id
            WHERE m.thread_id = ?
            ORDER BY m.created_at ASC
        `, [thread_id])
        return results
    }
}

export { MessageModel }
