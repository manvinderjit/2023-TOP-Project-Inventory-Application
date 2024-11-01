import { Request, Response } from 'express';
import { fetchOrderById, fetchOrders, updateOrderStatusById } from '../services/orders.app.services.js';
import { validateIsMongoObjectId, validateIsNumber } from '../../utilities/validation.js';

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
    try {
        // Validate order id
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            throw new Error('Order not found!');
        } else {
            const { id } = req.params;
            
            // Fetch order data
            const orderDetails = await fetchOrderById(id);
            // If order data found
            if(orderDetails && String(orderDetails._id) === id) {
                res.render('orderView', {
                    title: 'Customer Order Details',
                    username: res.locals.user,
                    orderDetails: orderDetails,
                    orderStatusList: orderStatusList,
                });
            } 
            // Throw error if no order data or id mismatch
            else throw new Error('Order not found!');
        }
    } catch (error) {
        console.error(error);
        res.render('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: error,
            orderStatusList: orderStatusList,
        });
    }
};

export const postFulfillOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate order id
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            throw new Error('Order not found!');
        } 
        else if (
            !req.body.newOrderStatus ||
            req.body.newOrderStatus.trim() === '' ||
            !validateIsNumber(req.body.newOrderStatus.trim()) ||
            orderStatusList.findIndex(
                    (item) =>
                        item.id === Number(req.body.newOrderStatus.trim()),
                ) === -1
        ) {
            let orderDetails = null;
            const { id } = req.params;
            // Fetch order data
            const fetchedOrderData = await fetchOrderById(id);
            // If order data found
            if(fetchedOrderData && String(fetchedOrderData._id) === id) orderDetails = fetchedOrderData;

            res.render('orderView', {
                title: 'Customer Order Details',
                username: res.locals.user,
                error: new Error('No order status provided or invalid order status!'),
                orderDetails,
                orderStatusList: orderStatusList,
            });

        } else {
            const { id } = req.params;
            const updatedOrder = await updateOrderStatusById(
                id,
                orderStatusList[req.body.newOrderStatus - 1].name,
            );
            if(updatedOrder && String(updatedOrder._id) === id){
                res.redirect(`/orders/${id}`);
            } else throw new Error ('Order status update failed!');
        }
    } catch (error) {
        console.error(error);        
        res.render('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: error,            
            orderStatusList: orderStatusList,
        });
    };
};
