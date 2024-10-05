import { NextFunction, Request, Response } from "express";
import { fetchCategories, fetchCategoryDetails, saveCategoryDetails } from "../services/category.app.services.js";
import { validateDescription, validateIsMongoObjectId, validateName } from "../../utilities/validation.js";
import { CategoryDetailsDocument } from "../../types/types.js";
import { trimMultipleWhiteSpaces } from "../../utilities/stringFormatting.js";

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
            const createdCategory = await saveCategoryDetails(categoryName, categoryDescription);
            if(createdCategory.name === categoryName) {
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

export { getManageCategoriesView, getCategoryDetailsView, getCreateCategoryView, postCreateCategory };
