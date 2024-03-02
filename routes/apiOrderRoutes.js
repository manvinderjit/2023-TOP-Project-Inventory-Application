import express from 'express';
const apiOrderRouter = express.Router();
import {
    apiGetAllOrdersForAUser,
    apiCreateOrder,
    apiPostCancelOrder,
} from '../controllers/apiOrderController.js';

apiOrderRouter.get('/', apiGetAllOrdersForAUser);

// apiOrderRouter.post('/', apiCreateOrder);

apiOrderRouter.post('/cancel', apiPostCancelOrder);

export default apiOrderRouter;
