import { NextFunction, Request, Response } from 'express';
import { fetchProducts } from '../services/products.services.js';

const getProducts = async(req: Request, res: Response) => {
    const products = await fetchProducts(1,3);
    res.json(products);
};

export { getProducts };