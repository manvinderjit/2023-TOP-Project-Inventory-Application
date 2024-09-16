import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
const staticsPath = fileURLToPath(new URL('../../public', import.meta.url));

const apiGetCarouselImage = async (req:Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.name) {
            res.sendStatus(404);
        }

        const options = {
            root: staticsPath,
        };

        const imgFileName = `/images/promos/${req.params.name}`;

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

const apiGetProductImage = async (req:Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.name) {
            res.sendStatus(404);
        } else {
            const options = {
                root: staticsPath,
            };

            const imgFileName = `/images/products/${req.params.name}`;

            res.sendFile(imgFileName, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent:', imgFileName);
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: `Something went wrong!`,
        });
    }
};

export { apiGetCarouselImage, apiGetProductImage };
