import { Request, Response } from "express";
import { fetchCategories } from "../services/category.app.services.js";

const categoryView = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await fetchCategories();
        res.render('categories', {
            title: 'Manage Categories',
            username: res.locals.user,
            allCategoriesList: categories,
        });
    } catch (error) {
        res.render('categories', {
            title: 'All Categories',
            username: res.locals.user,
            error: 'Something went wrong!',
        });
    };
};

export { categoryView };
