import express from 'express';
const productRouter = express.Router({ mergeParams: true });
import {
    getAllProducts,
    getCreateProduct,
    postCreateProduct,
    getOneProduct,
    getEditProduct,
    postEditProduct,
    getDeleteProduct,
    postDeleteProduct,
} from '../controllers/productController.js';

// productRouter.get('/',(req,res) => {    
//     req.params.id
//         ? res.send(`All products for category ${req.params.id}`)
//         : getAllProducts;
// });

// GET request to fetch all products
productRouter.get('/', getAllProducts);

// POST request to fetch products for a category
productRouter.post('/', getAllProducts);

// GET request to create a product
productRouter.get('/create', getCreateProduct);

// POST request to create a product
productRouter.post('/create', postCreateProduct);

// GET request to view a product's details
productRouter.get('/:id', getOneProduct);

// GET request to edit a product's details
productRouter.get('/:id/edit', getEditProduct);

// POST request to edit a product's details
productRouter.post('/:id/edit', postEditProduct);

// GET request to delete a product's details
productRouter.get('/:id/delete', getDeleteProduct);

// POST request to delete a product's details
productRouter.post('/:id/delete', postDeleteProduct);

export default productRouter;
