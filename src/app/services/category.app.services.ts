import { ObjectId } from "mongoose";
import Category from "../../models/categoryModel.js";
import { CategoryDetailsDocument } from "../../types/types.js";
import Product from "../../models/productModel.js";

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

const deleteCategory = async (
    categoryId: string,
): Promise<{
    error: string | null;
    success: boolean;
}> => {
    let error = null;
    let success = false;
    // Check if the Category has any products listed under it, can't delete a category that still has products under it
    const getAllProductsInCategory = await Product.find(
        {
            category: categoryId,
        },
        'name, description',
    ).exec();
    // If no products under the category, delete it
    if (getAllProductsInCategory && getAllProductsInCategory.length === 0) {
        const deletedResult = await Category.findByIdAndDelete(categoryId);
        // If deletion succeeds
        if (deletedResult && deletedResult._id && deletedResult._id.toString() === categoryId)
            success = true;
        // If deletion fails, set error
        else error = 'Deletion failed!';
    } else {
        // If category has products under it, set error
        error = `Category has ${getAllProductsInCategory.length} products under it. Please delete them before deleting the category!`;
    }
    return { error, success };
};

export {
    fetchCategories,
    fetchCategoryDetails,
    createCategory,
    updateCategoryDetails,
    deleteCategory,
};
