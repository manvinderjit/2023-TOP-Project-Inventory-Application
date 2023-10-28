import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import { validateName, validateDescription } from '../utilities/validation.js';
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

        if(!req.params.id){
            res.render('categoryView', {
                username: res.locals.user,
                title: 'Error! Not found.',
                error: 'Category not provided or invalid!',
            });
        }
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
        } else if(validateName(categoryName) && validateDescription(categoryDescription)){
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

// Display details for the category to be edited
const getEditCategory = async (req, res, next) => {
   
    try {
        let responseRenderObject = {
            username: res.locals.user,
            title: 'Edit Category',
            id: '',
            error: ``,
            categoryName: '',
            categoryDescription: '',
        };

        // If no category ID was supplied
        if(!req.params.id){
            responseRenderObject = {
                username: res.locals.user,
                title: 'Edit Category',
                error: `Category not provided!`,
                id: '',
                categoryName: '',
                categoryDescription: '',
            };
        }

        // Get details for the category to be edited
        const categoryDetails = await Category.findById(req.params.id).exec();
        
        // If search for category details returned empty
        if(categoryDetails === null){            
            responseRenderObject = {
                username: res.locals.user,
                title: 'Edit Category',
                error: `Category not found!`,
                id: req.params.id,
                categoryName: '',
                categoryDescription: '',
            };
        } else {
            responseRenderObject = {
                username: res.locals.user,
                title: `Edit Category ${categoryDetails.name}`,
                error: null,
                categoryId: categoryDetails._Id,
                categoryName: categoryDetails.name,
                categoryDescription: categoryDetails.description,
            };
        }

        res.render('categoryEdit', responseRenderObject);
        
    } catch (error) {
        console.error(error);
        res.render('categoryEdit', {
            username: res.locals.user,
            title: 'Edit Category',
            error: error,
            id: req.params.id,
            categoryName: '',
            categoryDescription: '',
        });
    }
}

// Edit and update the category
const postEditCategory = async (req, res, next) => {
   
    try {
        
        // If no category ID was supplied
        if (!req.params.id) {
            res.render('categoryEdit', {
                username: res.locals.user,
                title: 'Edit Category',
                error: `Category not provided!`,
                id: '',
                categoryName: '',
                categoryDescription: '',
            })
        }

        const categoryName = trimMultipleWhiteSpaces(req.body.categoryName);
        const categoryDescription = trimMultipleWhiteSpaces(req.body.categoryDescription);

        // Validate categoryName & categoryDescription
        if (!categoryName || !categoryDescription) {
            res.render('categoryEdit', {
                username: res.locals.user,
                title: 'Edit Category',
                error: 'Please provide all fields',                
                categoryName: categoryName,
                categoryDescription: categoryDescription,
            })
        } else if (
            validateName(categoryName) &&
            validateDescription(categoryDescription)
        ) {
            const updatedCategoryDetails = {                
                name: categoryName,
                description: categoryDescription,
            };
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updatedCategoryDetails);
            res.redirect(updatedCategory.url);
        }
        
    } catch (error) {
        console.error(error);
        res.render('categoryEdit', {
            username: res.locals.user,
            title: 'Edit Category',
            error: error,
            id: req.params.id,
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    }
}

// Display details for one category to be deleted
const getDeleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).exec();
        if (category === null) {
            res.render('categoryDelete', {
                username: res.locals.user,
                categoryId: req.params.id,
                title: 'Delete Category',
                name: '',
                description: '',
                url: '',
                error: 'Category Not Found'
            });
        } else {
            res.render('categoryDelete', {
                username: res.locals.user,
                categoryId: category._id,
                title: 'Delete Category',
                name: category.name,
                description: category.description,
                url: category.url,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('categoryDelete', {
            username: res.locals.user,
            categoryId: category._id,
            title: 'Delete Category',
            error: error,
            name: req.body.categoryDescription,
            description: req.body.categoryDescription,
            url: req.body.url,
        });
    }
};

// Delete a Category
const postDeleteCategory = async (req, res, next) => {
    try {
        // If no category ID was supplied
        if (!req.body.categoryId) {
            res.render('categoryDelete', {
                username: res.locals.user,
                title: 'Delete Category',
                error: `Category not provided!`,
                id: '',
                categoryName: '',
                categoryDescription: '',
            });
        }

        const allProductsInCategory = await Product.find({ category: req.body.categoryId }, 'name, description').exec();
        if(allProductsInCategory.length === 0){
            await Category.findByIdAndRemove(req.body.categoryId);
            res.redirect('/categories');

        } else{
            res.render('categoryDelete', {
                username: res.locals.user,
                title: 'Delete Category',
                error: `Category has ${allProductsInCategory.length} products under it. Please delete them before deleting the category!`,
                id: req.body.categoryId,
                categoryName: '',
                categoryDescription: '',
            });
        }
        
    } catch (error) {
        console.error(error);
        res.render('categoryDelete', {
            username: res.locals.user,
            title: 'Delete Category',
            error: error,
            id: req.body.categoryId,
            categoryName: '',
            categoryDescription: '',
        });
    }
};

export {
    getAllCategoriesList,
    getCreateCategory,
    postCreateCategory,
    getCategoryDetail,
    getEditCategory,
    postEditCategory,
    getDeleteCategory,
    postDeleteCategory,
};
