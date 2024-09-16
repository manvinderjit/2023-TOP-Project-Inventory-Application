import express, { Router } from 'express';
import { apiGetCarouselImage } from '../controllers/image.api.controllers.js';
import { getCarouselPromos } from '../controllers/promos.api.controllers.js';

const apiPromosRouter: Router = express.Router();

apiPromosRouter.get('/carousel', getCarouselPromos);

apiPromosRouter.get('/image/:name', apiGetCarouselImage);

export default apiPromosRouter;
