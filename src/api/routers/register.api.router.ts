import express, { Router } from 'express';
import * as apiRegisterControllers from '../controllers/register.api.controllers.js';

const apiRegsiterRouter: Router = express.Router();

apiRegsiterRouter.post('/', apiRegisterControllers.postRegisterUser);

export default apiRegsiterRouter;
