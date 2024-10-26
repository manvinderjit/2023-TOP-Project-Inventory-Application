import { NextFunction, Request, Response } from 'express';
import { fetchCategories } from '../services/category.app.services.js';
import { fetchProduct, fetchProducts } from '../services/products.app.services.js';
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

export const getProductDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for a product id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            throw new Error('Product not found!');
        } else {
            // Get the product details
            const productDetails: ProductDetails | null = await fetchProduct(req.params.id);

            if(productDetails && String(productDetails._id) === req.params.id) {
                res.render('productView', {
                    title: 'Product Details',
                    username: res.locals.user,
                    productDetails: productDetails,
                });
                
            } else { // If product not found
                throw new Error('Product not found!');
            };
        };  
    } catch (error) {
        res.render('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: error,
        });
    };
};

export const getCreateProducts = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postCreateProducts = (req: Request, res: Response) => {
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
