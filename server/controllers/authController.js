import jwt from 'jsonwebtoken'
import { UserModel as users } from '../model/UserModel.js'
import { pool } from '../config/database.js'

export const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    try {
        const results = await users.getAllUsers();
        const foundUser = results.find(u => u.username === user);

        if (!foundUser) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        if (foundUser.password !== pwd) {
            console.log('Incorrect password');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // User authenticated
        console.log('User found');
        const roles = foundUser.job;

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles,
                    id: foundUser.employee_id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' } // short-lived access token
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refreshToken in database
        await pool.query(
            `UPDATE employees SET refresh_token = ? WHERE employee_id = ?`,
            [refreshToken, foundUser.employee_id]
        );

        // Send refreshToken as httpOnly cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
        console.log('User has logged in');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
