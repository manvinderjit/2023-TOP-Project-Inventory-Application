import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const apiGetAllProducts = async (req, res, next) => {
    try {
        // Get all categories for select list
        const categories = await Category.find().sort({ name: 1 }).exec();

        const allProducts = await Product.find()
            .populate({ path: 'category', select: 'name' })
            .sort({ name: 1 })
            .exec();

        if (!allProducts || allProducts.length === 0) {
            res.status(200).send({
                message: 'No Products to Show!',
            });
        } else {
            res.status(200).send({
                categoryList: categories,
                productList: allProducts,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

export { apiGetAllProducts };
