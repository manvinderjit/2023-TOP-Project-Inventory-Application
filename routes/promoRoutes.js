import express from 'express';
const promoRouter = express.Router();
import fileUpload from 'express-fileupload';

import {
    getAllPromos,
    getCreatePromo,
    postCreatePromo,
    getViewPromo,
    getEditPromo,
    postEditPromo,
    getDeletePromo,
    postDeletePromo,
    getEditPromoImage,
    postEditPromoImage,
} from '../controllers/promoController.js';

// GET request to fetch all promos
promoRouter.get('/', getAllPromos);

// GET request to fetch promos by category
promoRouter.post('/', getAllPromos);

// GET request to create a new promo
promoRouter.get('/create', getCreatePromo);

// POST request to create a new promo
promoRouter.post('/create', fileUpload(), postCreatePromo);

// GET request to view a promo
promoRouter.get('/:id', getViewPromo);

// GET request to edit a promo
promoRouter.get('/:id/edit', getEditPromo);

// POST request to edit a promo
promoRouter.post('/:id/edit', postEditPromo);

// GET request to edit a promo's image
promoRouter.get('/:id/edit/image', getEditPromoImage);

// POST request to edit a promo's image
promoRouter.post('/:id/edit/image', fileUpload(), postEditPromoImage);

// GET request to delete a promo
promoRouter.get('/:id/delete', getDeletePromo);

// POST request to delete a promo
promoRouter.post('/:id/delete', postDeletePromo);

export default promoRouter;
