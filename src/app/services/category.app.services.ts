import { ObjectId } from "mongoose";
import Category from "../../models/categoryModel.js";
import { CategoryDetailsDocument } from "../../types/types.js";

const fetchCategories = async (): Promise<CategoryDetailsDocument[]> => {
    const dataCategories = await Category.find()
        .select('-__v')
        .sort({ name: 1 })
        .exec();
    return dataCategories;
};

const fetchCategoryDetails = async (
    categoryId: string,
): Promise<CategoryDetailsDocument | null> => {
    const dataCategoryDetails: CategoryDetailsDocument | null =
        await Category.findById(categoryId)
            .select({ name: 1, description: 1 })
            .exec();
    return dataCategoryDetails;
};

const createCategory = async (
    categoryName: string,
    categoryDescription: string,
): Promise<CategoryDetailsDocument | null> => {
    const createdCategory: CategoryDetailsDocument | null =
        await Category.create({
            name: categoryName,
            description: categoryDescription,
        });
    return createdCategory;
};

const updateCategoryDetails = async (
    categoryId: string,
    categoryDetails: { name: string, description: string },
): Promise<CategoryDetailsDocument | null> => {
    const dataUpdateCategory: CategoryDetailsDocument | null =
        await Category.findByIdAndUpdate(categoryId, categoryDetails);
    return dataUpdateCategory;
};

export { fetchCategories, fetchCategoryDetails, createCategory, updateCategoryDetails };
