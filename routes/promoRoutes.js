import express from 'express';
const promoRouter = express.Router();
import fileUpload from 'express-fileupload';

import { getAllPromos, getCreatePromo, postCreatePromo } from '../controllers/promoController.js';

// GET request to fetch all promos
promoRouter.get('/', getAllPromos);

// GET request to fetch promos by category
promoRouter.post('/', getAllPromos);

// GET request to create a new promo
promoRouter.get('/create', getCreatePromo);

promoRouter.post('/create', fileUpload(), postCreatePromo);

export default promoRouter;
