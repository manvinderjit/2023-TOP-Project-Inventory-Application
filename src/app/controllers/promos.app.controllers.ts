import { NextFunction, Request, Response } from 'express';
import { createPromo, deletePromo, fetchPromoDetails, fetchPromos, getPromoImageName, promoCategories, updatePromo } from '../services/promos.app.services.js';
import { validateDate, validateDescription, validateEnums, validateFieldsMissingOrEmpty, validateFieldValues, validateIsMongoObjectId, validateName } from '../../utilities/validation.js';
import { fileURLToPath } from 'url';
import { replaceFileNameSpacesWithHyphen } from '../../utilities/fileFormatting.js';
import { unlink } from 'node:fs';
import { PathLike } from 'fs';
import { checkImageExists, deleteAppImage } from '../services/image.app.services.js';
import { Types } from 'mongoose';

interface ExpressFileUploadRequest extends Request {
    files: any;
};

const staticsPath = fileURLToPath(new URL('../../public', import.meta.url));

const validatePromoCategory = (categoryValue: string) =>
    validateEnums(['1', '2'], categoryValue);

const validatePromoStatus = (statusValue: string) =>
    validateEnums(['active', 'expired'], statusValue);

const requiredFields = [
    'promoName',
    'promoCaption',
    'promoDescription',
    'promoCategory',
    'promoStatus',
    'promoStartDate',
    'promoEndDate',
];

export const getManagePromos = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch Promos Data
        const dataPromos = await fetchPromos(req.body?.promoCategory);
        // Check if data returned
        if(dataPromos && dataPromos.length > 0){
            // Render the Manage Promos View
            res.render('promos', {
                title: 'Manage Promos',
                username: res.locals.user,
                promosList: dataPromos,
                promoCategoryList: promoCategories,
                selectedPromoCategory: req.body.promoCategory,
            });
        } else{
            throw new Error('No Promos Found!');
        }
    } catch (error) {
        console.error(error);
        res.render('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            error: error,
            promosList: null,
        });
    }
};

export const getPromoDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid promo ID provided');
        } else {
            // Fetch promo details
            const promoDetails = await fetchPromoDetails(req.params.id);
            // If promo details found
            if(promoDetails && promoDetails !== null && promoDetails._id.toString() === req.params.id) {
                res.render('promoView', {
                    title: 'Promo Details',
                    username: res.locals.user,
                    promoDetails: promoDetails,
                });
            }
            else throw new Error('Promo not found!');
        }
    } catch (err) {
        console.error(err);
        res.render('promoView', {
            title: 'Promo Details: Error',
            username: res.locals.user,
            error: err,
        });
    }
};

export const getCreatePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            promoName: '',
            promoCaption: '',
            promoDescription: '',
            promoCategoryList: promoCategories,
            selectedPromoCategory: null,
        });
    } catch (err) {
        console.error(err);
        res.render('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: err,
            selectedPromoCategory: null,
            promoCategoryList: promoCategories,
        });
    }
};

