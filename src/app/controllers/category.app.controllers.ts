import { NextFunction, Request, Response } from "express";
import {
    fetchCategories,
    fetchCategoryDetails,
    createCategory,
    updateCategoryDetails,
    deleteCategory,
} from '../services/category.app.services.js';
import { validateDescription, validateIsMongoObjectId, validateName } from "../../utilities/validation.js";
import { CategoryDetailsDocument } from "../../types/types.js";
import { trimMultipleWhiteSpaces } from "../../utilities/stringFormatting.js";
import { Types } from 'mongoose';

const getManageCategoriesView = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await fetchCategories();
        res.render('categories', {
            title: 'Manage Categories',
            username: res.locals.user,
            allCategoriesList: categories,
        });
    } catch (error) {
        res.render('categories', {
            title: 'Manage Categories',
            username: res.locals.user,
            error: 'Something went wrong!',
        });
    };
};

const getCategoryDetailsView = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        let error: string | null = null;

        // Validate category Id
        if(!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            error = 'Category not provided or invalid!';
        }        
        else {
            // Get category details
            const categoryDetails: CategoryDetailsDocument | null = await fetchCategoryDetails(req.params.id);
            // If no category details
            if(!categoryDetails || categoryDetails === null){
                error = 'Category details not found!';
            } 
            // If category details found and no error, render details data
            else if (categoryDetails && error === null)
                res.render('categoryView', {
                    username: res.locals.user,
                    _id: categoryDetails._id,
                    title: categoryDetails.name,
                    name: categoryDetails.name,
                    description: categoryDetails.description,
                    url: categoryDetails.url,
            });
        }
        // If error, render error
        if(error !== null){
            res.render('categoryView', {
                username: res.locals.user,
                title: 'Error! Not found.',
                error: error !== null ? error : 'Something went wrong',
            });
        }
        
    } catch (error) {
        console.error(error);
        res.render('categoryView', {
            username: res.locals.user,
            title: 'Error! Something went wrong!',
            error: 'Something went wrong!',
        });
    };
};

const getCreateCategoryView = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
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
    };
};

const postCreateCategory = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        let error = null;
        // Check if the required fields are provided in the body
        if (!req.body.categoryName || !req.body.categoryDescription) {
            // error = 'Please provide all fields!';
            throw new Error ('Please provide all fields!');
        }
        
        const categoryName = trimMultipleWhiteSpaces(req.body.categoryName);
        const categoryDescription = trimMultipleWhiteSpaces(
            req.body.categoryDescription,
        );
        // Validate Category Name and Category Description fields
        if (!validateName(categoryName) || !validateDescription(categoryDescription)) { // If Invalid
            // error = 'Please ensure all fields are valid!';            
            throw new Error('Please ensure all fields are valid!');
        } 
        
        if(error === null && validateName(categoryName) && validateDescription(categoryDescription)) { // If Valid
            const createdCategory = await createCategory(categoryName, categoryDescription);
            if(createdCategory?.name === categoryName) {
                res.render('categoryCreate', {
                    username: res.locals.user,
                    title: 'Create Category',
                    success: `Category ${createdCategory.name} created successfully`,
                    categoryName: '',
                    categoryDescription: '',
                });
            } else {
                throw new Error('Category creation failed!');
            }
        } else { // Otherwise return a default error
            throw new Error('Category Creation: An unkown error occured');
        }

    } catch (err) {
        console.error(err);
        res.render('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: err ? err : `Category creation failed! Something went wrong.`,
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    };

};

const getEditCategory = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        // Validate category id
        if(!req.params.id || req.params.id === undefined || req.params.id === null || !validateIsMongoObjectId(req.params.id)){
            throw new Error('Please provide a valid category!');
        } else {
            const categoryDetails = await (fetchCategoryDetails(req.params.id));
            if (
                categoryDetails &&
                categoryDetails !== null &&
                categoryDetails?._id?.toString() === req.params.id
            ) {
                res.render('categoryEdit', {
                    username: res.locals.user,
                    title: 'Edit Category',
                    error: null,
                    id: req.params.id,
                    categoryName: categoryDetails.name,
                    categoryDescription: categoryDetails.description,
                });
            } else throw new Error('Category not found!');
        }

    } catch (err) {
        console.error(err);
        res.render('categoryEdit', {
            username: res.locals.user,
            title: 'Edit Category',
            error: err,
            id: req.params.id ? req.params.id : '',
            categoryName: '',
            categoryDescription: '',
        });
    }
};

