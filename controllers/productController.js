import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import {
    validateIsNumber,
    validateName,
    validateDescription,
    validateIsMongoObjectId,
} from '../utilities/validation.js';
import { fileURLToPath } from 'url';
import { replaceFileNameSpacesWithHyphen } from '../utilities/fileFormatting.js';
import { fetchProductNameById } from '../utilities/dataFunctions.js';

const staticsPath = fileURLToPath(new URL('../public', import.meta.url));

const getAllProducts = async (req, res, next) => {
    try {
        // Get all categories for select list
        const categories = await Category.find().sort({ name: 1 }).exec();

        const allProducts =
            !req.body.productCategory ||
            req.body.productCategory.toLowerCase() === 'all'
                ? await Product.find()
                      .populate({ path: 'category', select: 'name' })
                      .sort({ name: 1 })
                      .exec()
                : await Product.find({ category: req.body.productCategory })
                      .populate('category')
                      .sort({ name: 1 })
                      .exec();

        if (!allProducts || allProducts.length === 0) {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                error: 'No products found!',
                categoryList: categories,
                selectedCategory: req.body.productCategory,
            });
        } else {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                allProductsList: allProducts,
                categoryList: categories,
                selectedCategory: req.body.productCategory,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('products', {
            title: 'Products',
            username: res.locals.user,
            error: error,
            allProductsList: null,
        });
    }
};

const getOneProduct = async (req, res) => {
    try {
        // Check if there is an id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
            });
        }

        const product = await Product.findById(req.params.id)
            .populate('category')
            .sort({ name: 1 })
            .exec();

        if (!product || product === null) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
            });
        } else {
            res.render('productView', {
                title: 'Product Details',
                username: res.locals.user,
                productDetails: product,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: error,
        });
    }
};

const getCreateProduct = async (req, res, next) => {
    // Get all categories for select list
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    try {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: 0.0,
            productStock: 0,
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
            productPrice: 0.0,
            productStock: 0,
            categoryList: allCategories,
        });
    }
};

