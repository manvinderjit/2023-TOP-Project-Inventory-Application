import express, { Router } from 'express';
import * as categoryControllers from '../controllers/category.app.controllers.js';
import { redirectToLogin } from '../middleware/auth.mw.js';

const categoryAppRouter: Router = express.Router();

// GET request to render Manage Categories view
categoryAppRouter.get('/', redirectToLogin, categoryControllers.getManageCategoriesView);

categoryAppRouter.get('/create', redirectToLogin, categoryControllers.getCreateCategoryView);

categoryAppRouter.post('/create', redirectToLogin, categoryControllers.postCreateCategory);

categoryAppRouter.get('/:id', redirectToLogin, categoryControllers.getCategoryDetailsView);

categoryAppRouter.get('/:id/delete', redirectToLogin, categoryControllers.getDeleteCategory);

categoryAppRouter.post('/:id/delete', redirectToLogin, categoryControllers.postDeleteCategory);

categoryAppRouter.get('/:id/edit', redirectToLogin, categoryControllers.getEditCategory);

categoryAppRouter.post('/:id/edit', redirectToLogin, categoryControllers.postEditCategory);

export default categoryAppRouter;
