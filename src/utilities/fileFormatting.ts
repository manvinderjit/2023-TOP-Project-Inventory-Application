import path from 'node:path';

const replaceFileNameSpacesWithHyphen = (uploadedFileName: string, newFileName: string) => {
    const uploadedFileExtension = path.extname(uploadedFileName);
    const newUploadFileName =
        newFileName.toLowerCase().trim().replace(/\s+/g, '-') +
        uploadedFileExtension;

    return newUploadFileName;
};

export { replaceFileNameSpacesWithHyphen };
