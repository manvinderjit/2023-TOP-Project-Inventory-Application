import { trimMultipleWhiteSpaces } from '../utilities/stringFormatting.js';
import { fileURLToPath } from 'url';

const staticsPath = fileURLToPath(new URL('../public', import.meta.url));

const getUploadGuideImage = (req, res) => {
    try {
        res.render('uploadImage', {
            title: 'Upload Images for the Guide',
            username: res.locals.user,
        });
    } catch (error) {
        res.render('404', {
            title: 'Error: Upload Guide Image Error!',
            username: res.locals.user,
            error: error,
        });
    }
};

const postUploadGuideImage = (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            res.render('uploadImage', {
                title: 'Upload Images for the Guide',
                username: res.locals.user,
                error: 'No image uploaded!',
            });
        } else {
            let uploadedFile;
            try {
                uploadedFile = req.files.promoImage;
                const uploadPath =
                    staticsPath + '/images/guide/' + uploadedFile.name;

                // Upload the file on the server
                uploadedFile.mv(uploadPath, async function (error) {
                    if (error) {
                        console.log(error);
                        res.render('uploadImage', {
                            title: 'Upload Images for the Guide',
                            username: res.locals.user,
                            error: error,
                        });
                    } else {
                        res.render('uploadImage', {
                            title: 'Upload Images for the Guide',
                            username: res.locals.user,
                            success: 'File uploaded!',
                        });
                    }
                });
            } catch (error) {
                console.log(error);
                res.render('uploadImage', {
                    title: 'Upload Images for the Guide',
                    username: res.locals.user,
                    error: error,
                });
            }
        }
    } catch (error) {
        res.render('uploadImage', {
            title: 'Upload Images for the Guide',
            username: res.locals.user,
            error: error,
        });
    }
};

export { getUploadGuideImage, postUploadGuideImage };
