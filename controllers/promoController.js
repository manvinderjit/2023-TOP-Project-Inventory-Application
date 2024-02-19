import Promo from '../models/promoModel.js'
import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import { access, constants, unlink, stat } from 'node:fs';
import { fileURLToPath } from 'url';
import { replaceFileNameSpacesWithHyphen } from '../utilities/fileFormatting.js';
import { validateName, validateDescription, validateIsMongoObjectId } from '../utilities/validation.js';
import { fetchPromoNameById } from '../utilities/dataFunctions.js';

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
                        imageFilename: newUploadFileName,
                        status: trimMultipleWhiteSpaces(req.body.promoStatus),
                        startsOn: trimMultipleWhiteSpaces(
                            req.body.promoStartDate,
                        ),
                        endsOn: trimMultipleWhiteSpaces(req.body.promoEndDate),
                    });
                    console.log(promo);

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
                        console.log(error);
                        // Delete the uploaded file, if database error
                        unlink(uploadPath, (error) => {
                            // Delete the file
                            if (error) throw error;
                            console.log(error, 
                                `${uploadedFile.name} file was deleted`,
                            );
                        });
                        // Rerender the page
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

const getEditPromo = async (req, res) => {
    try {
        
        // Check if there is a promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        } else {
            // Fetch promo details from the database
            const promo = await Promo.findById(req.params.id)
                .sort({ name: 1 })
                .exec();
                
            // If promo not found, render 404
            if (!promo || promo === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'Promo was found!',
                });
            } else {
                // Render the Promo Edit page
                res.render('promoEdit', {
                    title: 'Promo Edit',
                    username: res.locals.user,
                    promoName: promo.name,
                    promoCaption: promo.caption.heading,
                    promoDescription: promo.caption.description,
                    promoCategory: promo.category,
                    promoImageName: promo.imageFilename,
                    promoImageUrl: promo.imageUrl,
                    promoStatus: promo.status,
                    promoStartDate: promo.startsOn,
                    promoEndDate: promo.endsOn,
                    promoUrl: promo.url,
                    promoCategoryList: promoCategories,
                });
            }
        }

    } catch (error) {
        console.error(error);
        res.render('404', {
            title: 'Promo Error',
            username: res.locals.user,
            error: error,
            promosList: null,
        });
    }
};

