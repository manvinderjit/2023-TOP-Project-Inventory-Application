import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 100,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        imageFilename: {
            type: String,
            trim: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            get: (p) => (p / 100).toFixed(2),
            set: (p) => p * 100,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            validate: {
                validator: function (number) {
                    return number % 1 == 0;
                },
                message: `Stock must be a whole number (Integer)!`,
            },
            min: [0, 'stock must be greater than zero'],
        },
    },
    {
        toJSON: { getters: true },
    },
);

// Virtual for product's URL
const productURL = productSchema.virtual('url');
productURL.get(function () {
    return `/allproducts/${this._id}`;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