export const postCreatePromo = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        let uploadedFile: { name: string; mv: (arg0: string, arg1: (error: any) => Promise<void>) => void; };
        let uploadPath: PathLike;
        let isError: Error | string | null = null;

        const requiredFieldsAndValidators = [
           { field: 'promoName', validator: validateName, value: req.body.promoName, },
           { field: 'promoCaption' , validator: validateName, value: req.body.promoCaption, },
           { field: 'promoDescription' , validator: validateDescription, value: req.body.promoDescription },
           { field: 'promoCategory' , validator: validatePromoCategory, value: req.body.promoCategory, },
           { field: 'promoStatus' , validator: validatePromoStatus, value: req.body.promoStatus },
           { field: 'promoStartDate' , validator: validateDate, value: req.body.promoStartDate },
           { field: 'promoEndDate', validator: validateDate, value: req.body.promoEndDate, },
        ];

        const reqFiles = (req as ExpressFileUploadRequest).files;
        // If no file is uploaded
        if (!reqFiles || Object.keys(reqFiles).length === 0) throw new Error('No file was uploaded!');
        
        const missingFields: string[] = validateFieldsMissingOrEmpty(
            requiredFields,
            req.body,
        );
        // Check if all required fields are provided and not empty
        if(missingFields.length !== 0) throw new Error(`Please check ${missingFields}`);
        
        const invalidFields: string[] = validateFieldValues(requiredFieldsAndValidators);

        // Validate all the fields and throw error for invalid fields
        if(invalidFields.length !==0 ) throw new Error(`Please check ${invalidFields}`);

        else if(missingFields.length === 0 && invalidFields.length === 0) {
            // Try uploading the image file
            // The name of the input field (i.e. "promoImage") is used to retrieve the uploaded file
            uploadedFile = reqFiles.promoImage;
            
            // Remove spaces from image name
            const newUploadFileName = replaceFileNameSpacesWithHyphen(
                uploadedFile.name,
                req.body.promoName,
            );
            
            // Set upload path
            uploadPath = staticsPath + '/images/promos/' + newUploadFileName;

            // Get all promo details for storing in database
            const promoDetails = req.body;
            promoDetails.newUploadFileName = newUploadFileName;

            // Upload files on the server
            await uploadedFile.mv(uploadPath, async function (err: any) {
                if(err) {
                    console.error(err);
                    isError = err;
                }
                else {
                    // Create Promo
                    const createdPromo = await createPromo(promoDetails);
                    if (createdPromo && createdPromo !== null) {
                        // Render the page
                        res.render('promoCreate', {
                            title: 'Create Promo',
                            username: res.locals.user,
                            success: 'Promo Created!',                            
                            promoName: '',
                            promoCaption: '',
                            promoDescription: '',
                            promoStatus: '',
                            promoStartDate: '',
                            promoEndDate: '',
                            selectedPromoCategory: null,
                            promoCategoryList: promoCategories,
                        });
                    } else {
                        // Delete the uploaded file if error
                        unlink(uploadPath, (err) => {
                            // Delete the file
                            if (err) {
                                console.error(`Failed to delete ${uploadedFile.name} file!`,)
                                // throw error;
                            } else {
                                console.log(
                                    `${uploadedFile.name} file was deleted!`,
                                );
                            }
                        })
                        // Assign promo creation error                        
                        isError = new Error('Promo creation failed!');
                    }
                }
            })
        }
        // If error encountered, throw error
        if (isError !== null) throw isError;

    } catch (err) {
        console.error(err);
        res.render('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: err,
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

export const getEditPromo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid Promo ID provided!');
        } else {
            // Fetch Promo Details
            const promoDetails = await fetchPromoDetails(req.params.id);
            if (
                promoDetails &&
                promoDetails !== null &&
                promoDetails._id.toString() === req.params.id
            ) {                
                res.render('promoEdit', {
                    title: 'Promo Edit',
                    username: res.locals.user,
                    promoUrl: `/promos/${promoDetails._id}`,
                    promoCategoryList: promoCategories,
                    promoDetails,
                });
            } else throw new Error('Promo not found!'); // Otherwise throw error
        };
        
    } catch (error) {
        console.error(error);
        res.render('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: error,            
        });
    }
};

