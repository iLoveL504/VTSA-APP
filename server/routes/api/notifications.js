import express from 'express'
const router = express.Router()
import {
            getAllNotifications, 
            getNotificationsById, 
            newNotification,
            distributeNotification
        } from '../../controllers/notificationsController.js'

router.route('/')
    .get(getAllNotifications)
    .post(newNotification)

router.route('/:id')
    .get(getNotificationsById)


export { router }