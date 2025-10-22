import React from 'react'
import { useStoreState } from 'easy-peasy'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/NotificationPage.css'

const NotificationPage = () => {
  const { notifId } = useParams()
  const navigate = useNavigate()
  const notif = useStoreState(state => state.notifications)
  
  const foundNotif = notif.find(n => n.notification_id === Number(notifId))

  if (!foundNotif) {
    return (
      <div className='Content NotificationPage'>
        <div className="notification-empty">
          <i>📭</i>
          <h3>Notification Not Found</h3>
          <p>The notification you're looking for doesn't exist.</p>
          <button 
            className="action-btn btn-primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='Content NotificationPage'>
      <a className="back-button" onClick={() => navigate(-1)}>
        ← Back to Notifications
      </a>
      
      <div className='notification-header'>
        <h3>{foundNotif.subject}</h3>
        <div className="notification-meta">
          <span className="meta-item">
            <i>📅</i>
            {foundNotif.date || 'Today'}
          </span>
          <span className="meta-item">
            <i>🕒</i>
            {foundNotif.time || 'Just now'}
          </span>
          <span className={`notification-status ${foundNotif.read ? 'status-read' : 'status-unread'}`}>
            {foundNotif.read ? '✓ Read' : '● Unread'}
          </span>
        </div>
      </div>
      
      <div className={`notification-body ${foundNotif.priority ? `priority-${foundNotif.priority}` : ''}`}>
        <p>{foundNotif.body}</p>
        
        {/* Example attachment section - you can conditionally render this */}
        {foundNotif.attachments && foundNotif.attachments.length > 0 && (
          <div className="notification-attachments">
            <div className="attachments-header">
              <i>📎</i>
              Attachments ({foundNotif.attachments.length})
            </div>
            <div className="attachments-list">
              {foundNotif.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-icon">
                    {attachment.type === 'pdf' ? '📄' : '📎'}
                  </div>
                  <div className="attachment-info">
                    <div className="attachment-name">{attachment.name}</div>
                    <div className="attachment-size">{attachment.size}</div>
                  </div>
                  <i>⬇️</i>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className='notification-actions'>
        <button className="action-btn btn-secondary">
          <i>↻</i>
          Mark Unread
        </button>
        <button className="action-btn btn-primary">
          <i>🗑️</i>
          Delete
        </button>
      </div>
    </div>
  )
}

export default NotificationPage