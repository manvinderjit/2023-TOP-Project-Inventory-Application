import mongoose, { Types } from "mongoose";
import Order from "../../models/ordersModel.js";
import Product from "../../models/productModel.js";
import { OrderDetails } from "../../types/types.js";

export const fetchTotalPageCountForOrders = async (userId: string, perPageLimit: number = 7) => {
    const totalOrdersCount = await Order.countDocuments({ customerId: userId });    
    return Math.ceil(
        totalOrdersCount / perPageLimit,
    );
};

// Fetch all orders for a user with pagination
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

export const fetchUserOrderById = async (orderId: Types.ObjectId) => {
    const userOrders: OrderDetails | null = await Order.findById(orderId)
        .populate({
            path: 'items.itemDetails',
            select: 'name description',
        })
        .exec();
    
    return userOrders;
}

// Update the status of a user's order to cancelled
export const cancelUserOrder = async (orderId: string, userId: string): Promise<OrderDetails | null> => {
    const updatedOrderData = { status: 'Cancelled' };
    
    const updatedOrder: OrderDetails | null = await Order.findOneAndUpdate(
        { _id: orderId, customerId: userId, $or: [{ status: 'Ordered'}, { status: 'Processed' }]},// Can't update a shipped order, must be returned
        updatedOrderData,
        { new: true },
    );
    return updatedOrder;
};

// Get inventory stock of multiple items based on id
export const getStockOfItems = async (itemIds: string[]) => {
    const itemsWithStocks: { _id: Types.ObjectId, stock: number, name: string }[] = await Product.find({
        _id: {
            $in: itemIds
        }
    })
    .select({ stock: 1, name: 1 })
    .exec();

    return itemsWithStocks;
}

// Creates a new user order
export const createUserOrder = async (orderDetails: {
    customerId: string;
    items: {
        itemQuantity: number;
        itemId: Types.ObjectId;
        itemPrice: number;
    }[];
    totalAmount: any;
}) => {
    const operations = orderDetails.items.map(item => {
        return {
            updateOne: {
                filter: { _id: item.itemId },
                update: { $inc: { stock: -item.itemQuantity } },
            },
        };
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const createdOrder = await Order.create(orderDetails);
        
        // DOES NOT WORK : Because MongoDB Atlas free doesn't use sharding or replica sets
        // USING BULK WRITE INSTEAD!!

        // for (const item of orderDetails.items) {
        //     await Product.findByIdAndUpdate(
        //         item.itemId,
        //         {
        //             $inc: { stock: -item.itemQuantity },
        //         },
        //         { session },
        //     );
        // }

        const updatedProductStockResult = await Product.bulkWrite(operations);
        if(updatedProductStockResult.modifiedCount !== orderDetails.items.length){
            await session.abortTransaction();
            console.error('Transaction aborted as product stock update failed');
        }

        await session.commitTransaction();
        return createdOrder;
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted due to error:', error);
        return null;        
    } finally {
        session.endSession();
    }
};
