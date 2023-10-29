import express from 'express';
import { protectRoutes } from '../middleware/authMiddleware.js';
const apiCustomerRouter = express.Router();

export default apiCustomerRouter;
