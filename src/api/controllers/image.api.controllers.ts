import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
const staticsPath = fileURLToPath(new URL('../../public', import.meta.url));

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
        }

        const options = {
            root: staticsPath,
        };

        const imgFileName = `/images/${req.baseUrl.split('/api/')[1]}/${req.params.name}`;

        res.sendFile(imgFileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', imgFileName);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

export { apiGetImage };
