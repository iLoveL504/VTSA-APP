import { useStoreState } from 'easy-peasy'
import Notification from './Notification'


const NotificationList = () => {
    const notifications = useStoreState(state => state.notifications )
    //console.log(notifications)
    return (
        <ul>
            {
                notifications.length !== 0 ?
                notifications.map(n => 
                    <Notification n={n} key={n.notification_id}/>
                ) : (<li className='noNotifs'>There are no notifications</li>)
            }
        </ul>
    )
}

export default NotificationList