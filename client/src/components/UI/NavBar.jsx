import { useEffect, useState } from 'react'
import { IoMdMenu } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { IoIosNotifications } from "react-icons/io";
import useToggle from '../../hooks/useToggle';
import 'ldrs/react/Grid.css'
import { useStoreState } from 'easy-peasy'
import NotificationList from '../Notifications/NotificationList.jsx'
import { Axios } from '../../api/axios.js'

const NavBar = ({ invertMenuToggle }) => {
  const user = useStoreState(state => state.user)
  const notifications = useStoreState(state => state.notifications)
  const [notifToggle, invertNotifToggle] = useToggle();
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    setNotifs(notifications)
  }, [notifications])


  return (
    <nav>
      <div onClick={() => invertMenuToggle() } className="Menu-icon">
        <IoMdMenu size={40} style={{ color: 'white' }}/>
      </div>
      <div onClick={() => invertNotifToggle()} className="Notification-Icon">
        <IoIosNotifications className="BellIcon" size={30} style={{ color: 'white' }}/>
        
        {notifs !== 0 && <div className="Notifications" style={{ display: `${notifications.length !== 0 ? '' : 'none'}` }}>{notifications.length}</div>}
        <div className={`NotificationList ${notifToggle ? ' Hidden' : ''}`}>
          <div>
            <NotificationList />
          </div>
        </div>

      </div>
      <div className="Profile-Icon">
        <CgProfile size={30} style={{ color: 'white', marginLeft: "40px" }}/>
        <p>{user.username}</p>
      </div>
      
       
    </nav>
  )
}

export default NavBar