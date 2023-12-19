import express from 'express';
const apiPromosRouter = express.Router();
import {
    apiGetCarouselImage,
    apiGetCarouselImageByParams,
} from '../controllers/apiImageController.js';
import { apiGetCarouselPromos } from '../controllers/apiCarouselController.js';

// GET request to fetch all categories
apiPromosRouter.get('/', (req, res) => {
    res.status(201).send(`Welcome to the promos`);
});

apiPromosRouter.get('/carousel', apiGetCarouselPromos);

apiPromosRouter.get('/carousel/:name', apiGetCarouselImageByParams);

export default apiPromosRouter;
