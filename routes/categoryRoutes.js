import Router from 'express';
const categoryRouter = new Router();
import { getAllCategoriesList, getCategoryDetail, getCreateCategory, postCreateCategory } from '../controllers/categoryController.js';

// GET request to fetch all categories
categoryRouter.get('/', getAllCategoriesList);

// GET request to create a new category
categoryRouter.get('/create', getCreateCategory);

// POST request to create a new category
categoryRouter.post('/create', postCreateCategory);

// GET request to fetch one category
categoryRouter.get('/:id', getCategoryDetail);



export default categoryRouter;
