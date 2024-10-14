import express, { Router } from 'express';
import { redirectToLogin } from '../middleware/auth.mw.js';
import fileUpload from 'express-fileupload';
import * as productsControllers from '../controllers/products.app.controllers.js';

const productsAppRouter: Router = express.Router();

// GET request to render Manage Products view
productsAppRouter.get('/', redirectToLogin, productsControllers.getManageProducts);

// POST request to fetch Products by category
productsAppRouter.post('/', redirectToLogin, productsControllers.getManageProducts);

// GET request to create a new product
productsAppRouter.get('/create', redirectToLogin, productsControllers.getCreateProducts);

// POST request to create a new product
productsAppRouter.post('/create', redirectToLogin, fileUpload(), productsControllers.postCreateProducts);

// GET request to fetch product details by Product Id
productsAppRouter.get('/:id', redirectToLogin, productsControllers.getProductDetails);

// GET request to fetch Edit Product details view
productsAppRouter.get('/:id/edit', redirectToLogin, productsControllers.getEditProduct);

// POST request to Edit Product details
productsAppRouter.post('/:id/edit', redirectToLogin, productsControllers.postEditProduct);

// GET request to fetch Delete Product details view
productsAppRouter.get('/:id/delete', redirectToLogin, productsControllers.getDeleteProduct);

// POST request to Delete Product details
productsAppRouter.post('/:id/delete', redirectToLogin, productsControllers.postDeleteProduct);

// GET request to fetch Edit Product Image view
productsAppRouter.get('/:id/edit/image', redirectToLogin, productsControllers.getEditProductImage);

// POST request to Edit Product Image
productsAppRouter.post('/:id/edit/image', redirectToLogin, fileUpload(), productsControllers.postEditProductImage);

export default productsAppRouter;
