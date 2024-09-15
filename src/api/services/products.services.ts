import Product from "../../app/models/productModel.js";
import Category from "../../app/models/categoryModel.js";

const fetchProducts = async(page:number = 1, limit:number = 9) => {
    
    try {
        const allProducts = await Product.find()
            .limit(limit)
            // .select(
            //     {
            //         name: 1,
            //         description: 1,
            //         imageFilename: 1,
            //         price: 1,
            //         stock: 1,
            //         // _id: 0,
            //     },                
            // )
            .populate({ path: 'category', select: 'name ', model: Category })
            .sort({ name: 1 })
            .exec();

        if (!allProducts || allProducts.length === 0) {
            return {
                error: 'No Products to Show!',
                products: null,
            };
        }
        else {
            return {
                error: null,
                products: allProducts,
            }
        }
    } catch (error) {
        console.error(error);
        return {
            error, products: null
        }
        
    }
};

export { fetchProducts };
