import express from 'express';
const promoRouter = express.Router();

import { getAllPromos, getCreatePromo } from '../controllers/promoController.js';

// GET request to fetch all promos
promoRouter.get('/', getAllPromos);

// GET request to create a new promo
promoRouter.get('/create', getCreatePromo);

export default promoRouter;
