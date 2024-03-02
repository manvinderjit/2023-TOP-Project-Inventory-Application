import express from 'express';
const cmsRouter = express.Router();
import {
    getUploadGuideImage,
    postUploadGuideImage,
} from '../controllers/cmsController.js';
import fileUpload from 'express-fileupload';

// GET request to upload guide image
cmsRouter.get('/image', getUploadGuideImage);

// GET request to upload guide image
cmsRouter.post('/image', fileUpload(), postUploadGuideImage);

export default cmsRouter;
