import { NextFunction, Request, Response } from 'express';
import { apiGetCarouselPromos } from '../services/promos.services.js';

const getCarouselPromos = async(req: Request, res: Response, next: NextFunction) => apiGetCarouselPromos(req, res, next);

export { getCarouselPromos };
