import Product from "../../models/productModel.js";
import Category from "../../models/categoryModel.js";

const fetchTotalPagesBasedOnLimit = async(query: any | null | undefined, perPageLimit: number = 6) => {   
    const totalProductCount = await Product.countDocuments(query);
    return Math.ceil(
        totalProductCount / perPageLimit,
    );
};

const fetchProductsService = async (
    page: number | null = 0,
    perPageLimit: number = 6,
    query: any,
) => {
    const fetchedProducts = await Product.find(query)
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

        return fetchedProducts;
};

export { fetchProductsService, fetchTotalPagesBasedOnLimit };
