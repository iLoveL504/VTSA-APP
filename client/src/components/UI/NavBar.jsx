import { useEffect, useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { IoIosNotifications } from "react-icons/io"
import { IoMdMail } from "react-icons/io"
import { IoIosClose } from "react-icons/io"
import useToggle from '../../hooks/useToggle'
import { useStoreState } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'
import { useSharedSocket } from '../../Context/SocketContext'
import '../../css/Navbar.css'

const NavBar = ({ invertMenuToggle }) => {
  const { utilitiesSocket } = useSharedSocket()
  const user = useStoreState(state => state.user)
  const notifications = useStoreState(state => state.notifications)
  const inbox= useStoreState(state => state.inbox) // <-- assuming you store inbox here
  const [notifToggle, invertNotifToggle] = useToggle()
  const [msgToggle, invertMsgToggle] = useToggle()
  const [notifs, setNotifs] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userMessages, setUserMessages] = useState([])
  const [unreadMsgCount, setUnreadMsgCount] = useState(0)
  const navigate = useNavigate()
  console.log(inbox)
  useEffect(() => {
    if (notifications) {
      const userNotifications = notifications.filter(n => 
        n.employee_id === Number(sessionStorage.getItem('id'))
      )
      setNotifs(userNotifications)
      setUnreadCount(userNotifications.filter(n => !n.mark_read).length)
    }
  }, [notifications])
  console.log(notifications)
  useEffect(() => {
    if (inbox) {
      setUserMessages(inbox)
      setUnreadMsgCount(inbox.filter(m => !m.is_read).length)
    }
  }, [inbox])

  const handleNotificationClick = (notif) => {
    console.log('Clicked:', notif)
    const id = notif.id
    utilitiesSocket.emit("read_notification", {id})
    navigate(`/notification/${notif.notification_id}`)
  }

  const handleMessageClick = (msg) => {
    console.log('Open message:', msg)
  }

  const markAllAsRead = () => {
    utilitiesSocket.emit('read_all_notifications', {id: user.employee_id})
  }

  const markAllMessagesAsRead = () => {
    console.log('mark')
  }

  const clearAllNotifications = () => {
    setNotifs([])
    setUnreadCount(0)
  }

  const clearAllMessages = () => {
    setUserMessages([])
    setUnreadMsgCount(0)
  }

  return (
    <nav>
      {/* Menu Icon */}
      <div onClick={() => invertMenuToggle()} className="Menu-icon">
        <IoMdMenu size={40} style={{ color: 'white' }} />
      </div>
      <div className='nav-actions'>
        <div className="Notification-Icon">
          <div
            onClick={() => invertMsgToggle()}
            className="notification-trigger"
            style={{ position: 'relative', cursor: 'pointer' }}
          >

            <IoMdMail className="BellIcon" size={30} style={{ color: 'white' }} />
            {unreadMsgCount > 0 && (
              <div className={`Notifications ${unreadMsgCount > 0 ? 'pulse' : ''}`}>
                {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
              </div>
            )}
          </div>

          {!msgToggle && (
            <div className="notification-dropdown show">
              <div className="notification-header">
                <h3>Inbox ({unreadMsgCount})</h3>
                <div className="notification-actions">
                  {unreadMsgCount > 0 && (
                    <>
                      <button className="notification-action-btn" onClick={markAllMessagesAsRead}>
                        Mark all read
                      </button>
                      <button className="notification-action-btn" onClick={clearAllMessages}>
                        Clear all
                      </button>
                    </>
                  )}
                  <button
                    className="notification-action-btn"
                    onClick={() => navigate('/inbox')}
                  >
                    Go to Messages
                  </button>
                  <button className="notification-action-btn" onClick={invertMsgToggle}>
                    <IoIosClose size={16} />
                  </button>
                </div>
              </div>

              <div className="notification-list">
                {console.log(userMessages)}
                {userMessages.length === 0 ? (
                  <p className="no-notifications">No new inbox</p>
                ) : (
                  [...userMessages].reverse().map((msg) => (
                    <div
                      key={msg.id}
                      className={`notification-item ${msg.read ? '' : 'unread'}`}
                      onClick={() => handleMessageClick(msg)}
                    >
                      <div className="notif-icon">
                        <IoMdMail />
                      </div>
                      <div className="notif-content">
                        <h5 className="notif-title">{msg.sender_name}</h5>
                        <p className="notif-body">{msg.subject || msg.body}</p>
                        <p className="notif-meta">
                          {new Date(msg.created_at).toLocaleDateString()}{' '}
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS ICON */}
        <div className="Notification-Icon">
          <div
            onClick={() => invertNotifToggle()}
            className="notification-trigger"
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <IoIosNotifications className="BellIcon" size={30} style={{ color: 'white' }} />
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
              {console.log(notifs)}
              <div className="notification-list">
                {notifs.length === 0 ? (
                  <p className="no-notifications">No new notifications</p>
                ) : (
                  [...notifs].reverse().slice(0,10).map((notif) => (
                    <div
                      key={notif.notification_id}
                      className="notification-item unread"
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="notif-icon">
                        <IoIosNotifications />
                      </div>
                      <div className="notif-content">
                        <h5 className="notif-title">{String(notif.subject || '')}</h5>
                        <p className="notif-body">{String(notif.body || '')}</p>
                        <p className="notif-meta">
                          {new Date(notif.notify_date).toLocaleDateString()}{" "}
                          {new Date(notif.notify_date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="Profile-Icon">
          <CgProfile size={30} style={{ color: 'white', marginLeft: "40px" }} />
          <p>{user.fullName}</p>
        </div>        
      </div>
      {/* MESSAGES ICON */}

    </nav>
  )
}

export default NavBar
