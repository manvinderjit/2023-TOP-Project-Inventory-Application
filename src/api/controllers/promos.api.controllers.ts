import { NextFunction, Request, Response } from 'express';
import { fetchCarouselPromos } from '../services/promos.services.js';

const getCarouselPromos = async(req: Request, res: Response, next: NextFunction) => fetchCarouselPromos(req, res, next);

export { getCarouselPromos };
