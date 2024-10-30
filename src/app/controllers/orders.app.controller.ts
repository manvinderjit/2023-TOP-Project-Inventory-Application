import { Request, Response } from 'express';
import { fetchOrders } from '../services/orders.app.services.js';

const orderStatusList = [
    { id: 1, name: 'Ordered' },
    { id: 2, name: 'Processed' },
    { id: 3, name: 'Shipped' },
    { id: 4, name: 'Delivered' },
    { id: 5, name: 'Cancelled' },
    { id: 6, name: 'Returned' },
    { id: 7, name: 'Refunded' },
];

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {        

        let orderCategory = null;
        // Validate order category
        if (
            req.body.orderCategory && req.body.orderCategory.toLowerCase() !== 'all' &&
            (
                typeof Number(req.body.orderCategory) !== 'number' ||
                isNaN(Number(req.body.orderCategory)) ||
                Number(req.body.orderCategory) <= 0 ||
                Number(req.body.orderCategory) > orderStatusList.length
            )
        )
            throw new Error('Invalid Order Category!');
        else if (
            req.body.orderCategory &&
            req.body.orderCategory.toLowerCase() !== 'all' &&
            typeof Number(req.body.orderCategory) === 'number' &&
            Number(req.body.orderCategory) > 0 &&
            Number(req.body.orderCategory) <= orderStatusList.length
        ) {
            orderCategory = orderStatusList.filter(
                (status) => status.id === Number(req.body.orderCategory),
            )[0].name;
        }
        
        // Fetch all orders
        const orders = await fetchOrders(orderCategory);

        // If orders found
        if(orders && orders.length > 0) {
            res.render('orders', {
                title: 'Manage Orders',
                username: res.locals.user,
                orderCategoryList: orderStatusList,
                selectedOrderCategory: req.body.orderCategory,
                ordersList: orders,
            });
        } 
        // Throw error if no orders
        else throw new Error('No orders found!');

    } catch (error) {
        console.error(error);
        res.render('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            error: error,
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
        });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    res.send('Not Implemented Yet');
};

export const postFullfillOrder = async (req: Request, res: Response): Promise<void> => {
    res.send('Not Implemented Yet');
};
