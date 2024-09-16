import express, { Router } from 'express';
import apiProductsRouter from './products.api.router.js';
import apiPromosRouter from './promos.api.router.js';

const apiRouter: Router = express.Router();

apiRouter.use('/products', apiProductsRouter);

apiRouter.use('/promos', apiPromosRouter);

export default apiRouter;
