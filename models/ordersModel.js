import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                itemId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                itemQuantity: {
                    type: Number,
                    min: [1, 'Item quantity must be greater than 1'],
                    required: true,
                },
                itemPrice: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            get: (p) => (p / 100).toFixed(2),
            set: (p) => p * 100,
            required: true,
        },
        // paymentDetails: {
        //     paymentMode: {
        //         type: String,
        //         enum: {
        //             values: ['Card', 'Interac', 'DirectDeposit', 'Coupons'],
        //             required: true,
        //         },
        //     },
        //     paymentStatus: {
        //         type: String,
        //         enum: {
        //             values: ['Pending', 'Paid', 'RefundInitiated', 'Refunded'],
        //             required: true,
        //         },
        //     },
        //     coupons: {
        //         type: String,
        //         default: null,
        //     }
        // },
        status: {
            type: String,
            enum: {
                values: [
                    'Ordered',
                    'Processed',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                    'Returned',
                    'Refunded',
                ],
                message: '{VALUE} is not supported',
            },
            default: 'Ordered',
        },
        createdAt: { type: Date, get: (date) => date.toLocaleDateString() },
        updatedAt: { type: Date, get: (date) => date.toLocaleDateString() },
    },
    {
        toJSON: { getters: true },
        timestamps: true,
    },
);

// Virtual for product's URL
const orderURL = orderSchema.virtual('url');
orderURL.get(function () {
    return `/orders/${this._id}`;
});

const itemDetails = orderSchema.virtual('items.itemDetails', {
    ref: 'Product',
    localField: 'items.itemId',
    foreignField: '_id',
    justOne: true,
});

const Order = mongoose.model('Orders', orderSchema);

export default Order;
