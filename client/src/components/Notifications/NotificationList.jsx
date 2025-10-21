
import { useStoreState } from 'easy-peasy'
import Notification from './Notification'


const NotificationList = () => {
    const notifications = useStoreState(state => state.notifications)
    const id = Number(sessionStorage.getItem("id"))
    console.log(notifications)

    console.log(id)
    return (
        <ul>
            {
                notifications.length !== 0 ?
                notifications.filter(n => n.employee_id === id).map(n => 
                    <Notification n={n} key={n.notification_id}/>
                ) : (<li className='noNotifs'>There are no notifications</li>)
            }
        </ul>
    )
}

export default NotificationList