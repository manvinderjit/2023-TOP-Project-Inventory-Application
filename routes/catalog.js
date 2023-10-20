import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
const routerCategory = express.Router();

/// Category Routes ///

// GET request to the homepage (all categories)
routerCategory.get('/', categoryController.categoryList);

// GET request to get a category
routerCategory.get('/:id', categoryController.categoryDetail);

// POST request to create a category
routerCategory.post('/', categoryController.createCategoryPost);

// GET request to update a category
routerCategory.put('/category', (req, res) => {
    res.send('PUT request to the create category page, NOT IMPLEMENTED!');
});

// GET request to delete a category
routerCategory.get('/:id/delete/:id', categoryController.deleteCategoryDetails);

// POST request to delete a category
routerCategory.post('/:id/delete/:id', categoryController.deleteCategory);

// POST request to delete a category

// GET request to update a category

// POST request to update a category

// GET request for one category

/// Item Routes ///

// GET request for all items

// GET request for one item

// GET request to create an item

// POST request to create an item

// GET request to delete an item

// POST request to delete an item

// GET request to update an item

// POST request to update an item

export default routerCategory;
