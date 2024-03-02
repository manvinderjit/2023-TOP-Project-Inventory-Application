import jwt from 'jsonwebtoken';
import User from '../models/apiUserModel.js';

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
                console.log('token: ' + token);
                console.log(req.cookies);
                // Verify Token
                jwt.verify(
                    token,
                    process.env.JWT_SECRET,
                    async (error, decodedToken) => {
                        if (error)
                            return res
                                .status(403)
                                .send({ error: 'Login expired!' });
                        req.user = await User.findById(decodedToken.id)
                            .select('-password')
                            .exec();
                        next();
                    },
                );
            } catch (error) {
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

const checkSessionStatus = (req, res, next) => {
    if (!req.session.userId || req.session.authorized !== true) {
        res.redirect('/login');
    } else {
        next();
    }
};

export { protectRoutes, checkSessionStatus };
