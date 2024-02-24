import express from 'express';
const ordersRouter = express.Router();
import { getAllOrders, getOrderById } from '../controllers/orderController.js';

// GET route to get all orders
ordersRouter.get('/', getAllOrders);

// POST route to get all orders by order status
ordersRouter.post('/', getAllOrders);

// GET route to get an order by id
ordersRouter.get('/:id', getOrderById);

export default ordersRouter;
