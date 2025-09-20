import jwt from 'jsonwebtoken'
import { UserModel as User } from '../model/UserModel'
import { pool } from '../config/database.js'


export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookie
    if(!cookies.jwt) return 
    const refreshToken = cookies.jwt
    const foundUser = await pool.query(`
            select * from employees where refresh_token = :refreshToken
        `, {refreshToken: refreshToken})
    if(!foundUser.length === 0) return res.sendStatus(403)
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                { "UserInfo": {
                        "username" : decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            )
            res.json({ accessToken })
        }
    )
}






















