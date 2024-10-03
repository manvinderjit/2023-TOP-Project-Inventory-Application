import mongoose from 'mongoose';
import { CategoryDetailsDocument } from '../types/types';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        trim: true,
    },
});

// Virtual for category's URL
const categoryURL = categorySchema.virtual('url');
categoryURL.get(function () {
    return `/categories/${this._id}`;
});

const Category = mongoose.model<CategoryDetailsDocument>('Category', categorySchema);

export default Category;
