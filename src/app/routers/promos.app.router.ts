import express, { Router } from 'express';
import * as promosControllers from '../controllers/promos.app.controllers.js';
import { redirectToLogin } from '../middleware/auth.mw.js';

const promosAppRouter: Router = express.Router();

// GET request to render Manage Promos view
promosAppRouter.get('/', redirectToLogin, promosControllers.getManagePromos);

// GET request to fetch promos by category
promosAppRouter.post('/', redirectToLogin, promosControllers.getManagePromos);

// GET request to render Create Promo view
promosAppRouter.get('/create', redirectToLogin, promosControllers.getCreatePromo);

// POST request to Create Promo
promosAppRouter.post('/create', redirectToLogin, promosControllers.postCreatePromo);

// GET request to render Promo Details view
promosAppRouter.get('/:id', redirectToLogin, promosControllers.getPromoDetails);

// GET request to render Delete Promo view
promosAppRouter.get('/:id/delete', redirectToLogin, promosControllers.getDeletePromo);

// POST request to Delete Promo
promosAppRouter.post('/:id/delete', redirectToLogin, promosControllers.postDeletePromo);

// GET request to render Edit Promo view
promosAppRouter.get('/:id/edit', redirectToLogin, promosControllers.getEditPromo);

// POST request to Edit Promo
promosAppRouter.post('/:id/edit', redirectToLogin, promosControllers.postEditPromo);

export default promosAppRouter;
