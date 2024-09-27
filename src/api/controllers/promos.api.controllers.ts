import { NextFunction, Request, Response } from 'express';
import * as apiPromoServices from '../services/promos.services.js';

const getCarouselPromos = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const carouselPromos = await apiPromoServices.fetchCarouselPromos();        

        if (!carouselPromos || carouselPromos.length === 0) {
            res.status(400).send({
                message: 'No Promos to Show!',
            });
        } else {
            res.status(200).send({
                carouselPromos,
            });
        }
    } catch (error) {
        res.status(400).send({
            error: 'Something went wrong!',
        });
        next(error);
    }
};

export { getCarouselPromos };
