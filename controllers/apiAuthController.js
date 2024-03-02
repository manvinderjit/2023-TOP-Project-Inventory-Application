import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import User from '../models/apiUserModel.js';
import { validateEmail, validatePassword } from '../utilities/validation.js';

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '1hr',
    });
};

const generateRefreshToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

export const loginApiUser = async (req, res, next) => {
    try {
        const { userEmail, userPassword } = req.body;

        if (!userEmail || !userPassword) {
            res.status(400).json({ error: 'Please provide all fields.' });
        } else {
            // Check if user with the provided email exists
            const user = await User.findOne({ email: userEmail }).exec();

            if (user && (await bcrypt.compare(userPassword, user.password))) {
                res.status(201).send({
                    token: generateToken(user._id, user.email),
                });
            } else {
                res.status(400).send({
                    error: 'Invalid email or password.',
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
};
