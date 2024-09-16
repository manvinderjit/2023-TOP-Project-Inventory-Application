import express, { Router } from 'express';
import apiProductsRouter from './apiProductsRouter.js';

const apiRouter: Router = express.Router();

apiRouter.use('/products', apiProductsRouter);

export default apiRouter;
