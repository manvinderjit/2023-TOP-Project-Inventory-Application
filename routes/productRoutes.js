import express from 'express';
const productRouter = express.Router({ mergeParams: true });
import { getAllProducts, getCreateProduct, postCreateProduct } from '../controllers/productController.js';

// productRouter.get('/',(req,res) => {    
//     req.params.id
//         ? res.send(`All products for category ${req.params.id}`)
//         : getAllProducts;
// });

productRouter.get('/', getAllProducts);

productRouter.get('/create', getCreateProduct);

productRouter.post('/create', postCreateProduct);

export default productRouter;
