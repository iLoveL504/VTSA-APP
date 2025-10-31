import { UserModel as users } from "../model/UserModel.js";

export default function usersNamespace(usp) {
    usp.on("connection", (socket) => {
        console.log("Users namespace connected: ", socket.id)
        //refresh user list
        socket.on("refresh_users", async () => {
            const userList = await users.getAllUsers()
            socket.emit('update_done', userList)
        })

        //create user
        

        //remove user

        //update user

        //delete user
    })
}