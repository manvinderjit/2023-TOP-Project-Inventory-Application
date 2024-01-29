import express from 'express';
const apiProductsRouters = express.Router();
import { apiGetProductImageByParams } from '../controllers/apiImageController.js';
import { apiGetAllProducts } from '../controllers/apiProductController.js';

// // GET request to fetch all categories
// apiProductsRouters.get('/', (req, res) => {
//     res.status(201).send(`Welcome to the promos`);
// });

// GET request to get all products
apiProductsRouters.get('/', apiGetAllProducts);

apiProductsRouters.get('/image/:name', apiGetProductImageByParams);

export default apiProductsRouters;
