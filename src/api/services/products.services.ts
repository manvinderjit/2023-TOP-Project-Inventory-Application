import Product from "../../models/productModel.js";
import Category from "../../models/categoryModel.js";
import { validateQuery } from "../../utilities/validation.js";

const fetchProducts = async (
    page: number | null = 0,
    perPageLimit: number = 6,
    categoryQuery: string | null | undefined,
    textQuery: string | null | undefined,
) => {
    
    let query = {};

    if (validateQuery(categoryQuery) && !validateQuery(textQuery)) {
        query = { category: { _id: categoryQuery } };
    } else if (!validateQuery(categoryQuery) && validateQuery(textQuery)) {
        query = { $text: { $search: textQuery } };
    } else if (validateQuery(categoryQuery) && validateQuery(textQuery)) {
        query = {
            category: { _id: categoryQuery },
            $text: { $search: textQuery },
        };
    }

    try {
        const totalProductCount = await Product.countDocuments(query);
        let totalPagesBasedOnLimit = Math.ceil(
            totalProductCount / perPageLimit,
        );

        const allProducts = await Product.find(query)
            .select({
                name: 1,
                description: 1,
                imageFilename: 1,
                price: 1,
                stock: 1,
                _id: 0,
            })
            .sort({ name: 1 })
            .limit(Math.round(Number(perPageLimit)))
            .skip(Math.round(Number(page)) * Math.round(Number(perPageLimit)))
            .populate({ path: 'category', select: 'name ', model: Category })
            .exec();

        // If no products
        if (!allProducts || allProducts.length === 0) {
            return {
                error: 'No Products to Show!',
                productList: null,
            };
        }
        // If products
        else {
            return {
                error: null,
                productList: allProducts,
                totalPagesBasedOnLimit,
            };
        }
    } catch (error) {
        // if Error
        console.error(error);
        return {
            error,
            productList: null,
        };
    }
};

export { fetchProducts };
