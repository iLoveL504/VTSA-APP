// backend/namespaces/messageNamespace.js
import { MessageModel as messages } from "../model/MessageModel.js";

export default function messageNamespace(msp) {
  msp.on("connection", (socket) => {
    console.log("📩 Messages namespace connected:", socket.id);

    // ✅ Join user room (so we can emit to specific users)
    socket.on("join_user", (employee_id) => {
      socket.join(`user_${employee_id}`);
      console.log(`👤 User ${employee_id} joined messages namespace`);
    });

    // ✅ Fetch Inbox
    socket.on("fetch_inbox", async (employee_id) => {
      try {
        const inbox = await messages.getInboxByEmployeeId(employee_id);
        console.log(inbox)
        socket.emit("fetch_inbox_done", inbox);
      } catch (err) {
        console.error("❌ Fetch inbox error:", err);
      }
    });

    // ✅ Fetch Sent Messages
    socket.on("fetch_sent", async (employee_id) => {
      try {
        const sent = await messages.getSentMessagesByEmployeeId(Number(employee_id));
        console.log('sent')
        console.log(sent)
        socket.emit("fetch_sent_done", sent);
      } catch (err) {
        console.error("❌ Fetch sent error:", err);
      }
    });

    // ✅ Send Message
// ✅ Send Message - Fixed version
socket.on("send_message", async (data, callback) => {
  try {
    const { sender_id, content, recipients } = data;
    const result = await messages.sendMessage({ sender_id, content, recipients });
    callback({success: true})
    // Notify sender
    socket.emit("send_message_done", result);
    
    // Notify all recipients with their updated inbox
    for (const recipient_id of recipients) {
      // Fetch the updated inbox for each recipient
      const updatedInbox = await messages.getInboxByEmployeeId(recipient_id);
      msp.to(`user_${recipient_id}`).emit("new_message_done", updatedInbox);
    }
    
    // Also update sender's sent messages
    const updatedSent = await messages.getSentMessagesByEmployeeId(sender_id);
    socket.emit("fetch_sent_done", updatedSent);
    
  } catch (err) {
    callback({success: false})
    console.error("❌ Send message error:", err);
    socket.emit("send_message_error", { error: err.message });
  }
});

    // ✅ Mark as Read
    socket.on("mark_as_read", async ({ message_id, recipient_id }) => {
      try {
        console.log(message_id)
        await messages.markAsRead(message_id, recipient_id);
        const updatedInbox = await messages.getInboxByEmployeeId(recipient_id);
        
        console.log(updatedInbox)
        console.log('----------mark as read-------------')
        msp.to(`user_${recipient_id}`).emit("mark_as_read_done", {message_id, data: updatedInbox});
      } catch (err) {
        console.error("❌ Mark as read error:", err);
      }
    });

    // ✅ Delete Message
    socket.on("delete_message", async ({ message_id, sender_id }) => {
      try {
        await messages.deleteMessage(message_id, sender_id);
        socket.emit("delete_message_done", { message_id });
      } catch (err) {
        console.error("❌ Delete message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Messages namespace disconnected:", socket.id);
    });
  });
}