const postEditPromo = async (req, res) => {
    try {
        // Check if there is a promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });

        } else if (
            // Check if all the values are provided and not empty
            !req.body.promoName         || req.body.promoName.trim() === '' ||
            !req.body.promoCaption      || req.body.promoCaption.trim() === '' ||
            !req.body.promoDescription  || req.body.promoDescription.trim() === '' ||
            !req.body.promoCategory     || req.body.promoCategory.trim() === '' ||
            !req.body.promoStatus       || req.body.promoStatus.trim() === '' ||
            !req.body.promoStartDate    || req.body.promoStartDate.trim() === '' ||
            !req.body.promoEndDate      || req.body.promoEndDate.trim() === ''
        ) {
            // TODO: Check if all the values are valid

            // Render the Edit Promo page with errors
            res.render('promoEdit', {
                title: 'Edit Promo',
                username: res.locals.user,
                error: 'Please provide all values!',
                // TODO: Pass following field values
                promoName: req.body.promoName,
                promoCaption: req.body.promoCaption,
                promoDescription: req.body.promoDescription,
                promoCategory: promoCategories[req.body.promoCategory - 1].name,
                promoImageName: req.body.promoImageName,
                promoStatus: req.body.promoStatus,
                promoStartDate: req.body.promoStartDate,
                promoEndDate: req.body.promoEndDate,                
                promoUrl: req.body.promoUrl,
                promoCategoryList: promoCategories,
            });
        } else {
            try {
                // Create a promo object from the Promo model
                const updatePromoDetails = {
                    name: trimMultipleWhiteSpaces(req.body.promoName),
                    caption: {
                        heading: trimMultipleWhiteSpaces(req.body.promoCaption),
                        description: trimMultipleWhiteSpaces(
                            req.body.promoDescription,
                        ),
                    },
                    category: trimMultipleWhiteSpaces(
                        promoCategories[req.body.promoCategory - 1].name,
                    ),                    
                    status: trimMultipleWhiteSpaces(req.body.promoStatus),
                    startsOn: trimMultipleWhiteSpaces(req.body.promoStartDate),
                    endsOn: trimMultipleWhiteSpaces(req.body.promoEndDate),
                };

                const updatePromo = await Promo.findByIdAndUpdate(
                    req.params.id,
                    updatePromoDetails,
                );
                
                // res.redirect(`/promos/${req.params.id}`);
                res.redirect(`/promos`);

            } catch (error) {
                // Render the Edit Promo page with errors
                res.render('promoEdit', {
                    title: 'Edit Promo',
                    username: res.locals.user,
                    error: error,
                    // TODO: Pass following field values
                    promoName: req.body.promoName,
                    promoCaption: req.body.promoCaption,
                    promoDescription: req.body.promoDescription,
                    promoCategory: promoCategories[req.body.promoCategory - 1].name,
                    promoImageName: req.body.promoImageName,
                    promoStatus: req.body.promoStatus,
                    promoStartDate: req.body.promoStartDate,
                    promoEndDate: req.body.promoEndDate,
                    promoUrl: req.body.promoUrl,
                    promoCategoryList: promoCategories,
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.render('404', {
            title: 'Promo Error',
            username: res.locals.user,
            error: error,
            promosList: null,
        });
    }
}

const getViewPromo = async (req, res) => {
    try {
        // Check if there is a promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        } else {
            // Fetch promo details from the database
            const promo = await Promo.findById(req.params.id)
                .sort({ name: 1 })
                .exec();

            if (!promo || promo === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'No promo provided or invalid promo!',
                });
            } else {
                res.render('promoView', {
                    title: 'Promo Details',
                    username: res.locals.user,
                    promoDetails: promo,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.render('404', {
            title: 'Error!',
            username: res.locals.user,
            error: error,
        });
    }
}

const getDeletePromo = async (req, res) => {
    try {
        // Check if there is a promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        } else {
            // Fetch promo details from the database
            const promoDetails = await Promo.findById(req.params.id)                
                .exec();

            if (!promoDetails || promoDetails === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'No promo found or invalid promo!',
                });
            } else {
                res.render('promoDelete', {
                    title: 'Promo Delete',
                    username: res.locals.user,
                    promoDetails: promoDetails,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.render('404', {
            title: 'Error!',
            username: res.locals.user,
            error: error,
        });
    }
}

const postDeletePromo = async (req, res) => {
    try {
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        } else {
            // Delete image

            // Get image name
            const promoDetails = await Promo.findById(req.params.id)
                .select({ imageFilename: 1, _id: 0 })
                .exec();

            let uploadPath = staticsPath + '/images/promos/' + promoDetails.imageFilename;
            // Delete image
            unlink(uploadPath, (error) => {
                // Delete the file
                if (error) throw error;
                console.log(`${promoDetails} file was deleted`);
            });

            const result = await Promo.findByIdAndRemove(req.body.promoId);

            res.redirect('/promos');
        }
    } catch (error) {
        console.log(error);
        res.render('404', {
            title: 'Error!',
            username: res.locals.user,
            error: error,
        });
    }
};

const getEditPromoImage = async (req, res) => {
    try {
        // Check if there is a promo ID provided
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        } else {
            // Get Promo Details
            const promoDetails = await Promo.findById(req.params.id)                
                .exec();     

            if (!promoDetails || promoDetails === null) {
                res.render('404', {
                    title: 'Error: Not Found!',
                    username: res.locals.user,
                    error: 'No promo found or invalid promo!',
                });
            } else {
                res.render('promoImageEdit', {
                    title: 'Promo Edit Image',
                    username: res.locals.user,
                    promoName: promoDetails.name,
                    promoImage: promoDetails.imageFilename,
                    promoCaption: promoDetails.caption.heading,
                    promoDescription: promoDetails.caption.description,                    
                    promoUrl: promoDetails.url,
                });
            }            
        }
    } catch (error) {
        res.render('404', {
            title: 'Error: Not Found!',
            username: res.locals.user,
            error: error,
        });
    }
}

const postEditPromoImage = async (req, res) => {
    try {
        // Check if there is a promo ID provided
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, render 404
            res.render('404', {
                title: 'Error: Not Found!',
                username: res.locals.user,
                error: 'No promo id provided or invalid promo id!',
            });
        }
        // Check if a file was uploaded
        else if (!req.files || Object.keys(req.files).length === 0) {
            // Get Promo Details
            const promoDetails = await Promo.findById(req.params.id).exec();

            res.render('promoImageEdit', {
                title: 'Promo Edit Image',
                username: res.locals.user,
                error: 'No File Uploaded! Pleas upload a file.',
                promoName: promoDetails.name,
                promoImage: promoDetails.imageFilename,
                promoCaption: promoDetails.caption.heading,
                promoDescription: promoDetails.caption.description,
                promoUrl: promoDetails.url,
            });
        } else {
            let uploadedFile;

            // Upload and replace the old file
            try {
                uploadedFile = req.files.promoImage;
                const promoNameInDatabase = await fetchPromoNameById(
                    req.params.id,
                );

                const newUploadFileName = replaceFileNameSpacesWithHyphen(
                    uploadedFile.name,
                    promoNameInDatabase,
                );

                const uploadPath =
                    staticsPath + '/images/promos/' + newUploadFileName;

                // Upload the file on the server
                uploadedFile.mv(uploadPath, async function (error) {
                    if (error) {
                        console.log(error);
                        res.render('promoImageEdit', {
                            title: 'Edit Promo Image',
                            username: res.locals.user,
                            error: error,
                            promoName: req.body.promoName,
                            promoImage: req.body.imageFilename,
                            promoUrl: req.body.promoUrl,
                        });
                    } else {
                        // Upload filename in the database
                        const newPromoDetails = {
                            imageFilename:
                                trimMultipleWhiteSpaces(newUploadFileName),
                        };

                        const updatedPromoDetails =
                            await Promo.findByIdAndUpdate(
                                req.params.id,
                                newPromoDetails,
                            );

                        // Render the page
                        res.redirect(`/promos/${req.params.id}/edit/image`);
                    }
                });
            } catch (error) {
                console.log(error);
                // Delete the uploaded file, if error
                unlink(uploadPath, (error) => {
                    // Delete the file
                    if (error) throw error;
                    console.log(`${uploadedFile.name} file was deleted`);
                });
                res.render('promoImageEdit', {
                    title: 'Edit Promo Image',
                    username: res.locals.user,
                    error: error,
                    promoName: req.body.promoName,
                    promoImage: req.body.imageFilename,
                    promoUrl: req.body.promoUrl,
                });
            }
        }
    } catch (error) {
        res.render('promoImageEdit', {
            title: 'Edit Promo Image',
            username: res.locals.user,
            error: error,            
        });
    }
    
};

export {
    getAllPromos,
    getCreatePromo,
    postCreatePromo,
    getEditPromo,
    postEditPromo,
    getViewPromo,
    getDeletePromo,
    postDeletePromo,
    getEditPromoImage,
    postEditPromoImage
};
