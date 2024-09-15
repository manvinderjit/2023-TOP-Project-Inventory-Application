import Product from "../../app/models/productModel.js";
import Category from "../../app/models/categoryModel.js";

const fetchProducts = async(page:number | null = 0, perPageLimit:number = 6) => {
    
    // Flag to check if there is a next page
    let hasNextPage = false; 

    try {
        const allProducts = await Product.find()
            .select({
                name: 1,
                description: 1,
                imageFilename: 1,
                price: 1,
                stock: 1,
                _id: 0,
            })
            .sort({ name: 1 })
            .limit(Math.round(Number(perPageLimit)) + 1)
            .skip(Math.round(Number(page)) * Math.round(Number(perPageLimit)))
            .populate({ path: 'category', select: 'name ', model: Category })
            .exec();
        
        // If returned result length is greater than page limit => there is a next page (more results)
        if(allProducts.length > perPageLimit) {
            hasNextPage = true;
            // Remove the unrequired last result
            allProducts.pop();
        } 
        
        // If no products
        if (!allProducts || allProducts.length === 0) {
            return {
                error: 'No Products to Show!',
                productList: null,
                hasNextPage,
            };
        }
        // If products
        else {
            return {
                error: null,
                productList: allProducts,
                hasNextPage,
            };
        }
    } catch (error) { // if Error
        console.error(error);
        return {
            error,
            productList: null,
            hasNextPage,
        };
        
    }
};

export { fetchProducts };
