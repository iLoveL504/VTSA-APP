import { useEffect, useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { IoIosNotifications } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import useToggle from '../../hooks/useToggle';

import 'ldrs/react/Grid.css'
import { useStoreState } from 'easy-peasy'
//import { useSharedSocket } from '../../Context/SocketContext';

const NavBar = ({ invertMenuToggle }) => {
 // const { utilitiesSocket } = useSharedSocket()
  const user = useStoreState(state => state.user)
  const notifications = useStoreState(state => state.notifications)
  const [notifToggle, invertNotifToggle] = useToggle();
  const [notifs, setNotifs] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  // const [selectedNotif, setSelectedNotif] = useState(null)

  // const handleSelectNotif = (id) => () => {
  //   setSelectedNotif(id)
  // }

  useEffect(() => {
    if(notifications){
        const userNotifications = notifications.filter(n => 
          n.employee_id === Number(sessionStorage.getItem('id'))
        )
        console.log(userNotifications)
        setNotifs(userNotifications)
        setUnreadCount(userNotifications.length)
    }
  }, [notifications])

  const handleNotificationClick = (notif) => {
    console.log('Clicked:', notif)
    // Add your notification click logic here
    // Mark as read, navigate, etc.
  }

  const markAllAsRead = () => {
    // Add logic to mark all notifications as read
    setUnreadCount(0)
  }

  const clearAllNotifications = () => {
    // Add logic to clear all notifications
    setNotifs([])
    setUnreadCount(0)
  }

  return (
    <nav>
      <div onClick={() => invertMenuToggle()} className="Menu-icon">
        <IoMdMenu size={40} style={{ color: 'white' }}/>
      </div>
      
      <div className="Notification-Icon">
        <div 
          onClick={() => invertNotifToggle()} 
          className="notification-trigger"
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <IoIosNotifications className="BellIcon" size={30} style={{ color: 'white' }}/>
          {unreadCount > 0 && (
            <div className={`Notifications ${unreadCount > 0 ? 'pulse' : ''}`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
        
        {!notifToggle && (
          <div className="notification-dropdown show">
            <div className="notification-header">
              <h3>Notifications ({unreadCount})</h3>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <>
                    <button className="notification-action-btn" onClick={markAllAsRead}>
                      Mark all read
                    </button>
                    <button className="notification-action-btn" onClick={clearAllNotifications}>
                      Clear all
                    </button>
                  </>
                )}
                <button className="notification-action-btn" onClick={invertNotifToggle}>
                  <IoIosClose size={16} />
                </button>
              </div>
            </div>
            
            <div className="notification-list">
              {notifs.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                [...notifs].reverse().map((notif) => (
                  <div
                    key={notif.notification_id}
                    className={`notification-item unread`} // Add your read/unread logic
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="notif-icon">
                      <IoIosNotifications />
                    </div>
                    <div className="notif-content">
                      <h5 className="notif-title">{notif.subject}</h5>
                      <p className="notif-body">{notif.body}</p>
                      {/* <span className="notif-meta">
                        By {notif.username} • {new Date(notif.created_at).toLocaleDateString()}
                      </span> */}
                      <p className='notif-meta'>{new Date(notif.notify_date).toLocaleDateString()} {new Date(notif.notify_date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="Profile-Icon">
        <CgProfile size={30} style={{ color: 'white', marginLeft: "40px" }}/>
        <p>{user.fullName}</p>
      </div>
    </nav>
  )
}

export default NavBar