import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const protectRoutes = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1];

                // Verify Token
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

                // Get user from the token
                req.user = await User.findById(decodedToken.id)
                    .select('-password')
                    .exec();

                next();
            } catch (error) {
                console.log(error);
                res.status(401).json({
                    error: 'You are not authorized to do that.',
                });
            }
        }

        if (!token) {
            res.status(401).json({
                error: 'You are not logged in!',
            });
        }
    } catch (error) {
        res.status(401).json({
            error: error,
        });
    }
};

export { protectRoutes };
