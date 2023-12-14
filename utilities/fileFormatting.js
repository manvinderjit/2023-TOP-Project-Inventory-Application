import path from 'node:path';

const replaceFileNameSpacesWithHyphen = (uploadedFileName, newFileName) => {
    const uploadedFileExtension = path.extname(uploadedFileName);
    const newUploadFileName =
        newFileName.toLowerCase().trim().replace(/\s+/g, '-') +
        uploadedFileExtension;
    
    return newUploadFileName;
};

export { replaceFileNameSpacesWithHyphen };
