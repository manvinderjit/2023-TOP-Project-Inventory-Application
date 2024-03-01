import express from 'express';
const ordersRouter = express.Router();
import { getAllOrders, getOrderById, postFulfillOrder } from '../controllers/orderController.js';

// GET route to get all orders
ordersRouter.get('/', getAllOrders);

// POST route to get all orders by order status
ordersRouter.post('/', getAllOrders);

// GET route to fulfill an order by id
ordersRouter.get('/:id', getOrderById);

// POST route to fulfill an order by id
ordersRouter.post('/:id', postFulfillOrder);

export default ordersRouter;
