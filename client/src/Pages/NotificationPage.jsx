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
          <i className="fas fa-inbox"></i>
          <h3>Notification Not Found</h3>
          <p>The notification you're looking for doesn't exist.</p>
          <button 
            className="action-btn btn-primary"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='Content NotificationPage'>
      <a className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-chevron-left"></i>
        Back to Notifications
      </a>
      
      <div className='notification-header'>
        <h3>{foundNotif.subject}</h3>
        <div className="notification-meta">
          <span className="meta-item">
            <i className="fas fa-calendar-alt"></i>
            {foundNotif.date || 'Today'}
          </span>
          <span className="meta-item">
            <i className="fas fa-clock"></i>
            {foundNotif.time || 'Just now'}
          </span>
          <span className={`notification-status ${foundNotif.read ? 'status-read' : 'status-unread'}`}>
            <i className={`fas ${foundNotif.read ? 'fa-check-circle' : 'fa-circle'}`}></i>
            {foundNotif.read ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>
      
      <div className={`notification-body ${foundNotif.priority ? `priority-${foundNotif.priority}` : ''}`}>
        <p>{foundNotif.body}</p>
        
        {/* Example attachment section - you can conditionally render this */}
        {foundNotif.attachments && foundNotif.attachments.length > 0 && (
          <div className="notification-attachments">
            <div className="attachments-header">
              <i className="fas fa-paperclip"></i>
              Attachments ({foundNotif.attachments.length})
            </div>
            <div className="attachments-list">
              {foundNotif.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-icon">
                    <i className={`fas ${attachment.type === 'pdf' ? 'fa-file-pdf' : 'fa-file'}`}></i>
                  </div>
                  <div className="attachment-info">
                    <div className="attachment-name">{attachment.name}</div>
                    <div className="attachment-size">{attachment.size}</div>
                  </div>
                  <i className="fas fa-download"></i>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className='notification-actions'>
        <button className="action-btn btn-secondary">
          <i className="fas fa-undo"></i>
          Mark Unread
        </button>
        <button className="action-btn btn-primary">
          <i className="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>
  )
}

export default NotificationPage