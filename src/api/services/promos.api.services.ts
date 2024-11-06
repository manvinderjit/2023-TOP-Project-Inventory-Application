import Promo from '../../models/promoModel.js';

const fetchCarouselPromos = async () => {
    const carouselPromos = await Promo.find({
        category: 'Carousel',
        status: 'Active',
    })
    .sort({ name: 1 })
    .select({ _id: 0, name: 1, caption: 1, category: 1, imageUrl: 1 })
    .exec();

    return carouselPromos;
};

export { fetchCarouselPromos };
