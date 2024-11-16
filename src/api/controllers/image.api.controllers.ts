import { Request, Response, NextFunction } from 'express';
import { retrieveFileFromS3, retrieveFileThumbnailFromS3 } from '../../common/services/s3.aws.services.js';
import stream from 'stream';

const allowedImageDirectories = ['promos', 'products', 'guide'];

const apiGetImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (
            !req.params.name || // Check if image name is provided
            !allowedImageDirectories.includes(req.baseUrl.split('/api/')[1]) // Check if the directory path is valid
        ) {
            res.sendStatus(404);
        } else {
            const imgFileName = `images/${req.baseUrl.split('/api/')[1]}/${req.params.name}`;
            
            let data;

            if(req.path?.includes('/thumbs/')) {
                data = await retrieveFileThumbnailFromS3(imgFileName);
            } else data = await retrieveFileFromS3(imgFileName);
            
            const readStream = data.Body as stream.Readable;
            res.setHeader('Content-Type', data.ContentType || 'image/jpeg');
            readStream.pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

export { apiGetImage };
