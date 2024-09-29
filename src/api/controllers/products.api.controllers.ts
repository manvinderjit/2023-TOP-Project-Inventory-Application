import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { fetchProductsService, fetchTotalPagesBasedOnLimit } from '../services/products.services.js';
import {
    validateIsMongoObjectId,
    validateQuery,
} from '../../utilities/validation.js';

const validateProps = (req: Request) => {
    for (let propName in req.query) {
        if (req.query.hasOwnProperty(propName)) {
            if( Array.isArray(req.query[propName])      && 
                typeof req.query[propName] !== 'string' &&
                typeof req.query[propName] !== 'number')
                return false;
        }
    }
    return true;
};

const buildProductsQuery = (categoryQuery: string | null, searchQuery: string | null) => {
    let query: any = {};

    if (
        validateQuery(categoryQuery) &&
        typeof categoryQuery === 'string' &&
        validateIsMongoObjectId(categoryQuery)
        // Also check if the category exists in the database ??
    )
        query.category = { _id: categoryQuery };

    if (validateQuery(searchQuery) && typeof searchQuery === 'string')
        query.$text = { $search: searchQuery };

    return query;
};

const getProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    let page: number = 0;
    let perPageLimit: number = 6;
    const allowedPerPageLimitValues = [6, 9, 12];

    try {
        if (validateProps(req)) { // Are query props valid
            // Validate and assign Page Number
            if (req.query.page && typeof Number(req.query.page) === 'number')
                page = Number(req.query.page) - 1;

            // Validate and assign per page limit
            if (
                req.query.limit &&
                typeof Number(req.query.limit) === 'number' &&
                allowedPerPageLimitValues.includes(Number(req.query.limit))
            )
                perPageLimit = Number(req.query.limit);

            // Build search query by validating query search params
            const searchQuery = buildProductsQuery(
                req.query.category as string,
                req.query.search as string,
            );

            const fetchedProducts = await fetchProductsService(
                Number(page),
                Number(perPageLimit),
                searchQuery,
            );

            // If no products
            if (!fetchedProducts || fetchedProducts.length === 0) {
                res.status(400).json({
                    error: 'No Products to Show!',
                    productList: null,
                });
            } else if (fetchedProducts && fetchedProducts.length > 0) {
                const totalPages = await fetchTotalPagesBasedOnLimit(
                    searchQuery,
                    perPageLimit,
                );

                res.json({
                    productList: fetchedProducts,
                    totalPages,
                });
            }
        } else {
            next(createHttpError(400, 'Invalid request!'));
        }
        
    } catch (error) {
        next(error);
    }
};

export { getProducts };
