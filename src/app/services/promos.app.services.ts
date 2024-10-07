import Promo from "../../models/promoModel.js";
import { validateIsNumber } from "../../utilities/validation.js";

export const promoCategories = [
    {
        id: 1,
        name: 'Carousel',
    },
    {
        id: 2,
        name: 'Others',
    },
];

// Fetches all promos or based on promo category by referring name from provided promoCategory Id
export const fetchPromos = async(promoCategory: string | null | undefined) => {
    let query = {};
    if(promoCategory && validateIsNumber(promoCategory)) {
        query = { category: promoCategories[Number(promoCategory) - 1].name };
    }
    const allPromos = await Promo.find(query).sort({ name: 1 }).exec();
    return allPromos;
};

export const fetchPromoDetails = async (promoId: string) => {
    const dataPromoDetails = await Promo.findById(promoId)
        .sort({ name: 1 })
        .exec();
    return dataPromoDetails;
};