const postCreateProduct = async (req, res, next) => {
    // Get all categories for select list
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    let uploadedFile;

    // If values are not provided, render page with corresponding error
    if (
        !req.body.productName ||
        !req.body.productDescription ||
        !req.body.productCategory ||
        !req.body.productPrice ||
        !req.body.productStock
    ) {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: 'Please provide all values',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // Check if values are empty
    if (
        req.body.productName.trim() === '' ||
        req.body.productDescription.trim() === '' ||
        req.body.productCategory.trim() === '' ||
        req.body.productPrice.trim() === '' ||
        req.body.productStock.trim() === ''
    ) {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: 'Entered values can not be empty',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // If no file is uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: 'No files were uploaded.',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // Check if values are valid
    if (
        !validateName(req.body.productName.trim()) ||
        !validateDescription(req.body.productDescription.trim()) ||
        !validateIsMongoObjectId(req.body.productCategory.trim()) ||
        !validateIsNumber(req.body.productPrice.trim()) ||
        !validateIsNumber(req.body.productStock.trim())
    ) {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: 'One or more entered values are invalid.',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    try {
        uploadedFile = req.files.productImage;

        const newUploadFileName = replaceFileNameSpacesWithHyphen(
            uploadedFile.name,
            req.body.productName,
        );

        const uploadPath =
            staticsPath + '/images/products/' + newUploadFileName;

        // Upload the file on the server
        uploadedFile.mv(uploadPath, async function (error) {
            if (error) {
                console.log(error);
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
            } else {
                const product = new Product({
                    name: trimMultipleWhiteSpaces(req.body.productName),
                    description: trimMultipleWhiteSpaces(
                        req.body.productDescription,
                    ),
                    imageUrl: `api/images/products/${newUploadFileName}`,
                    imageFilename: newUploadFileName,
                    category: trimMultipleWhiteSpaces(req.body.productCategory),
                    price: trimMultipleWhiteSpaces(req.body.productPrice),
                    stock: trimMultipleWhiteSpaces(req.body.productStock),
                });

                let createdProduct;

                try {
                    createdProduct = await product.save();
                    if (createdProduct) {
                        res.render('productCreate', {
                            username: res.locals.user,
                            title: 'Create Product',
                            success: `Product created with name ${createdProduct.name}`,
                            productName: '',
                            productDescription: '',
                            productCategory: '',
                            productPrice: '',
                            productStock: '',
                            categoryList: allCategories,
                        });
                    }
                } catch (error) {
                    // Delete the uploaded file, if database error
                    unlink(uploadPath, (error) => {
                        // Delete the file
                        if (error) throw error;
                        console.log(`${uploadedFile.name} file was deleted`);
                    });
                    // Rerender the page
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
            }
        });
    } catch (error) {
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

const getEditProduct = async (req, res) => {
    // Get all categories for select list
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    try {
        // Check if there is an id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
            });
        }

        const product = await Product.findById(req.params.id)
            .populate('category')
            .sort({ name: 1 })
            .exec();

        if (!product || product === null) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product found!',
            });
        } else {
            res.render('productEdit', {
                title: 'Product Edit',
                username: res.locals.user,
                productName: product.name,
                productDescription: product.description,
                productCategory: product.category,
                productImage: product.imageFilename,
                productPrice: product.price,
                productStock: product.stock,
                productUrl: product.url,
                categoryList: allCategories,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: error,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }
};

const postEditProduct = async (req, res, next) => {
    // Get all categories for select list
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    // Check if there is an id in the request
    if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: 'No product provided or invalid product!',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // Check if values are provided
    if (
        !req.body.productName ||
        !req.body.productDescription ||
        !req.body.productCategory ||
        !req.body.productPrice ||
        !req.body.productStock
    ) {
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: 'Please provide all values',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // Check if values are empty
    if (
        req.body.productName.trim() === '' ||
        req.body.productDescription.trim() === '' ||
        req.body.productCategory.trim() === '' ||
        req.body.productPrice.trim() === '' ||
        req.body.productStock.trim() === ''
    ) {
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: 'Entered values can not be empty',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    // Check if values are valid
    if (
        !validateName(req.body.productName.trim()) ||
        !validateDescription(req.body.productDescription.trim()) ||
        !validateIsMongoObjectId(req.body.productCategory.trim()) ||
        !validateIsNumber(req.body.productPrice.trim()) ||
        !validateIsNumber(req.body.productStock.trim())
    ) {
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: 'One or more entered values are invalid.',
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productImage: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }

    try {
        const updatedProductDetails = {
            name: trimMultipleWhiteSpaces(req.body.productName),
            description: trimMultipleWhiteSpaces(req.body.productDescription),
            category: trimMultipleWhiteSpaces(req.body.productCategory),
            price: trimMultipleWhiteSpaces(req.body.productPrice),
            stock: trimMultipleWhiteSpaces(req.body.productStock),
        };

        const createdProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedProductDetails,
        );
        res.redirect(`/allProducts/${req.params.id}`);
    } catch (error) {
        console.error(error);

        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: error,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productCategory: req.body.productImage,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: allCategories,
        });
    }
};

const getDeleteProduct = async (req, res) => {
    try {
        // Check if there is an id in the request
        if (!req.params.id) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
            });
        }

        const product = await Product.findById(req.params.id)
            .populate('category')
            .sort({ name: 1 })
            .exec();

        if (!product || product === null) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product found!',
            });
        } else {
            res.render('productDelete', {
                title: 'Product Delete',
                username: res.locals.user,
                productDetails: product,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: error,
            productDetails: '',
        });
    }
};

