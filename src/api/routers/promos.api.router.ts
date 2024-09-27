import express, { Router } from 'express';
import { apiGetImage } from '../controllers/image.api.controllers.js';
import { getCarouselPromos } from '../controllers/promos.api.controllers.js';

const apiPromosRouter: Router = express.Router();

apiPromosRouter.get('/carousel', getCarouselPromos);

apiPromosRouter.get('/image/:name', apiGetImage);

export default apiPromosRouter;
