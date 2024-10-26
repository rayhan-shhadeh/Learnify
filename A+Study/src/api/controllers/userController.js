import jwt from 'jsonwebtoken';
import { userService } from '../services/userService.js';
const bcrypt = require('bcrypt');

export const userController = {
    async register(req, res) {
        try {
            const user = await userService.registerUser(req.body);
            res.status(200).json({ message: 'User registered successfully', userId: user.userId });
        } catch (error) {
            res.status(500).json({ error: 'Registration failed' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.findUserByEmail(email);

            if (!user || !(await userService.validatePassword(password, user.password))) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user.userId }, 'fghytu_oihf', { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }
};
