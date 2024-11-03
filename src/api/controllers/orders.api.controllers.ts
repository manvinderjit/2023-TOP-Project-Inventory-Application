import { NextFunction, Request, Response } from 'express';
import { fetchTotalPageCountForOrders, fetchUserOrders } from '../services/orders.services.js';
import { OrderDetails } from '../../types/types.js';
import { validateIsNumber } from '../../utilities/validation.js';

export const getUserOrders = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const perPageLimit: number = 7;
        const { userId } = req;        
        const pageNumber: number =
            req.query.page &&
            !Array.isArray(req.query.page) &&
            validateIsNumber(String(req.query.page)) && 
            Number(req.query.page) > 0
                ? Number(req.query.page) - 1
                : 0;

        if(userId && userId !== undefined) {
            const userOrders: OrderDetails[] | null = await fetchUserOrders(userId, pageNumber, perPageLimit);

            if (!userOrders || userOrders.length === 0) {
                return res.status(404).json({
                    error: 'No Orders to Show!',
                });
            } else {
                const totalPages = await fetchTotalPageCountForOrders(userId, perPageLimit);
                return res.status(200).json({
                    ordersList: userOrders,
                    totalOrdersPages: totalPages,
                });
            }
        } else {
            return res.status(401).json({
                error: 'You are not authorized to do that!',
            }); 
        }
    } catch (error) {
        next(error);
    }
};
