import express, { Router } from 'express';
import * as authControllers from '../controllers/auth.controllers.js';
import * as indexControllers from '../controllers/index.controllers.js';
import { redirectToLogin, redirectToDashboard } from '../middleware/auth.mw.js';
import { logoutEmployee } from '../services/auth.services.js';

const appRouter: Router = express.Router();

appRouter.get('/', redirectToLogin, indexControllers.dashboardView);

appRouter.get('/login', redirectToDashboard, authControllers.loginView);

appRouter.post('/login', authControllers.loginEmployeeController);

appRouter.post('/logout', logoutEmployee, redirectToLogin);

appRouter.get('/register', redirectToDashboard, authControllers.registerView);

export default appRouter;
