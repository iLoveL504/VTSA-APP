import React from 'react'
import { useStoreState } from 'easy-peasy'
import { useParams } from 'react-router-dom'

const NotificationPage = () => {
  const { notifId } = useParams()
  const notif = useStoreState(state => state.notifications)
  console.log(typeof notifId)
  const foundNotif = notif.find(n => n.notification_id === Number(notifId))
  console.log(foundNotif)
  return (
    <div className='Content NotificationPage'>
        <h3>{foundNotif.subject}</h3>
        <p>{foundNotif.body}</p>
        <p></p>
    </div>
  )
}

export default NotificationPage