const postDeleteProduct = async (req, res) => {
    try {
        // Check if there is an id in the request
        if (!req.body.productId) {
            res.render('productDelete', {
                title: 'Product Delete',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
                productDetails: {
                    productId: req.body.productId,
                    productName: req.body.productName,
                    productDescription: req.body.productDescription,
                    productCategory: req.body.productCategory,
                    productPrice: req.body.productPrice,
                    productStock: req.body.productStock,
                },
            });
        }
        const result = await Product.findByIdAndRemove(req.body.productId);
        res.redirect('/allProducts');
    } catch (error) {
        console.error(error);
        res.render('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: error,
            productDetails: '',
        });
    }
};

const getEditProductImage = async (req, res) => {
    try {
        // Check if there is an id for a product in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
            });
        } else {
            const product = await Product.findById(req.params.id)
                .populate('category')
                .sort({ name: 1 })
                .exec();

            if (!product || product === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'No product found!',
                });
            } else {
                res.render('productImageEdit', {
                    title: 'Edit Product Image',
                    username: res.locals.user,
                    productName: product.name,
                    productImage: product.imageFilename,
                    productUrl: product.url,
                });
            }
        }
    } catch (error) {
        res.render('404', {
            title: 'Product Image Edit',
            username: res.locals.user,
            error: error,
        });
    }
};

const postEditProductImage = async (req, res) => {
    try {
        // Check if there is an id for a product in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            res.render('productImageEdit', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No product provided or invalid product!',
                productName: req.body.productName,
                productImage: req.body.imageFilename,
                productUrl: req.body.productUrl,
            });
        }

        // If no file is uploaded, send 'upload file' error
        else if (!req.files || Object.keys(req.files).length === 0) {
            res.render('productImageEdit', {
                title: 'Edit Product Image!',
                username: res.locals.user,
                error: 'No file uploaded! Please upload a file.',
                productName: req.body.productName,
                productImage: req.body.imageFilename,
                productUrl: req.body.productUrl,
            });
        } else {
            let uploadedFile;

            // Upload and replace the old file
            try {
                uploadedFile = req.files.productImage;

                const productNameInDatabase = await fetchProductNameById(
                    req.params.id,
                );

                const newUploadFileName = replaceFileNameSpacesWithHyphen(
                    uploadedFile.name,
                    productNameInDatabase,
                );

                const uploadPath =
                    staticsPath + '/images/products/' + newUploadFileName;

                // Upload the file on the server
                uploadedFile.mv(uploadPath, async function (error) {
                    if (error) {
                        console.log(error);
                        res.render('productImageEdit', {
                            title: 'Edit Product Image',
                            username: res.locals.user,
                            error: error,
                            productName: req.body.productName,
                            productImage: req.body.imageFilename,
                            productUrl: req.body.productUrl,
                        });
                    } else {
                        // Upload filename in the database
                        const newProductDetails = {
                            imageFilename:
                                trimMultipleWhiteSpaces(newUploadFileName),
                        };

                        const updatedProductDetails =
                            await Product.findByIdAndUpdate(
                                req.params.id,
                                newProductDetails,
                            );

                        // Render the page
                        res.redirect(
                            `/allProducts/${req.params.id}/edit/image`,
                        );
                    }
                });
            } catch (error) {
                console.log(error);
                // Delete the uploaded file, if error
                unlink(uploadPath, (error) => {
                    // Delete the file
                    if (error) throw error;
                    console.log(`${uploadedFile.name} file was deleted`);
                });
                res.render('productImageEdit', {
                    title: 'Edit Product Image',
                    username: res.locals.user,
                    error: error,
                    productName: req.body.productName,
                    productImage: req.body.imageFilename,
                    productUrl: req.body.productUrl,
                });
            }
        }
    } catch (error) {
        res.render('productImageEdit', {
            title: 'Product Image Edit',
            username: res.locals.user,
            error: error,
        });
    }
};

export {
    getAllProducts,
    getCreateProduct,
    postCreateProduct,
    getOneProduct,
    getEditProduct,
    postEditProduct,
    getEditProductImage,
    postEditProductImage,
    getDeleteProduct,
    postDeleteProduct,
};
