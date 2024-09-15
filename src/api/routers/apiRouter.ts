import express, { Router } from 'express';
import * as apiProductsControllers from '../controllers/products.controllers.js';

const apiRouter: Router = express.Router();

apiRouter.get('/products/:page?', apiProductsControllers.getProducts);

export default apiRouter;
