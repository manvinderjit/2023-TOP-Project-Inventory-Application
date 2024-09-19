import { Request, Response } from 'express';
import { fetchProducts } from '../services/products.services.js';

const getProducts = async(req: Request, res: Response) => {
    let page: number = 0;
    let perPageLimit: number = 6;
    let searchQuery: string | null = null;
    let categoryQuery: string | null = null;
    const allowedPerPageLimitValues = [6, 9, 12];
    
    if (
        req.query.page &&
        Array.isArray(req.query.page) &&
        typeof Number(req.query.page[0]) === 'number'
    ) {
        page = Number(req.query.page[0]) - 1;
    } else if (req.query.page && typeof Number(req.query.page) === 'number')
        page = Number(req.query.page) - 1;
       
    if (
        req.query.limit &&
        Array.isArray(req.query.limit) &&
        typeof Number(req.query.limit[0]) === 'number' &&
        allowedPerPageLimitValues.includes(Number(req.query.limit[0]))
    ) {
        perPageLimit = Number(req.query.limit[0]);
    } else if (
        req.query.limit &&
        typeof Number(req.query.limit) === 'number' &&
        allowedPerPageLimitValues.includes(Number(req.query.limit))
    )
        perPageLimit = Number(req.query.limit);

    if (
        req.query.category &&
        Array.isArray(req.query.category) &&
        typeof (req.query.category[0]) === 'string'
    ) {
        categoryQuery = req.query.category[0];
    } else if (typeof req.query.category === 'string' && req.query.category !== '') categoryQuery = req.query.category;

    if (
        req.query.search &&
        Array.isArray(req.query.search)
        // && typeof (req.query.search[0]) is MongoDB Object
    ) {
        searchQuery = req.query.search[0] as string;
    } else if (req.query.search !== '')
        searchQuery = req.query.search as string;

    const products = await fetchProducts(
        Number(page),
        Number(perPageLimit),
        categoryQuery,
        searchQuery,
    );
    res.json({
        productList: products.productList,
        totalPages: products.totalPagesBasedOnLimit,
    });
};

export { getProducts };
