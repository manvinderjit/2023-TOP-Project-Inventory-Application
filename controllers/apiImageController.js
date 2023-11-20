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

export { apiGetCarouselImage };
