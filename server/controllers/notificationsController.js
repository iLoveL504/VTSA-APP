import { NotificationModel as notifications } from "../model/NotificationModel.js";

export const getAllNotifications = async (req, res) => {
    const results = await notifications.getAllNotifications()
    res.json(results)
}

export const getNotificationsById = async (req, res) => {
    const results = await notifications.getNotificationsById(req.params.id)
    res.json(results)
}
export const newNotification = async (req, res, next) => {
    try{
        console.log(req.body)
        await notifications.newNotification(req.body)
        console.log('notification made')
    } catch (e) {
        console.log(e)
    }
    next()
}
export const distributeNotification = async (req, res) => {
    try{
        await notifications.distributeNotification()
        console.log('notification distributed')
        res.status(200).json({"message": "notification distributed"})
    } catch (e) {
        console.log(e)
    }
}