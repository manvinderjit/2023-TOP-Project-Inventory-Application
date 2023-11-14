import express from 'express';
const apiUserRouter = express.Router();
import { apiGetAllOrdersForAUser } from '../controllers/apiOrderController.js';

apiUserRouter.get('/', apiGetAllOrdersForAUser);

export default apiUserRouter;
