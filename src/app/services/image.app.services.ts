import fs from 'node:fs/promises';

export const checkImageExists = async (imagePath: string) => {
    return fs.access(imagePath)
        .then(() => true)
        .catch((err) => {
            console.error(`File at ${imagePath} does not exist!`, err);
            return false;
        });
};

export const deleteAppImage = async (imagePath: string) => {
    return fs
        .unlink(imagePath)
        .then(() => true)
        .catch((err) => {
            console.error(`Failed to delete ${imagePath} file!`, err);
            return false;
        });
};
