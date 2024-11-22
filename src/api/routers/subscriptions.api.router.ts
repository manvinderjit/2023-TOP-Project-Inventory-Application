import express, { Router } from 'express';

import * as apiSubscriptionsController from '../controllers/subscriptions.api.controllers.js';

const apiSubscriptionsRouter: Router = express.Router();

apiSubscriptionsRouter.get('/', apiSubscriptionsController.getSubscriptionStatus);

apiSubscriptionsRouter.post('/', apiSubscriptionsController.postSubscribeToNewProducts);

apiSubscriptionsRouter.post('/cancel', apiSubscriptionsController.postUnsubscribeToNewProducts);

export default apiSubscriptionsRouter;
