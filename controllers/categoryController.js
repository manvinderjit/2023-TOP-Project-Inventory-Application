import Category from "../models/categories.js";

// Display all categories
const categoryList = async(req, res, next) => {
    try {
        const allCategories = await Category.find().sort({ name: 1 }).exec();
        res.render('index', {
            title: 'Inventory Application',
            all_categories: allCategories,
        });
    } catch (error) {
        console.error(error);
    }
}

// Add a New Category
const createCategoryPost = async(req, res, next) => {
    try {
        const category = new Category({
          name: req.body.nameCategory,
          description: req.body.descriptionCategory,
        });
        await category.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}

export { categoryList, createCategoryPost };
