import { Document, Types } from "mongoose";
import Category from "../../models/categoryModel.js";

interface CategoryDetails extends Document {
    _id: Types.ObjectId;
    name: string,
    description: string,    
}

const fetchCategories = async (): Promise<CategoryDetails[]> => {
    const dataCategories = await Category.find().select('-__v').sort({ name: 1 }).exec();
    return dataCategories;
};

export { fetchCategories };
