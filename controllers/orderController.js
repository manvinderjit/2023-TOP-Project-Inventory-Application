import Order from "../models/ordersModel.js";
import { validateIsMongoObjectId } from "../utilities/validation.js";

const orderCategoryList = [
    { id:1, name: 'Ordered' },
    { id:2, name: 'Processed' },
    { id:3, name: 'Shipped' },
    { id:4, name: 'Delivered' },
    { id:5, name: 'Cancelled' },
    { id:6, name: 'Returned' },
    { id:7, name: 'Refunded' },
]

const getAllOrders = async (req, res) => {
    try {

        const allOrders =
            !req.body.orderCategory ||
            req.body.orderCategory.toLowerCase() === 'all'
                ? await Order.find()
                      .populate({
                          path: 'items.itemDetails',
                          select: 'name description',
                      })
                      .sort({ createdAt: -1 })
                      .exec()
                : await Order.find({
                      status: orderCategoryList[req.body.orderCategory - 1].name,
                  })
                        .populate({
                            path: 'items.itemDetails',
                            select: 'name description',
                        })
                        .sort({ createdAt: -1 })
                        .exec();

        // Check if orders were found and render them
        if( allOrders.length > 0) {
            res.render('orders', {
                title: 'Manage Orders',
                username: res.locals.user,
                orderCategoryList: orderCategoryList,
                selectedOrderCategory: req.body.orderCategory,
                ordersList: allOrders,
            });   
        } else {
            res.render('orders', {
                title: 'Manage Orders',
                username: res.locals.user,
                error: 'No orders found!',
                orderCategoryList: orderCategoryList,
                selectedOrderCategory: req.body.orderCategory,
                ordersList: allOrders,
            });   
        }
        
    } catch (error) {
        console.log(error);
        res.render('404', {
            title: 'Error Fetching Orders',
            username: res.locals.user,
            error: error,            
        });
    }
}

const getOrderById = async (req, res)  => {
    try {
        // Check if there is a order id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid order id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No order id provided or invalid order id!',
            });
        } else {
            // Fetch order details from the database
            const orderDetails = await Order.findById(req.params.id)
                .populate({
                    path: 'items.itemDetails',
                    select: 'name description',
                })
                .sort({ name: 1 })
                .exec();

            // If order not found, render 404
            if (!orderDetails || orderDetails === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'Order not found!',
                });
            } else {
                // Render the order details page
                res.render('orderView', {
                    title: 'Customer Order Details',
                    username: res.locals.user,
                    orderDetails: orderDetails,
                    orderStatusList: orderCategoryList
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.render('404', {
            title: 'Error Fetching Order By Id',
            username: res.locals.user,
            error: error,
        });   
    }
}

const postFulfillOrder = async (req, res)  => {
    try {
        // Check if there is a vaild order id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid order id, render 404
            res.render('404', {
                title: 'Error: Can not fulfill order!',
                username: res.locals.user,
                error: 'No order id provided or invalid order id!',
            });
            
        // Check if new order status is provided in the request and its not empty
        } else if (!req.body.newOrderStatus || req.body.newOrderStatus.trim() === '') {
            // Fetch order details from the database
            const orderDetails = await Order.findById(req.params.id)
                .populate({
                    path: 'items.itemDetails',
                    select: 'name description',
                })
                .sort({ name: 1 })
                .exec();
            
                // If order not found, render 404
            if (!orderDetails || orderDetails === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'Order not found!',
                });
                
            } else {
                // Render the order details page with error
                res.render('orderView', {
                    title: 'Error: Can not fulfill order!',
                    username: res.locals.user,
                    error: 'No order status provided or invalid order status!',
                    orderDetails: orderDetails,
                    orderStatusList: orderCategoryList,
                });
            }
        } // Update order status
        else {
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                { status: orderCategoryList[req.body.newOrderStatus - 1].name },
            );
            res.redirect(`/orders/${req.params.id}`);
        }

    } catch (error) {
        console.log('error');
        res.render('404', {
            title: 'Error: Order Fulfill Error!',
            username: res.locals.user,
            error: error,
        });
    }
}

export { getAllOrders, getOrderById, postFulfillOrder };
