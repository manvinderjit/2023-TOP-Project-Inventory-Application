import bcrypt from 'bcrypt';
import 'dotenv/config';
import User from '../models/apiUserModel.js';
import { validateEmail, validatePassword } from '../utilities/validation.js';

export const registerUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        if (!userEmail || !userPassword) {
            res.status(400).json({ error: 'Please provide all fields. ' });
        } else if (!validateEmail(userEmail) || !validatePassword(userPassword)) {
            res.status(400).json({ error: 'Username or Password is invalid.' });
        } else {
            // Check if user exists
            const userExists = await User.findOne({ email: userEmail }).exec();

            if (userExists) {
                res.status(400).send({
                    error: 'User with the email already exists.',
                });
            } else {
                // Hash password
                const hashedPassword = await bcrypt.hash(userPassword, 10);

                // Create user
                const user = await User.create({
                    email: userEmail,
                    password: hashedPassword,
                });

                if (user) {
                    res.status(201).json({
                        message: `New user created with ${user.email}`,
                        _id: user.id,
                        username: user.email,
                    });
                } else {
                    res.status(400).send({
                        error: 'User creation failed.',
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};
