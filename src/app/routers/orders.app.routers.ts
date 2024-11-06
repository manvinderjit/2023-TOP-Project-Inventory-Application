import express, { Router } from 'express';
import * as orderControllers from '../controllers/orders.app.controller.js';

const ordersAppRouter: Router = express.Router();

// GET route to get all orders
ordersAppRouter.get('/', orderControllers.getAllOrders);

// POST route to get all orders by order status
ordersAppRouter.post('/', orderControllers.getAllOrders);

// GET route to fulfill an order by id
ordersAppRouter.get('/:id', orderControllers.getOrderById);

// POST route to fulfill an order by id
ordersAppRouter.post('/:id', orderControllers.postFulfillOrder);

export default ordersAppRouter;
