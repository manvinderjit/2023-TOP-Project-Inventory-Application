import { NextFunction, Request, Response } from "express";
import { fetchCategories, fetchCategoryDetails } from "../services/category.app.services.js";
import { Types } from "mongoose";
import { validateIsMongoObjectId } from "../../utilities/validation.js";
import { CategoryDetailsDocument } from "../../types/types.js";

const manageCategoriesView = async (req: Request, res: Response): Promise<void> => {
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

const categoryDetailsView = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
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

export { manageCategoriesView, categoryDetailsView };
