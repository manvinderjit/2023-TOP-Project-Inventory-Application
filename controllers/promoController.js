import Promos from '../models/promoModel.js'
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import { access, constants, unlink, stat } from 'node:fs';

import { fileURLToPath } from 'url';
const staticsPath = fileURLToPath(new URL('../public', import.meta.url));

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

const postCreatePromo = async (req, res, next) => {
    try {
        let uploadedFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            res.render('promoCreate', {
                title: 'Create a New Promo',
                username: res.locals.user,
                error: 'No files were uploaded.',
                // TODO: Pass following field values
                promoName: req.body.promoName,
                promoCaption: req.body.promoCaption,
                promoDescription: req.body.promoDescription,
                promoCategoryList: promoCategories,
            });
        }

        // The name of the input field (i.e. "promoImage") is used to retrieve the uploaded file
        uploadedFile = req.files.promoImage;
        uploadPath = staticsPath + '/images/promos/' + uploadedFile.name;

        stat(uploadPath, (error, stats) => {
            
            if (!error && stats.isFile()) {
                // If a file with the same name exists in the path defined
                // unlink(uploadPath, (error) => {
                //    // Delete the file
                //     if (error) throw error;
                //     console.log('file was deleted');
                // });
            } else if (error && error.code == 'ENOENT') {
                // If the file does not exist
                // return;
            } else {
                // Other file error
                res.render('promoCreate', {
                    title: 'Create a New Promo',
                    username: res.locals.user,
                    error: error,
                    // TODO: Pass following field values
                    promoName: req.body.promoName,
                    promoCaption: req.body.promoCaption,
                    promoDescription: req.body.promoDescription,
                    promoCategoryList: promoCategories,
                });
            }
        });

        // Use the mv() method to place the file somewhere on your server
        uploadedFile.mv(uploadPath, function (error) {
            if (error) {
                console.log('e', error);
                res.render('promoCreate', {
                    title: 'Create a New Promo',
                    username: res.locals.user,
                    error: error,
                    // TODO: Pass following field values
                    promoName: req.body.promoName,
                    promoCaption: req.body.promoCaption,
                    promoDescription: req.body.promoDescription,
                    promoCategoryList: promoCategories,
                });
            } else {
                res.render('promoCreate', {
                    title: 'Create a New Promo',
                    username: res.locals.user,
                    success: 'File uploaded.',
                    // TODO: Pass following field values
                    promoName: '',
                    promoCaption: '',
                    promoDescription: '',
                    promoCategoryList: promoCategories,
                });
            }

            
        });
    } catch (error) {
        console.error(error);
        res.render('promoCreate', {
            title: 'Create a New Promo',
            username: res.locals.user,
            error: error,
            // TODO: Pass following field values
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoCategoryList: promoCategories,
        });
    }
};

export { getAllPromos, getCreatePromo, postCreatePromo };