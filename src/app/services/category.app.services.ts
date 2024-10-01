import { Document, Types } from "mongoose";
import Category from "../../models/categoryModel.js";

interface CategoryDetails extends Document {
    _id: Types.ObjectId;
    name: string,
    description: string,    
}

const fetchCategories = async (): Promise<CategoryDetails[]> => {
    const fetchedCategories = await Category.find().sort({ name: 1 }).exec();    
    return fetchedCategories;
};

export { fetchCategories };