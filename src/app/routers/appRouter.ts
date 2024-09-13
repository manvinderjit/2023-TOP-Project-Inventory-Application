import express, { Router } from 'express';
const appRouter: Router = express.Router();
import * as authControllers from '../controllers/auth.controllers.js';

appRouter.get('/login', authControllers.loginView);

appRouter.post('/login', authControllers.loginUser);

appRouter.get('/register', authControllers.registerView);

export default appRouter;
