import express, { Router } from 'express';
import * as apiProductsControllers from '../controllers/products.api.controllers.js';
import { apiGetProductImage } from '../controllers/image.api.controllers.js';

const apiProductsRouter: Router = express.Router();

apiProductsRouter.get('/', apiProductsControllers.getProducts);

apiProductsRouter.get('/image/:name', apiGetProductImage);

export default apiProductsRouter;