const postEditCategory = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {     
        // Validate category id
        if(!req.params.id || req.params.id === undefined || req.params.id === null || !validateIsMongoObjectId(req.params.id)){
            throw new Error('Please provide a valid category!');
        } 
        // Check if category name and category description fields are provided
        else if(!req.body.categoryName || !req.body.categoryDescription) {
            throw new Error('Please provide all fields!');
        }         
        else {
            // Trim multiple white spaces
            const categoryName = trimMultipleWhiteSpaces(req.body.categoryName);
            const categoryDescription = trimMultipleWhiteSpaces(
                req.body.categoryDescription,
            );
            // Validate category name and category description provided
            if (validateName(categoryName) && validateDescription(categoryDescription)) {
                const dataCategoryDetails = {
                    name: categoryName,
                    description: categoryDescription,
                }
                // Update category details
                const dataUpdatedCategoryDetails = await updateCategoryDetails(req.params.id, dataCategoryDetails);
                if(dataUpdatedCategoryDetails && dataUpdatedCategoryDetails?._id?.toString() === req.params.id) {
                    res.redirect(dataUpdatedCategoryDetails.url);
                } else { // Throw error if update fails
                    throw new Error('Category Update Failed!');    
                }
            } else { // Error if category name and category description are invalid
                throw new Error('Please check provided fields!');
            }
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
    };
};

const getDeleteCategory = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        // Validate category id
        if(!req.params.id || req.params.id === undefined || req.params.id === null || !validateIsMongoObjectId(req.params.id)){
            throw new Error('Please provide a valid category!');
        } else {
            // Fetch category details from database
            const categoryDetails = await (fetchCategoryDetails(req.params.id));
            // If category exists
            if (
                categoryDetails &&
                categoryDetails !== null &&
                categoryDetails?._id?.toString() === req.params.id
            ) { // Render GET delete category view
                res.render('categoryDelete', {
                    username: res.locals.user,
                    categoryId: categoryDetails._id,
                    title: 'Delete Category',
                    name: categoryDetails.name,
                    description: categoryDetails.description,
                    url: categoryDetails.url,
                });
            } 
            // Otherwise throw error
            else { 
                throw new Error('Category not found!');
            };
        }
    } catch (err) {
        console.error(err);
        // Render error
        res.render('categoryDelete', {
            username: res.locals.user,
            categoryId: req.params.id,
            title: 'Delete Category',
            error: err,
            name: '',
            description: '',
            url: '',
        });
    }
};

const postDeleteCategory = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        // Validate category id
        if(!req.body.categoryId || req.body.categoryId === undefined || req.body.categoryId === null || !validateIsMongoObjectId(req.body.categoryId)){
            throw new Error('Please provide a valid category!');
        } else {
            // Try deleting the category
            const { error, success } = await deleteCategory(req.body.categoryId);
            // If no error, Redirect to the Manage Categories View
            if(error === null && success === true) res.redirect('/categories');
            // If deletion fails, throw error
            else if(error !== null || success !== true) throw new Error(error ? error : 'Deletion failed');
        }
    } catch (error) {
        console.error(error);        
        // Render error if error
        res.render('categoryDelete', {
            username: res.locals.user,
            title: 'Delete Category',
            error: error,
            categoryId: (req.body.categoryId !== undefined ? req.body.categoryId : ''),
            name: '',
            description: '',
        });
    }
};

export {
    getManageCategoriesView,
    getCategoryDetailsView,
    getCreateCategoryView,
    postCreateCategory,
    getEditCategory,
    postEditCategory,
    getDeleteCategory,
    postDeleteCategory,
};
