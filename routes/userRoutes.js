import * as userController from '../controllers/userController.js';
import express from 'express';
import { protectRoutes } from '../middleware/authMiddleware.js';
const routerUser = express.Router();


// POST request to register user
routerUser.post('/', userController.registerUser);

// POST request to login user
routerUser.post('/login', userController.loginUser);

// GET request to fetch data for logged-in user
routerUser.get('/dashboard', protectRoutes, userController.getUser);

export default routerUser;
