import Order from "../models/ordersModel.js";

const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find()
                .populate({ path: 'items.itemDetails', select: 'name description' })
                .sort({ createdAt: 1 })
                .exec();
                res.send(allOrders);
    } catch (error) {
        console.log(error);
    }
}

export { getAllOrders };
