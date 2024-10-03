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

export { fetchCategories, fetchCategoryDetails };
