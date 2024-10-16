import express from 'express';
import { protectRoutes } from '../middleware/apiAuthMiddleware.js';
const apiRouter = express.Router();
import apiUserRouter from './apiUserRoutes.js';
import { registerUser } from '../controllers/apiRegisterController.js';
import { loginApiUser } from '../controllers/apiAuthController.js';
import apiOrderRouter from './apiOrderRoutes.js';
import { apiCreateOrder } from '../controllers/apiOrderController.js';
import apiPromosRouter from './apiPromosRoutes.js';
import apiProductsRouters from './apiProductRoutes.js';

// GET request to register user
apiRouter.get('/register', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the registration page! Happy Shopping!',
    });
});

// POST request to register user
apiRouter.post('/register', registerUser);

// GET request to login user
apiRouter.get('/login', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the login page! Happy Shopping!',
    });
});

// POST request to login user
apiRouter.post('/login', loginApiUser);

// GET request to api homee
apiRouter.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the api index!',
    });
});

apiRouter.use('/products', apiProductsRouters);

// GET request to fetch data for logged-in user
apiRouter.use('/dash', protectRoutes, apiUserRouter);

apiRouter.use('/orders', protectRoutes, apiOrderRouter);

apiRouter.use('/checkout', apiCreateOrder);

apiRouter.use('/promos', apiPromosRouter);

export default apiRouter;
