import { NextFunction, Request, Response } from 'express';
import { fetchPromoDetails, fetchPromos, promoCategories } from '../services/promos.app.services.js';
import { validateIsMongoObjectId } from '../../utilities/validation.js';

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
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid promo ID provided');
        } else {
            // Fetch promo details
            const promoDetails = await fetchPromoDetails(req.params.id);
            // If promo details found
            if(promoDetails && promoDetails !== null && promoDetails._id.toString() === req.params.id) {
                res.render('promoView', {
                    title: 'Promo Details',
                    username: res.locals.user,
                    promoDetails: promoDetails,
                });
            }
            else throw new Error('Promo not found!');
        }
    } catch (err) {
        console.error(err);
        res.render('promoView', {
            title: 'Promo Details: Error',
            username: res.locals.user,
            error: err,
        });
    }
};

export const getCreatePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            promoName: '',
            promoCaption: '',
            promoDescription: '',
            promoCategoryList: promoCategories,
            selectedPromoCategory: null,
        });
    } catch (err) {
        console.error(err);
        res.render('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: err,
            selectedPromoCategory: null,
            promoCategoryList: promoCategories,
        });
    }
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
