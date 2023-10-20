import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import User from '../models/users.js';

export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Please provide all fields. ' });
        } else {
            // Check if user exists
            const userExists = await User.findOne({ email }).exec();

            if (userExists) {
                res.status(400).send({
                    error: 'User with the email already exists.',
                });
            } else {
                // Hash password
                const hashedPassword = await bcrypt.hashSync(password, 10);

                // Create user
                const user = await User.create({
                    email,
                    password: hashedPassword,
                });

                if (user) {
                    res.status(201).json({
                        message: `New user create with ${user.email}`,
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

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user with the provided email exists
        const user = await User.findOne({ email }).exec();

        if (user && (await bcrypt.compareSync(password, user.password))) {
            res.status(201).json({
                _id: user._id,
                username: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).send({
                error: 'Invalid email or password.',
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

export const getUser = async (req, res, next) => {
    try {
        const { _id, email } = await User.findById(req.user.id);
        res.status(200).json({
            id: _id,
            email,
        });
    } catch (error) {
        res.status(400).json({
            error: error,
        });
    }
};
