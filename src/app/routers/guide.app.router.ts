import express, { Router } from 'express';
import { getGuidePage } from '../controllers/guide.app.controllers.js';

const guideAppRouter: Router = express.Router();

guideAppRouter.use('/', getGuidePage);

export default guideAppRouter;
