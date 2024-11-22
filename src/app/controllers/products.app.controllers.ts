import { NextFunction, Request, Response } from 'express';
import { fetchCategories } from '../services/category.app.services.js';
import { createProduct, deleteProductById, fetchProduct, fetchProducts, updateProduct } from '../services/products.app.services.js';
import { CategoryDetailsDocument, ProductDetails } from '../../types/types.js';
import { validateDescription, validateIsMongoObjectId, validateIsNumber, validateName, validateRequiredFieldsInBody } from '../../utilities/validation.js';
import { PathLike  } from 'node:fs';
import { replaceFileNameSpacesWithHyphen } from '../../utilities/fileFormatting.js';
import { fileURLToPath } from 'node:url';
import { deleteFileFromS3, uploadFileToS3 } from '../../common/services/s3.aws.services.js';
import { publishNewProduct } from '../../common/services/sns.aws.services.js';

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
            data: any;
            mimetype: string;
            name: string;
        };
        
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

            // Replaces spaces from image name with '-' and add a timestamp for uniqueness
            const newUploadFileName = replaceFileNameSpacesWithHyphen(
                uploadedFile.name,
                req.body.productName + Date.now(),
            );

            // Get all promo details for storing in database
            const productDetails = req.body;
            productDetails.newUploadFileName = newUploadFileName;

            await uploadFileToS3(`images/products/${newUploadFileName}`, uploadedFile.data, uploadedFile.mimetype)
            .then(async (success) => {
                if (success) {
                    // Create Product
                    const createdProduct = await createProduct(productDetails);
                    if (createdProduct && createdProduct !== null) {

                        publishNewProduct(`We have added a new product ${createdProduct.name}. Check out now!`);

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
                    }
                    else {
                        // Delete the uploaded file if error
                        await deleteFileFromS3(
                            `images/products/${newUploadFileName}`,
                        ).then((success) => {
                            if (success) {
                                console.log('File deleted successfully!');
                            } else {
                                console.error(
                                    `Failed deleting file with key: images/products/${newUploadFileName}`,
                                );
                            }
                        });
                        // Throw product creation error
                        isError = 'Product creation failed!';
                    }
                } else {
                    isError = 'Failed to upload file!';
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
            // Render product view
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
            } else { // If product not found, throw error
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

export const postEditProduct = async (req: Request, res: Response): Promise<void> => {
    // Get all categories for selecting products based on categories
    const productCategories: CategoryDetailsDocument[] = await fetchCategories();

    try {
        // Validate product Id in request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {
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

            // Check missing or invalid fields
            const invalidFields: string[] = validateRequiredFieldsInBody(
                requiredFieldsAndValidators,
                req.body,
            );

            // If invalid fields
            if (invalidFields.length !== 0)
                throw new Error(`Please check ${invalidFields}`);

            else if (invalidFields.length === 0) {
                const newProductData = {
                    productName: req.body.productName,
                    productDescription: req.body.productDescription,
                    productCategory: req.body.productCategory,
                    productPrice: req.body.productPrice,
                    productStock: req.body.productStock,
                };

                // Try updating product details
                const updatedProductData = await updateProduct(req.params.id, newProductData);

                if(updatedProductData && String(updatedProductData._id) === req.params.id) res.redirect(`/products/${req.params.id}`);

                else throw new Error('Product update failed!');
            };
        }

        // Validate fields
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

export const getEditProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {
            // Get the product details
            const productDetails: ProductDetails | null = await fetchProduct(
                req.params.id,
            );
            // If product found
            if (productDetails && String(productDetails._id) === req.params.id){
                res.render('productImageEdit', {
                    title: 'Product Image Edit',
                    username: res.locals.user,
                    productData: {
                        productName: productDetails.name,
                        productImage: productDetails.imageFilename,
                        productUrl: `/products/${productDetails._id}`,
                    },
                });
            } 
            // Throw error if product not found
            else throw new Error('Product not found!'); 
        }
    } catch (error) {
        res.render('productImageEdit', {
            title: 'Product Image Edit',
            username: res.locals.user,
            error: error,
        });
    }
};

export const postEditProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {
            // If no file was uploaded throw error
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new Error('No file was uploaded!');
            }
            // If a file was uploaded
            else {
                // Try uploading the image file
                // The name of the input field (i.e. "productImage") is used to retrieve the uploaded file
                const reqFiles = (req as ExpressFileUploadRequest).files;
                const uploadedFile = reqFiles.productImage;
                
                const productDetails = await fetchProduct(req.params.id);

                if (!productDetails) throw new Error('File upload failed!');

                await uploadFileToS3(
                    `images/products/${productDetails.imageFilename}`,
                    uploadedFile.data,
                    uploadedFile.mimetype,
                )
                .then((success) => {
                    if (success) {
                        res.redirect(`/products/${req.params.id}/edit/image`);
                    } else {                        
                        throw new Error('File upload failed!');                        
                    }
                });
            }
        }
    } catch (error) {
        res.render('productImageEdit', {
            title: 'Product Image Edit',
            username: res.locals.user,
            error: error,
            productData: {
                productName: req.body.productName,
                productImage: req.body.currProductImage,
                productUrl: `/products/${req.params.id}`,
            },
        });
    }
};

export const getDeleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate product Id in request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {
            // Get the product details
            const productDetails: ProductDetails | null = await fetchProduct(
                req.params.id,
            );

            if (
                productDetails &&
                String(productDetails._id) === req.params.id
            ) {
                res.render('productDelete', {
                    title: 'Product Delete',
                    username: res.locals.user,
                    productDetails: productDetails,
                });
            } else throw new Error ('Product not found!')
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

export const postDeleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate product Id in request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid product id, throw error
            throw new Error('Product not found!');
        } else {            
            const deleteStatus = await deleteProductById(req.params.id);
            if(deleteStatus && String(deleteStatus._id) === req.params.id) {
                // Delete the uploaded file
                await deleteFileFromS3(
                    `images/products/${deleteStatus.imageFilename}`,
                ).then((success) => {
                    if (success) {
                        console.log('File deleted successfully!');
                    } else {
                        console.error(
                            `Failed deleting file with key: images/products/${deleteStatus.imageFilename}`,
                        );
                    }
                });
                    
                res.redirect('/products');
            }
            else throw new Error('Deletion failed!');
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
