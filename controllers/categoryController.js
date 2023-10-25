import Category from '../models/categoryModel.js';
import { validateCategoryName,validateCategoryDescription } from '../utilities/validation.js';
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';

// Display all categories
const getAllCategoriesList = async (req, res, next) => {
    try {
        const allCategories = await Category.find().sort({ name: 1 }).exec();

        res.render('categories', {
            title: 'All Categories',
            username: res.locals.user,
            allCategoriesList: allCategories,
        });

    } catch (error) {
        console.error(error);
        res.render('categoryView', {
            username: res.locals.user,
            title: 'Error! Something went wrong!',
            error: 'Something went wrong!',
        });
    }
};

// Display details for one category
const getCategoryDetail = async (req, res, next) => {
    try {
        const categoryDetails = await Category.findById(req.params.id).exec();

        if (categoryDetails === null) {
            res.render('categoryView', {
                username: res.locals.user,
                title: 'Error! Not found.',
                error: 'Category details not found!',
            });
        } else {
            res.render('categoryView', {
                username: res.locals.user,
                _id: categoryDetails._id,
                title: categoryDetails.name,
                name: categoryDetails.name,
                description: categoryDetails.description,
                url: categoryDetails.url,
            });
        }

    } catch (error) {
        console.error(error);
        res.render('categoryView', {
            username: res.locals.user,
            title: 'Error! Something went wrong!',
            error: 'Something went wrong!',
        });
    }
};

const getCreateCategory = async (req, res, next) => {
    try {
        res.render('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            categoryName: '',
            categoryDescription: '',
        });
    } catch (error) {
        console.error(error);
        res.render('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: error,
            categoryName: '',
            categoryDescription: '',
        });
    }
};

// Add a New Category
const postCreateCategory = async (req, res, next) => {
    try {
        
        const categoryName = trimMultipleWhiteSpaces(req.body.categoryName);
        const categoryDescription = trimMultipleWhiteSpaces(req.body.categoryDescription);

        // Validate categoryName & categoryDescription
        if(!categoryName || !categoryDescription){
            res.render('categoryCreate', {
                username: res.locals.user,
                title: 'Create Category',
                error: 'Please provide all fields',
                categoryName: categoryName,
                categoryDescription: categoryDescription,
            });
        } else if(validateCategoryName(categoryName) && validateCategoryDescription(categoryDescription)){
            const category = new Category({
                name: categoryName,
                description: categoryDescription,
            });
            const createdCategory = await category.save();
            res.render('categoryCreate', {
                username: res.locals.user,
                title: 'Create Category',
                success: `Category ${createdCategory.name} created successfully`,
                categoryName: '',
                categoryDescription: '',
            });
        } else {
            res.render('categoryCreate', {
                username: res.locals.user,
                title: 'Create Category',
                error: `Category creation failed. Validation Error`,
                categoryName: categoryName,
                categoryDescription: categoryDescription,
            });
        }

    } catch (error) {
        console.error(error);
        res.render('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: `Category creation failed! Something went wrong.`,
            categoryName: categoryName,
            categoryDescription: categoryDescription,
        });
    }
};

// Display details for one category to be deleted
const deleteCategoryDetails = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).exec();
        if (category === null) {
        } else {
            res.render('categoryDelete', {
                _id: category._id,
                title: category.name,
                name: category.name,
                description: category.description,
                url: category.url,
            });
        }
    } catch (error) {
        console.error(error);
    }
};

// Delete a Category
const deleteCategory = async (req, res, next) => {
    try {
        console.log('called' + req.body);
        await Category.findByIdAndRemove(req.body.categoryId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
};

export {
    getAllCategoriesList,
    getCreateCategory,
    postCreateCategory,
    getCategoryDetail,
    deleteCategory,
    deleteCategoryDetails,
};
