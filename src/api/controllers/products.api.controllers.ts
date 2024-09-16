import { Request, Response } from 'express';
import { fetchProducts } from '../services/products.services.js';

const getProducts = async(req: Request, res: Response) => {
    let page: number = 0;
    
    if(Array.isArray(req.query.page) && typeof Number(req.query.page[0]) === 'number') {
        page = Number(req.query.page[0]);
    } else if (typeof Number(req.query.page) === 'number') page = Number(req.query.page);
    
    const products = await fetchProducts(Number(page), 6);
    res.json(products);
};

export { getProducts };
