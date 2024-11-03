import express, { Router } from 'express';

import * as apiOrdersController from '../controllers/orders.api.controllers.js';

const apiOrdersRouter: Router = express.Router();

apiOrdersRouter.get('/', apiOrdersController.getUserOrders);

export default apiOrdersRouter;
