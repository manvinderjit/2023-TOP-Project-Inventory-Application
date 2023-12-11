import express from 'express';
const apiPromosRouter = express.Router();
import {
    apiGetCarouselImage,
    apiGetCarouselImageByParams,
} from '../controllers/apiImageController.js';

// GET request to fetch all categories
apiPromosRouter.get('/', (req, res) => {
    res.status(201).send(`Welcome to the promos`);
});

apiPromosRouter.get('/carousel', apiGetCarouselImage);

apiPromosRouter.get('/carousel/:name', apiGetCarouselImageByParams);

export default apiPromosRouter;
