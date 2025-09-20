import React from 'react'
import { useNavigate } from 'react-router-dom'

const Notification = ({n}) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/notification/${n.notification_id}`)
  }
  return ( 
     <li className="notification-item" onClick={handleClick}>
      <div className="notification-content">
        <h4 className="notification-title">{n.subject}</h4>
        <p className="notification-message">{n.body}</p>
        <div className="notification-meta">
          <span className="notification-time">Today, 10:45 AM</span>
          <span className="notification-status unread"></span>
        </div>
      </div>
    </li>
  )
}

export default Notification