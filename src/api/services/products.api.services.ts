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
        })
        .sort({ name: 1 })
        .limit(Math.round(Number(perPageLimit)))
        .skip(Math.round(Number(page)) * Math.round(Number(perPageLimit)))
        .populate({ path: 'category', select: 'name ', model: Category })
        .exec();

        return fetchedProducts;
};

const fetchProductCategoriesService = async () => {
    // const dataCategories = await Category.find()
    //     .select('name')
    //     .sort({ name: 1 })
    //     .exec();
    const dataCategories = await Category.aggregate([
        {
            $lookup: {
                from: 'products', // The collection name for products
                localField: '_id', // Field from Category collection
                foreignField: 'category', // Field from Product collection
                as: 'products', // Alias for the joined products array
            },
        },
        {
            $match: {
                products: { $ne: [] }, // Ensure products array is not empty
            },
        },
        // Optional: Project necessary fields (e.g., category name, description)
        {
            $project: {
                name: 1,                
            },
        },
    ]);    
    return dataCategories;
};

export { fetchProductsService, fetchTotalPagesBasedOnLimit, fetchProductCategoriesService };
