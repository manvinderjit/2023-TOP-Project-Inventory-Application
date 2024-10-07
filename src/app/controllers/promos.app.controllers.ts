import { NextFunction, Request, Response } from 'express';
import { fetchPromos, promoCategories } from '../services/promos.app.services.js';

export const getManagePromos = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch Promos Data
        const dataPromos = await fetchPromos(req.body?.promoCategory);
        // Check if data returned
        if(dataPromos && dataPromos.length > 0){
            // Render the Manage Promos View
            res.render('promos', {
                title: 'Manage Promos',
                username: res.locals.user,
                promosList: dataPromos,
                promoCategoryList: promoCategories,
                selectedPromoCategory: req.body.promoCategory,
            });
        } else{
            throw new Error('No Promos Found!');
        }
    } catch (error) {
        console.error(error);
        res.render('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            error: error,
            promosList: null,
        });
    }
};

export const getPromoDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const getCreatePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const postCreatePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const getEditPromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const postEditPromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const getDeletePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};

export const postDeletePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not Implemented Yet!');
    } catch (error) {}
};