export const postEditPromo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Required fields for Promo
        const requiredFieldsAndValidators = [
            { field: 'promoName', validator: validateName, value: req.body.promoName, },
            { field: 'promoCaption' , validator: validateName, value: req.body.promoCaption, },
            { field: 'promoDescription' , validator: validateDescription, value: req.body.promoDescription },
            { field: 'promoCategory' , validator: validatePromoCategory, value: req.body.promoCategory, },
            { field: 'promoStatus' , validator: validatePromoStatus, value: req.body.promoStatus },
            { field: 'promoStartDate' , validator: validateDate, value: req.body.promoStartDate },
            { field: 'promoEndDate', validator: validateDate, value: req.body.promoEndDate, },
        ];

        // Check if there is a vaild promo id in the request
        if (!req.params.id || !req.body.promoId || req.params.id !== req.body.promoId || !validateIsMongoObjectId(req.body.promoId)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid Promo ID provided!');
        } else {
            // Check if all the fields are provided and non-empty
            const missingFields: string[] = validateFieldsMissingOrEmpty(
                requiredFields,
                req.body,
            );
            // Throw error if fields are missing or empty
            if(missingFields.length !== 0) throw new Error(`Please check ${missingFields}`);
            
            // Check if all the fields are valid
            const invalidFields: string[] = validateFieldValues(requiredFieldsAndValidators);

            // Throw error for invalid fields
            if(invalidFields.length !==0 ) throw new Error(`Please check ${invalidFields}`);

            // If all fields are provided and Valid
            else if(missingFields.length === 0 && invalidFields.length === 0) {
                try {
                    const updatePromoStatus = await updatePromo(req.body.promoId, req.body);                    
                    if(updatePromoStatus && updatePromoStatus._id.toString() === req.body.promoId) 
                        res.redirect(`/promos/${updatePromoStatus._id}`);
                    else throw new Error('Promo Update Failed!');
                } catch (err) {
                    throw err;
                }
            }
        }
    } catch (error) {
        console.error(error);
        if(req.params.id && validateIsMongoObjectId(req.params.id) && req.body.promoId && req.params.id === req.body.promoId ) {
            // Get Promo Data from Request to send back with error
            const promoDataFromRequest = {
                id: req.body?.promoId,
                name: req.body?.promoName,
                caption: {
                    heading: req.body?.promoCaption,
                    description: req.body?.promoDescription,
                },
                status: req.body?.promoStatus,
                startsOn: req.body?.promoStartDate,
                endsOn: req.body?.promoEndDate,
                category: promoCategories[req.body?.promoCategory - 1]?.name,
                imageFilename: req.body?.promoImageName,
            };

            res.render('promoEdit', {
                title: 'Promo Edit',
                username: res.locals.user,
                error: error,
                promoDetails: promoDataFromRequest,
                promoUrl: `/promos/${req.body.promoId}`,
                promoCategoryList: promoCategories,
            });
        } else {
            res.render('promoEdit', {
                title: 'Promo Edit',
                username: res.locals.user,
                error: error,
            });
        }
    }
};

export const getDeletePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid promo ID provided!');
        } else {
            // Fetch promo details
            const promoDetails = await fetchPromoDetails(req.params.id);
            // If promo details
            if(promoDetails && promoDetails !== null && promoDetails._id.toString() === req.params.id) {
                res.render('promoDelete', {
                    title: 'Promo Delete',
                    username: res.locals.user,
                    promoDetails: promoDetails,
                });
            } 
            else throw new Error('Promo not found!'); // Otherwise throw error
        };
    } catch (error) {
        console.error(error);
        // Render error on the page
        res.render('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: error,            
        });
    }
};

export const postDeletePromo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid promo ID provided!');
        } else {
            // Get Promo Image Name for Deletion
            const promoImageName = await getPromoImageName(req.params.id);
            if (promoImageName) {
                let imagePath =
                    staticsPath + '/images/promos/' + promoImageName;
                // Check Image Exists
                const imageExistsFlag = await checkImageExists(imagePath);
                // Delete Image
                if (imageExistsFlag) await deleteAppImage(imagePath);
            };
            
            // Delete Promo from db
            const deleteStatus = await deletePromo(req.params.id);
            if(deleteStatus && deleteStatus._id.toString() === req.params.id) res.redirect('/promos');
            else throw new Error('Deletion Failed!');
        }
    } catch (error) {
        console.error(error);
        // Render error on the page
        res.render('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: error,
        });
    }
};

export const getEditPromoImage = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if there is a vaild promo id in the request
        if (!req.params.id || !validateIsMongoObjectId(req.params.id)) {
            // If no or invalid promo id, throw error
            throw new Error('Invalid promo ID provided!');
        } else {
            // Fetch promo details
            const promoDetails = await fetchPromoDetails(req.params.id);
            // If promo details
            if (
                promoDetails &&
                promoDetails !== null &&
                promoDetails._id.toString() === req.params.id
            ) {
                res.render('promoImageEdit', {
                    title: 'Promo Edit Image',
                    username: res.locals.user,
                    promoData: { 
                        promoName: promoDetails.name,
                        promoImage: promoDetails.imageFilename,
                        promoCaption: promoDetails.caption?.heading,
                        promoDescription: promoDetails.caption?.description,
                        promoUrl: `/promos/${promoDetails._id}`,
                    }
                });
            } else throw new Error('Promo not found!'); // Otherwise throw error
        }
    } catch (error) {
        res.render('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: error,            
        });
    }
};

export const postEditPromoImage = async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Not implemented yet!');
    } catch (error) {
        
    }
};
