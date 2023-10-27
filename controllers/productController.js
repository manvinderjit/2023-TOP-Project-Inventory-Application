import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const getAllProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find().sort({ name: 1 }).exec();        

        if(!allProducts || allProducts.length === 0) {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                error: 'No products found!',
            });
        } else {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                allProductsList: allProducts,
            });            
        }
    } catch (error) {
        console.error(error);
        res.render('products', {
            title: 'All Products',
            username: res.locals.user,
            error: error,
            allProductsList: null,
        });
    }
}

const getCreateProduct = async (req, res, next) => {
    try {
        // Get all categories for select list
        const allCategories = await Category.find().sort({ name: 1 }).exec();

        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: '',
            productStock:'',
            categoryList: allCategories,
        });
    } catch (error) {
        console.error(error);
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: error,
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: '',
            productStock: '',
        });
    }
};

const postCreateProduct = async (req, res, next) => {
    // Get all categories for select list
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    try {
        const product = new Product({
            name: req.body.productName,
            description: req.body.productDescription,
            category: req.body.productCategory,
            price: req.body.productPrice,
            stock: req.body.productStock,
        });
        console.log(product);

        const createdProduct = await product.save();

        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            success: `Product created with id ${createdProduct._id}`,
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: '',
            productStock: '',
            categoryList: allCategories,
        });
    } catch (error) {
        console.error(error);

        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: error,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }
};

export { getAllProducts, getCreateProduct, postCreateProduct };
