import Category from "../models/categories.js";

// Display all categories
const categoryList = async(req, res, next) => {
    try {
        const allCategories = await Category.find().sort({ name: 1 });
        res.status(200).json({
            title: 'Categories',
            all_categories: allCategories,
        });
    } catch (error) {
        console.error(error);
    }
}

export { categoryList };
