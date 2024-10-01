import express, { Router } from 'express';
import * as categoryControllers from '../controllers/category.app.controllers.js';
import { redirectToLogin } from '../middleware/auth.mw.js';

const categoryAppRouter: Router = express.Router();

// GET request to render register view
categoryAppRouter.get('/', redirectToLogin, categoryControllers.categoryView);

export default categoryAppRouter;
