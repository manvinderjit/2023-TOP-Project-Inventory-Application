import Promo from '../models/promoModel.js'
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import { access, constants, unlink, stat } from 'node:fs';
import { fileURLToPath } from 'url';
import { replaceFileNameSpacesWithHyphen } from '../utilities/fileFormatting.js';
import { validateName, validateDescription } from '../utilities/validation.js';

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
                ? await Promo.find().sort({ name: 1 }).exec()
                : await Promo.find({
                      category: promoCategories[req.body.promoCategory - 1].name,
                  })
                      .sort({ name: 1 })
                      .exec();
        
        if (!allPromos || allPromos.length === 0) {
            res.render('promos', {
                title: 'All Promos',
                username: res.locals.user,
                error: 'No promos found!',
                promoCategoryList: promoCategories,
                selectedPromoCategory: req.body.promoCategory,
            });
        } else {
            res.render('promos', {
                title: 'All Promos',
                username: res.locals.user,
                promosList: allPromos,
                promoCategoryList: promoCategories,
                selectedPromoCategory: req.body.promoCategory,
            });
        }
    } catch (error) {
        console.error(error);
        res.render('promos', {
            title: 'All Promos',
            username: res.locals.user,
            error: error,
            promosList: null,
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
            selectedPromoCategory: null
        });
    } catch (error) {
        console.error(error);
        res.render('promoCreate', {
            title: 'Create a New Promo',
            username: res.locals.user,
            error: error,
            selectedPromoCategory: null,
            promoCategoryList: promoCategories,
        });
    }
};

const postCreatePromo = async (req, res, next) => {
    try {
        let uploadedFile;
        let uploadPath;

        // If no file is uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            res.render('promoCreate', {
                title: 'Create a New Promo',
                username: res.locals.user,
                error: 'No files were uploaded.',
                // TODO: Pass following field values
                promoName: req.body.promoName,
                promoCaption: req.body.promoCaption,
                promoDescription: req.body.promoDescription,
                promoStatus: req.body.promoStatus,
                promoStartDate: req.body.promoStartDate,
                promoEndDate: req.body.promoEndDate,
                selectedPromoCategory: req.body.promoCategory,
                promoCategoryList: promoCategories,
            });
        }

        // TODO: Check if all values are provided
        else if (
            !req.body.promoName ||
            !req.body.promoCaption ||
            !req.body.promoDescription ||
            !req.body.promoCategory ||
            !req.body.promoStatus ||
            !req.body.promoStartDate ||
            !req.body.promoEndDate
        ) {
            res.render('promoCreate', {
                title: 'Create a New Promo',
                username: res.locals.user,
                error: 'Please provide all values!',
                // TODO: Pass following field values
                promoName: req.body.promoName,
                promoCaption: req.body.promoCaption,
                promoDescription: req.body.promoDescription,
                promoStatus: req.body.promoStatus,
                promoStartDate: req.body.promoStartDate,
                promoEndDate: req.body.promoEndDate,
                selectedPromoCategory: req.body.promoCategory,
                promoCategoryList: promoCategories,
            });
        } else {
            
            // TODO: Check if all values are valid

            // The name of the input field (i.e. "promoImage") is used to retrieve the uploaded file
            uploadedFile = req.files.promoImage;
            const newUploadFileName = replaceFileNameSpacesWithHyphen(
                uploadedFile.name,
                req.body.promoName,
            );

            uploadPath = staticsPath + '/images/promos/' + newUploadFileName;

            // Upload files on the server
            uploadedFile.mv(uploadPath, async function (error) {
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
                        promoStatus: req.body.promoStatus,
                        promoStartDate: req.body.promoStartDate,
                        promoEndDate: req.body.promoEndDate,
                        selectedPromoCategory: req.body.promoCategory,
                        promoCategoryList: promoCategories,
                    });
                } else {
                    // Create a promo object from the Promo model
                    const promo = new Promo({
                        name: trimMultipleWhiteSpaces(req.body.promoName),
                        caption: {
                            heading: trimMultipleWhiteSpaces(
                                req.body.promoCaption,
                            ),
                            description: trimMultipleWhiteSpaces(
                                req.body.promoDescription,
                            ),
                        },
                        category: trimMultipleWhiteSpaces(
                            promoCategories[req.body.promoCategory - 1].name,
                        ),
                        imageUrl: `promos/carousel/${newUploadFileName}`,
                        status: trimMultipleWhiteSpaces(req.body.promoStatus),
                        startsOn: trimMultipleWhiteSpaces(
                            req.body.promoStartDate,
                        ),
                        endsOn: trimMultipleWhiteSpaces(req.body.promoEndDate),
                    });

                    let createdPromo;

                    try {
                        // Upload other details on the server
                        createdPromo = await promo.save();
                        if (createdPromo) {
                            // Render the page
                            res.render('promoCreate', {
                                title: 'Create a New Promo',
                                username: res.locals.user,
                                success: 'Promo Created!',
                                // TODO: Pass following field values
                                promoName: '',
                                promoCaption: '',
                                promoDescription: '',
                                promoStatus: '',
                                promoStartDate: '',
                                promoEndDate: '',
                                selectedPromoCategory: null,
                                promoCategoryList: promoCategories,
                            });
                        }
                    } catch (error) {
                        // Delete the uploaded file, if database error
                        unlink(uploadPath, (error) => {
                            // Delete the file
                            if (error) throw error;
                            console.log(
                                `${uploadedFile.name} file was deleted`,
                            );
                        });
                        // Rerender the page
                        res.render('promoCreate', {
                            title: 'Create a New Promo',
                            username: res.locals.user,
                            error: 'An error occured!',
                            // TODO: Pass following field values
                            promoName: req.body.promoName,
                            promoCaption: req.body.promoCaption,
                            promoDescription: req.body.promoDescription,
                            promoStatus: req.body.promoStatus,
                            promoStartDate: req.body.promoStartDate,
                            promoEndDate: req.body.promoEndDate,
                            selectedPromoCategory: req.body.promoCategory,
                            promoCategoryList: promoCategories,
                        });
                    }
                }
            });
        }
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
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    }
};

export { getAllPromos, getCreatePromo, postCreatePromo };
