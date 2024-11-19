import { Request, Response, NextFunction } from "express";
import { validateEmail, validatePassword } from "../../utilities/validation.js";
import { fetchUserByEmail, registerUser } from "../services/auth.api.services.js";
import { verifyEmail } from "../../common/services/ses.aws.services.js";

export const postRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Destructure email and password from request body
        const { userEmail, userPassword } = req.body;

        // If either email or password is not provided
        if (!userEmail || !userPassword) {
            res.status(400).json({ error: 'Please provide all fields!' });
        }
        // Check email validity
        else if (!validateEmail(userEmail) || !validatePassword(userPassword)) {
            res.status(400).json({
                error: 'Invalid email or password!',
            });
        }
        else {
            // Check if user with the provided email exists
            const userExists = await fetchUserByEmail(userEmail);
            if(userExists) {
                res.status(400).json({ error: 'User with the email already exists!' });
            } 
            // Otherwise register user
            else {
                const registeredUser = await registerUser(userEmail, userPassword);
                
                if(registeredUser && registeredUser._id) {
                    // Send a verification email
                    await verifyEmail(
                        registeredUser.email,
                    );
                    res.status(201).json({
                        message: `New user created with ${registeredUser.email}! Verification email sent!`,
                    });
                } else {
                    res.status(400).json({
                        error: 'User creation failed!',
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
