import express, { Router } from 'express';
import apiProductsRouter from './products.api.router.js';
import apiPromosRouter from './promos.api.router.js';
import apiLoginRouter from './login.api.router.js';
import apiRegsiterRouter from './register.api.router.js';
import apiOrdersRouter from './orders.api.router.js';
import { verifyApiToken } from '../api.middleware/auth.api.middleware.js';

const apiRouter: Router = express.Router();

apiRouter.use('/products', apiProductsRouter);

apiRouter.use('/promos', apiPromosRouter);

apiRouter.use('/login', apiLoginRouter);

apiRouter.use('/register', apiRegsiterRouter);

apiRouter.use('/orders', verifyApiToken, apiOrdersRouter);

export default apiRouter;
