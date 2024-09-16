import Promo from '../../app/models/promoModel.js';
import { Request, Response, NextFunction } from 'express';

const apiGetCarouselPromos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const carouselPromos = await Promo.find({
            category: 'Carousel',
            status: 'Active',
        })
            .sort({ name: 1 })
            .select({ _id: 0, name: 1, caption: 1, category: 1, imageUrl: 1 })
            .exec();

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

export { apiGetCarouselPromos };
