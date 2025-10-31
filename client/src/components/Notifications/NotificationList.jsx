
import { useStoreState } from 'easy-peasy'
import Notification from './Notification'


const NotificationList = ({notifToggle}) => {
    const notifications = useStoreState(state => state.notifications)
    const id = Number(sessionStorage.getItem("id"))
    return (
        <div className={`NotificationList ${notifToggle ? ' Hidden' : ''}`}>
            {
                notifications.length !== 0 ?
                notifications.filter(n => n.employee_id === id).map(n => 
                    <Notification n={n} key={n.notification_id}/>
                ) : (<div className='noNotifs'>There are no notifications</div>)
            }
        </div>
    )
}

export default NotificationList