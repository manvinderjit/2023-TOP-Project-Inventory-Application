import Promos from '../models/promoModel.js'
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';

const promoCategories = [
    { 
        id: 1,
        name: 'Carousel' 
    }, 
    { 
        id: 2,
        name: 'Others'
    }
];

const getAllPromos = async (req, res, next) => {
    try {
        // TODO: Get all promo categories for the select list
        // const promoCategories = await promoCategory.find().sort({ name: 1 }).exec();

        const allPromos =
            !req.body.promoCategory ||
            req.body.promoCategory.toLowerCase() === 'all'
                ? await Promos.find()
                      .populate({ path: 'category', select: 'name' })
                      .sort({ name: 1 })
                      .exec()
                : await Promos.find({ promoCategory: req.body.promoCategory })
                      .populate('category')
                      .sort({ name: 1 })
                      .exec();

        if (!allPromos || allPromos.length === 0) {
            res.render('promos', {
                title: 'All Promos',
                username: res.locals.user,
                error: 'No promos found!',
                promoCategoryList: promoCategories,
                selectedCategory: req.body.promoCategory,
            });
        } else {
            res.render('promos', {
                title: 'All Promos',
                username: res.locals.user,
                allPromosList: allPromos,
                promoCategoryList: promoCategories,
                selectedCategory: req.body.promoCategory,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('promos', {
            title: 'All Promos',
            username: res.locals.user,
            error: error,
            allPromosList: null,
        });
    }
};

const getCreatePromo = async (req, res, next) => {
    try {
        res.render('promoCreate', {
            title: 'Create a New Promo',
            username: res.locals.user,
            promoName: '',
            promoCaption: '',
            promoDescription: '',
            promoCategoryList: promoCategories,
        });
    } catch (error) {
        console.error(error);
        res.render('promoCreate', {
            title: 'Create a New Promo',
            username: res.locals.user,
            error: error,
            promoCategoryList: promoCategories,
        });
    }
};

export { getAllPromos, getCreatePromo };