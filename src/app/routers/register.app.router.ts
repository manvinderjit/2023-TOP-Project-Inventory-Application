import express, { Router } from 'express';
import * as authControllers from '../controllers/auth.app.controllers.js';
import { redirectToDashboard } from '../middleware/auth.mw.js';

const registerAppRouter: Router = express.Router();

// GET request to render register view
registerAppRouter.get('/', redirectToDashboard, authControllers.registerView);

// POST request to register an employee account
registerAppRouter.post('/', authControllers.registerEmployee);

export default registerAppRouter;
