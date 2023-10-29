import express from 'express';
import { protectRoutes } from '../middleware/authMiddleware.js';
const apiRouter = express.Router();
import apiCustomerRouter from './apiCustomerRoutes.js';

// POST request to register user
apiRouter.post('/register', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the registration page! Happy Shopping!',
    });
});

// POST request to login user
apiRouter.post('/login', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the login page! Happy Shopping!',
    });
});

// GET request to home page
apiRouter.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the home page! Happy Shopping!'});
});

// // GET request to fetch data for logged-in user
// apiRouter.use('/home', protectRoutes, apiCustomerRouter);

export default apiRouter;
