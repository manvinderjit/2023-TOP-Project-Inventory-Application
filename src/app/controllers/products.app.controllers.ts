import { NextFunction, Request, Response } from 'express';
import { fetchCategories } from '../services/category.app.services.js';
import { createProduct, fetchProduct, fetchProducts } from '../services/products.app.services.js';
import { CategoryDetailsDocument, ProductDetails } from '../../types/types.js';
import { validateDescription, validateIsMongoObjectId, validateIsNumber, validateName, validateRequiredFieldsInBody } from '../../utilities/validation.js';
import { PathLike, unlink } from 'node:fs';
import { replaceFileNameSpacesWithHyphen } from '../../utilities/fileFormatting.js';
import { fileURLToPath } from 'node:url';

const staticsPath = fileURLToPath(new URL('../../public', import.meta.url));

interface ExpressFileUploadRequest extends Request {
    files: any;
};

export const getManageProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all categories for selecting products based on categories
        const productCategories: CategoryDetailsDocument[] = await fetchCategories();

        // Validate product category if provided and throw error if invalid
        if(req.body?.productCategory && !validateIsMongoObjectId(req.body.productCategory)) throw new Error('No products found!');

        // Fetch products 
        const dataProducts: ProductDetails[] = await fetchProducts(req.body?.productCategory);

        if(dataProducts && dataProducts.length > 0 ) {
            res.render('products', {
                title: 'All Products',
                username: res.locals.user,
                allProductsList: dataProducts,
                categoryList: productCategories,
                selectedCategory: req.body.productCategory,
            });
        } else {            
            throw new Error('No products found!');        
        }        
    } catch (error) {
        console.error(error);
        res.render('products', {
            title: 'All Products',
            username: res.locals.user,
            error: error,            
            selectedCategory: req.body.productCategory,
        });
    };
};

export const getProductDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for a product id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            throw new Error('Product not found!');
        } else {
            // Get the product details
            const productDetails: ProductDetails | null = await fetchProduct(req.params.id);

            if(productDetails && String(productDetails._id) === req.params.id) {
                res.render('productView', {
                    title: 'Product Details',
                    username: res.locals.user,
                    productDetails: productDetails,
                });
                
            } else { // If product not found
                throw new Error('Product not found!');
            };
        };  
    } catch (error) {
        res.render('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: error,
        });
    };
};

export const getCreateProducts = async (req: Request, res: Response) => {
    // Get all categories for selecting products based on categories
    const productCategories: CategoryDetailsDocument[] = await fetchCategories();

    try {
        res.render('productCreate', {
            username: res.locals.user,
            title: 'Create Product',            
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: 0.0,
            productStock: 0,
            categoryList: productCategories,
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
            categoryList: productCategories,
        });
    };
};

export const postCreateProduct = async (req: Request, res: Response): Promise<void> => {
    // Get all categories for selecting products based on categories
    const productCategories: CategoryDetailsDocument[] = await fetchCategories();

    try {
        let uploadedFile: {
            name: string;
            mv: (arg0: string, arg1: (error: any) => Promise<void>) => void;
        };
        let uploadPath: PathLike;
        let isError: Error | string | null = null;

        const requiredFieldsAndValidators = [
            {
                field: 'productName',
                validator: validateName,
                value: req.body.productName,
                label: 'Product Name',
            },
            {
                field: 'productDescription',
                validator: validateDescription,
                value: req.body.productDescription,
                label: 'Product Description',
            },
            {
                field: 'productCategory',
                validator: validateIsMongoObjectId,
                value: req.body.productCategory,
                label: 'Product Category',
            },
            {
                field: 'productPrice',
                validator: validateIsNumber,
                value: req.body.productPrice,
                label: 'Product Price',
            },
            {
                field: 'productStock',
                validator: validateIsNumber,
                value: req.body.productStock,
                label: 'Product Stock',
            },
        ];

        const reqFiles = (req as ExpressFileUploadRequest).files;
        // If no file is uploaded
        if (!reqFiles || Object.keys(reqFiles).length === 0)
            throw new Error('No file was uploaded!');

        // Check missing or invalid fields
        const invalidFields: string[] = validateRequiredFieldsInBody(
            requiredFieldsAndValidators,
            req.body,
        );

        // If invalid fields
        if (invalidFields.length !== 0)
            throw new Error(`Please check ${invalidFields}`);
        else if (invalidFields.length === 0) {
            // Try uploading the image file
            // The name of the input field (i.e. "productImage") is used to retrieve the uploaded file
            uploadedFile = reqFiles.productImage;

            // Remove spaces from image name
            const newUploadFileName = replaceFileNameSpacesWithHyphen(
                uploadedFile.name,
                req.body.productName + Date.now(),
            );

            // Set upload path
            uploadPath = staticsPath + '/images/products/' + newUploadFileName;

            // Get all promo details for storing in database
            const productDetails = req.body;
            productDetails.newUploadFileName = newUploadFileName;

            // Upload files on the server
            await uploadedFile.mv(uploadPath, async function (err: any) {
                if (err) {
                    console.error(err);
                    isError = err;
                    // throw err;
                } else {
                    // Create Product
                    const createdProduct = await createProduct(productDetails);
                    if (createdProduct && createdProduct !== null) {
                        // Render the page
                        res.render('productCreate', {
                            title: 'Create Product',
                            username: res.locals.user,
                            success: `Product created with name ${createdProduct.name}`,
                            productName: '',
                            productDescription: '',
                            productCategory: '',
                            productPrice: '',
                            productStock: '',
                            categoryList: productCategories,
                        });
                    } else {
                        // Delete the uploaded file if error
                        unlink(uploadPath, (err) => {
                            // Delete the file
                            if (err) {
                                console.error(
                                    `Failed to delete ${uploadedFile.name} file!`,
                                );
                                // throw error;
                            } else {
                                console.log(
                                    `${uploadedFile.name} file was deleted!`,
                                );
                            }
                        });
                        // Throw product creation error
                        isError = new Error('Product creation failed!');
                    }
                }
            });
        }
        // If error encountered, throw error
        if (isError !== null) throw isError;
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
            categoryList: productCategories,
        }
    )};
};

export const getEditProduct = async (req: Request, res: Response): Promise<void> => {
    // Get all categories for selecting products based on categories
    const productCategories: CategoryDetailsDocument[] = await fetchCategories();
    
    try {
        // Validate product Id in request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {
            // Fetch product details            
            const productDetails: ProductDetails | null = await fetchProduct(req.params.id);

            if(productDetails && String(productDetails._id) === req.params.id) {
                res.render('productEdit', {
                    title: 'Product Edit',
                    username: res.locals.user,
                    productDetails: {
                        productName: productDetails.name,
                        productDescription: productDetails.description,
                        productCategory: productDetails.category,
                        productImage: productDetails.imageFilename,
                        productPrice: productDetails.price,
                        productStock: productDetails.stock,
                        productUrl: `/products/${productDetails._id}`,
                    },
                    categoryList: productCategories,
                });
            } else {
                throw new Error('Product not found!');
            };
        }

    } catch (error) {
        console.error(error);
        res.render('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: error,            
            productUrl: req.body.productUrl,
            categoryList: productCategories,
        });
    };
};

export const postEditProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getEditProductImage = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postEditProductImage = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const getDeleteProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};

export const postDeleteProduct = (req: Request, res: Response) => {
    res.send('Not implemented yet');
};
