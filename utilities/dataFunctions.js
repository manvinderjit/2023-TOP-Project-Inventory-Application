import Product from "../models/productModel.js";

const fetchProductNameById = async (productId) => {
    const productDetails = await Product.findById(productId)
        .select({ name: 1 })
        .exec();
    return productDetails.name;
};

export { fetchProductNameById };
