import express, { Router } from 'express';
import * as authControllers from '../controllers/auth.app.controllers.js';
import * as indexControllers from '../controllers/index.app.controllers.js';
import { redirectToLogin, redirectToDashboard } from '../middleware/auth.mw.js';
import { logoutEmployee } from '../services/auth.app.services.js';
import registerAppRouter from './register.app.router.js';

const appRouter: Router = express.Router();

appRouter.get('/', redirectToLogin, indexControllers.dashboardView);

appRouter.get('/login', redirectToDashboard, authControllers.loginView);

appRouter.post('/login', authControllers.loginEmployeeController);

appRouter.post('/logout', logoutEmployee, redirectToLogin);

appRouter.use('/register', registerAppRouter);

export default appRouter;