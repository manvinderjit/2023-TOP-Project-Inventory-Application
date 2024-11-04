import Order from "../../models/ordersModel.js";
import { OrderDetails } from "../../types/types.js";

export const fetchTotalPageCountForOrders = async (userId: string, perPageLimit: number = 7) => {
    
    const totalOrdersCount = await Order.countDocuments({ customerId: userId });    
    return Math.ceil(
        totalOrdersCount / perPageLimit,
    );
};

export const fetchUserOrders = async (userId: string, page: number | null | undefined = 0, perPageLimit: number = 7): Promise<OrderDetails[] | null> => {
    
    const userOrders: OrderDetails[] | null = await Order.find({ customerId: userId })
        .populate({
            path: 'items.itemDetails',
            select: 'name description imageFilename',
        })
        .limit(Math.round(Number(perPageLimit)))
        .skip(Math.round(Number(page)) * Math.round(Number(perPageLimit)))
        .sort({ createdAt: -1 })
        .exec();
    
    return userOrders;
};

export const cancelUserOrder = async (orderId: string, userId: string): Promise<OrderDetails | null> => {
    const updatedOrderData = { status: 'Cancelled' };
    
    // Can't update a shipped order, must be returned
    const updatedOrder: OrderDetails | null = await Order.findOneAndUpdate(
        { _id: orderId, customerId: userId, $or: [{ status: 'Ordered'}, { status: 'Processed' }]},
        updatedOrderData,
        { new: true },
    );
    return updatedOrder;
};
