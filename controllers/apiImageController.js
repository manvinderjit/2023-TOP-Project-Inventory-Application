import { fileURLToPath } from 'url';

const staticsPath = fileURLToPath(new URL('../public', import.meta.url));

const apiGetCarouselImage = async (req, res, next) => {
    if (!req.body.imgUrl) {
        res.sendStatus(404);
    }

    const options = {
        root: staticsPath,
    };

    const imgFileName = `/images/promos/${req.body.imgUrl}`;
    res.sendFile(imgFileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', imgFileName);
        }
    });
};

const apiGetCarouselImageByParams = async (req, res, next) => {
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
};

const apiGetProductImageByParams = async (req, res, next) => {
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

export { apiGetCarouselImage, apiGetCarouselImageByParams, apiGetProductImageByParams };
