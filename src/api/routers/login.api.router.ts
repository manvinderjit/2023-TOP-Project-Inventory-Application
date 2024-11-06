import express, { Router } from 'express';
import * as apiLoginControllers from '../controllers/login.api.controllers.js';

const apiLoginRouter: Router = express.Router();

apiLoginRouter.post('/', apiLoginControllers.postLoginUser);

export default apiLoginRouter;
