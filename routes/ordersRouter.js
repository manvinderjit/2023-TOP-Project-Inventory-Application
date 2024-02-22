import express from 'express';
const ordersRouter = express.Router();
import { getAllOrders } from '../controllers/orderController.js';

ordersRouter.get('/', getAllOrders);

export default ordersRouter;
