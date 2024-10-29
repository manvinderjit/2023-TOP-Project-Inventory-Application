import Product from "../../models/productModel.js";
import { validateIsMongoObjectId } from "../../utilities/validation.js";
import { ProductDetails } from "../../types/types.js";
import { trimMultipleWhiteSpaces } from "../../utilities/stringFormatting.js";
import { Types } from "mongoose";

export const fetchProducts = async (productCategory: string | null | undefined): Promise<ProductDetails[]> => {
    let query = {};

    if(productCategory && validateIsMongoObjectId(productCategory)) {
        query = { category: productCategory };
    }
    const products: ProductDetails[] = await Product.find(query)
        .populate({ path: 'category', select: 'name', })
        .sort({ name: 1 })
        .exec();

    return products;
};

export const fetchProduct = async (productId: string): Promise<ProductDetails | null> => {
    const productDetails: ProductDetails | null = await Product.findById(productId)
        .populate('category')
        .exec();
    return productDetails;
};

export const createProduct = async (productDetails: {
    productName: string;
    productDescription: string;
    newUploadFileName: any;
    productCategory: string;
    productPrice: string;
    productStock: string;
}) => {
    const product: Omit<ProductDetails, '_id'> = {
        name: trimMultipleWhiteSpaces(productDetails.productName),
        description: trimMultipleWhiteSpaces(productDetails.productDescription),
        imageFilename: productDetails.newUploadFileName,
        category: trimMultipleWhiteSpaces(
            productDetails.productCategory,
        ) as unknown as Types.ObjectId,
        price: Number(trimMultipleWhiteSpaces(productDetails.productPrice)),
        stock: Number(trimMultipleWhiteSpaces(productDetails.productStock)),
    };

    const createdProduct = await Product.create(product);
    return createdProduct;
};

export const updateProduct = async (productId: string, productData: { productName: string; productDescription: string; productCategory: string; productPrice: string; productStock: string; }) => {

    const updatedProductDetails = {
        name: trimMultipleWhiteSpaces(productData.productName),
        description: trimMultipleWhiteSpaces(productData.productDescription),
        category: trimMultipleWhiteSpaces(productData.productCategory),
        price: trimMultipleWhiteSpaces(productData.productPrice),
        stock: trimMultipleWhiteSpaces(productData.productStock),
    };

    const updatedProductData = await Product.findByIdAndUpdate(
        productId,
        updatedProductDetails,
    );
    return updatedProductData;
};
