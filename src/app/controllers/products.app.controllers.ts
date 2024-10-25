import { NextFunction, Request, Response } from 'express';
import { fetchCategories } from '../services/category.app.services.js';
import { fetchProducts } from '../services/products.app.services.js';
import { CategoryDetailsDocument, ProductDetails } from '../../types/types.js';
import { validateIsMongoObjectId } from '../../utilities/validation.js';

export const getManageProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all categories for selecting products based on categories
        const productCategories: CategoryDetailsDocument[] = await fetchCategories();

        // Validate product category if provided and throw error if invalid
        if(req.body?.productCategory && !validateIsMongoObjectId(req.body.productCategory)) throw new Error('No products found!');

        // Fetch products 
        const dataProducts: ProductDetails[] = await fetchProducts(req.body?.productCategory);

        if(dataProducts && dataProducts.length > 0 ) {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                allProductsList: dataProducts,
                categoryList: productCategories,
                selectedCategory: req.body.productCategory,
            });
        } else {            
            throw new Error('No products found!');        
        }        
    } catch (error) {
        console.error(error);
        res.render('products', {
            title: 'All Products',
            username: res.locals.user,
            error: error,            
            selectedCategory: req.body.productCategory,
        });
    };
};

export const postManageProducts = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getCreateProducts = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postCreateProducts = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getProductDetails = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getEditProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postEditProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getEditProductImage = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postEditProductImage = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getDeleteProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postDeleteProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};
