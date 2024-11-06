import { NextFunction, Request, Response } from 'express';
import { cancelUserOrder, createUserOrder, fetchTotalPageCountForOrders, fetchUserOrders } from '../services/orders.api.services.js';
import { OrderDetails } from '../../types/types.js';
import { validateIsMongoObjectId, validateIsNumber } from '../../utilities/validation.js';
import { OrderItem, validateUserOrder } from '../helpers/orders.api.helpers.js';

export const getUserOrders = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const perPageLimit: number = 7;
        const { userId } = req;
        const pageNumber: number =
            req.query.page &&
            !Array.isArray(req.query.page) &&
            validateIsNumber(String(req.query.page)) && 
            Number(req.query.page) > 0
                ? Number(req.query.page) - 1
                : 0;

        if(userId && userId !== undefined) {
            const userOrders: OrderDetails[] | null = await fetchUserOrders(userId, pageNumber, perPageLimit);

            if (!userOrders || userOrders.length === 0) {
                return res.status(404).json({
                    error: 'No Orders to Show!',
                });
            } else {
                const totalPages = await fetchTotalPageCountForOrders(userId, perPageLimit);
                return res.status(200).json({
                    ordersList: userOrders,
                    totalOrdersPages: totalPages,
                });
            }
        } else {
            return res.status(401).json({
                error: 'You are not authorized to do that!',
            }); 
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const postCancelAnOrder = async(req: Request, res: Response, next: NextFunction) => {
    try {        
        const { userId } = req;
        const { orderId } = req.body;
        // Validate UserId
        if(!userId || userId === null || !validateIsMongoObjectId(userId)) {
            return res.status(401).json({
                error: 'You are not authorized to do that!',
            }); 
        }
        // Validate Order Id
        else if(!orderId || orderId === null || !validateIsMongoObjectId(orderId)) {
            res.status(401).json({
                error: 'Order cancellation failed, order not found!',
            });
        } else {
            const cancelledOrderDetails = await cancelUserOrder(orderId, userId);
            if(cancelledOrderDetails && String(cancelledOrderDetails._id) === orderId) {
                res.status(201).json({
                    message: 'Order cancelled successfully!',
                    orderDetails: cancelledOrderDetails,
                });
            } else {
                res.status(400).json({
                    error: 'Order cancellation failed!',
                }); 
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const postCreateOrder = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req;
        const { items, totalAmount }: { items: OrderItem[], totalAmount: number } = req.body;        
        
        // Validate UserId
        if(!userId || userId === null || !validateIsMongoObjectId(userId)) {
            return res.status(401).json({
                error: 'Login Expired!',
            }); 
        } 
        // Validate request has required field
        else if(!items || items.length < 1 || !totalAmount || !validateIsNumber(String(totalAmount))) {
            return res.status(400).json({
                error: 'Invalid order!',
            }); 
        }
        else {
            const orderDetails = {
                customerId: userId,
                items: items.map((item: OrderItem) => {
                    return {
                        itemQuantity: item.itemQuantity,
                        itemId: item._id,
                        itemPrice: item.price,
                    };
                }),
                totalAmount: req.body.totalAmount,
            };
            
            // Validate Order Items
            const orderValidationErrors = await validateUserOrder(items, totalAmount);
            // If no validation error
            if (orderValidationErrors === null) {
                // Create order
                const createdOrder = await createUserOrder(orderDetails);
                if(createdOrder) {
                    res.status(200).json({
                        message: 'Order created successfully!',
                        orderDetails: createdOrder,
                    });
                } else {
                    res.status(400).json({
                        error: `Order creation failed!`
                    })
                }
            } 
            // If validation error occurs
            else  {
                return res.status(401).json({
                    error: orderValidationErrors,
                });
            }
            
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
