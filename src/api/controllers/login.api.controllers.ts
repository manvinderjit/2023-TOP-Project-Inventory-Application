import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { Types } from "mongoose";
import { validateEmail } from "../../utilities/validation.js";
import { fetchUserByEmail } from "../services/auth.api.services.js";
import { checkEmailExistsAndVerified, sendEmailv2 } from "../../common/services/ses.aws.services.js";

const secret: string = process.env['JWT_SECRET'] as string;

const generateToken = (id: Types.ObjectId, username: string) => {
    return jwt.sign({ id, username }, secret, {
        expiresIn: '1hr',
    });
};

export const postLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure email and password from request body
        const { userEmail, userPassword } = req.body;

        // If either email or password is not provided
        if (!userEmail || !userPassword) {
            res.status(400).json({ error: 'Please provide all fields.' });
        }
        // Check email validity
        else if (!validateEmail(userEmail)) {
            res.status(400).json({
                error: 'Invalid email or password.',
            });
        }
        else {
            // Check if user with the provided email exists
            const user = await fetchUserByEmail(userEmail);
            // Check if email is verified
            const verificationStatus = await checkEmailExistsAndVerified(userEmail);

            if (user && (await bcrypt.compare(userPassword, user.password)) && verificationStatus === true) {
                await sendEmailv2(userEmail, 'Login', undefined);
                res.status(201).send({
                    token: generateToken(user._id, user.email),
                });
            } else if(user && (await bcrypt.compare(userPassword, user.password)) && verificationStatus !== true) {
                res.status(401).json({
                    error: 'Please verify your email, a verification link was sent to your email after registration!',
                });
            } else {
                res.status(401).json({
                    error: 'Invalid email or password!',
                });
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
