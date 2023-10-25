import Router from 'express';
const categoryRouter = new Router();
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

export default categoryRouter;
