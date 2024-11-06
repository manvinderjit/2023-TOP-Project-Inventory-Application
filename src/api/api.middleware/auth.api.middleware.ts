import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

// Extend the Express Request object
declare module 'express-serve-static-core' {
    interface Request {
        userId?: string; // Optional userId field
        username?: string; // Optional username field
    }
};

interface DecodedToken extends JwtPayload {
    username: string;
    userId: string;
};

const decodeJwtToken = (token: string) => {
    try {
        const secret: string = process.env['JWT_SECRET'] as string;
        const decodedToken = jwt.verify(token, secret) as DecodedToken;
        return decodedToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const verifyApiToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verify if bearer token is provided
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            const token = req.headers.authorization.split(' ')[1];
            
            // If no token
            if(!token) {
                return res.status(401).json({
                    error: 'You are not authorized to do that!',
                }) 
            }
            else {
                // Decode the token
                const decodedToken = decodeJwtToken(token);
                if(decodedToken) {
                    // Set parameters in request
                    req.userId = decodedToken.id;
                    req.username = decodedToken.username;
                    
                } else {
                    return res.status(401).json({
                        error: 'You are not authorized to do that!',
                    }); 
                }
                next();
            }
        } else {
            return res.status(401).json({
                error: 'You are not authorized to do that!',
            }); 
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
