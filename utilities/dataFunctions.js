import Product from '../models/productModel.js';
import Promo from '../models/promoModel.js';

const fetchProductNameById = async (productId) => {
    const productDetails = await Product.findById(productId)
        .select({ name: 1 })
        .exec();
    return productDetails.name;
};

const fetchPromoNameById = async (promoId) => {
    const promoDetails = await Promo.findById(promoId)
        .select({ name: 1 })
        .exec();
    return promoDetails.name;
};

export { fetchProductNameById, fetchPromoNameById };
