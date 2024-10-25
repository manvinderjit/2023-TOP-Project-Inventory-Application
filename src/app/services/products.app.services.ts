import Product from "../../models/productModel.js";
import { validateIsMongoObjectId } from "../../utilities/validation.js";
import { ProductDetails } from "../../types/types.js";

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
