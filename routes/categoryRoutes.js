import express from 'express';
const categoryRouter = express.Router();
import {
    getAllCategoriesList,
    getCategoryDetail,
    getCreateCategory,
    postCreateCategory,
    getEditCategory,
    postEditCategory,
    getDeleteCategory,
    postDeleteCategory,
} from '../controllers/categoryController.js';
import productRouter from './productRoutes.js';

// GET request to fetch all categories
categoryRouter.get('/', getAllCategoriesList);

// GET request to create a new category
categoryRouter.get('/create', getCreateCategory);

// POST request to create a new category
categoryRouter.post('/create', postCreateCategory);

// GET request to fetch one category
categoryRouter.get('/:id', getCategoryDetail);

// GET request to edit one category
categoryRouter.get('/:id/edit', getEditCategory);

// POST request to edit one category
categoryRouter.post('/:id/edit', postEditCategory);

// GET request to delete category by :id
categoryRouter.get('/:id/delete', getDeleteCategory);

// POST request to delete category by :id
categoryRouter.post('/:id/delete', postDeleteCategory);

// Use product router
categoryRouter.use('/:id/products', productRouter);

export default categoryRouter;
