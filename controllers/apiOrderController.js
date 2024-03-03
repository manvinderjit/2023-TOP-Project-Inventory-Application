import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Order from '../models/ordersModel.js';
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import { jwtDecode } from 'jwt-decode';
import { validateIsMongoObjectId } from '../utilities/validation.js';

const apiGetAllOrdersForAUser = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = jwtDecode(token);
            // Get all orders for a user
            const allOrders = await Order.find({ customerId: id })
                .populate({ path: 'items.itemDetails', select: 'name description imageFilename' })
                .sort({ name: 1 })
                .exec();

            if (!allOrders || allOrders.length === 0) {
                res.status(200).send({
                    message: 'No Orders to Show!',
                });
            } else {
                res.status(200).send({
                    ordersList: allOrders,
                });
            }
        } else {            
            res.status(403).send({error : 'Login expired!'});
        }

        
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

const apiGetOrderById = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
};

const apiCreateOrder = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = jwtDecode(token);

            const order = new Order({
                customerId: id,
                items: req.body.items.map(item => {
                    return {
                        ...item,
                        itemId: item._id,
                        itemPrice: item.price,
                    }
                }),
                totalAmount: req.body.totalAmount,
            });

            // TODO: Validate order

            // TODO: Check if items are in stock


            // Create Order
            const createdOrder = await order.save();

            // TODO: Update available item stock in database

            if(createdOrder){
                res.status(200).send({
                    message: 'Order create successfully!',
                    orderDetails: createdOrder,
                });
            }            
        } else {
            res.sendStatus(403);
        }
        
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }

};

const apiPostCancelOrder = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            const token = req.headers.authorization.split(' ')[1];
            const { id } = jwtDecode(token);
            const { orderId } = req.body;

            // Validate orderId
            if (!orderId || orderId === null || !validateIsMongoObjectId(orderId)){
                res.status(400).send({
                    error: 'Invalid orderId!',
                });

            } else {
                const updatedOrder = { status: 'Cancelled' };

                // Cancel Order
                const cancelledOrder = await Order.findByIdAndUpdate(
                    orderId,
                    updatedOrder,
                );

                // TODO: Update available item stock in database
                
                if (cancelledOrder) {
                    res.status(200).send({
                        message: 'Order cancelled successfully!',
                        orderDetails: cancelledOrder,
                    });
                }
            }
            
        } else {
            res.sendStatus(403);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

export { apiGetAllOrdersForAUser, apiCreateOrder, apiPostCancelOrder };
