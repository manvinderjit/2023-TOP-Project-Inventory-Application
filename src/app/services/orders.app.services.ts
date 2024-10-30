import Order from "../../models/ordersModel.js";
import { OrderDetails } from "../../types/types.js";

const allowedOrderStatuses = [
    'Ordered' ,
    'Processed' ,
    'Shipped' ,
    'Delivered' ,
    'Cancelled' ,
    'Returned' ,
    'Refunded' ,
];

export const fetchOrders = async (
    orderCategory: string | null,
): Promise<OrderDetails[] | null> => {
    let query = {};

    if (
        orderCategory !== null &&
        orderCategory !== 'all' &&
        allowedOrderStatuses.includes(orderCategory)
    )
        query = { status: orderCategory };
        console.log(query)

    const orders: OrderDetails[] | null = await Order.find(query)
        .populate({
            path: 'items.itemDetails',
            select: 'name description',
        })
        .sort({ createdAt: -1 })
        .exec();

    return orders;
};
