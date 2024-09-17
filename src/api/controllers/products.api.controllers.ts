import { Request, Response } from 'express';
import { fetchProducts } from '../services/products.services.js';

const getProducts = async(req: Request, res: Response) => {
    let page: number = 0;
    let perPageLimit: number = 6;
    const allowedPerPageLimitValues = [6, 9, 12];
    
    if(req.query.page && Array.isArray(req.query.page) && typeof Number(req.query.page[0]) === 'number') {
        page = Number(req.query.page[0]) - 1;
    } else if (req.query.page && typeof Number(req.query.page) === 'number') page = Number(req.query.page) - 1;

    if(req.query.limit && Array.isArray(req.query.limit) && typeof Number(req.query.limit[0]) === 'number' && allowedPerPageLimitValues.includes(Number(req.query.limit[0]))) {
        perPageLimit = Number(req.query.limit[0]);
    } else if (
        req.query.limit &&
        typeof Number(req.query.limit) === 'number' &&
        allowedPerPageLimitValues.includes(Number(req.query.limit))
    )
        perPageLimit = Number(req.query.limit);
    
    const products = await fetchProducts(Number(page), Number(perPageLimit));
    res.json({
        productList: products.productList,
        totalPages: products.totalPagesBasedOnLimit,
    });
};

export { getProducts };
