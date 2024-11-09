import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    },
});

const bucketName = process.env['S3_BUCKET_NAME'];

export const uploadFileToS3 = async (fileKey: string, fileBody: any, fileType: string) => {
    const uploadStatus = await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: fileBody,
            ContentType: fileType,
        }),
    );
    return uploadStatus;
};

export const retrieveFileFromS3 = async (fileKey: string | undefined) => {
    const retrievedFile = await s3Client.send(
        new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        }),
    );  
    return retrievedFile;
};

export const deleteFileFromS3 = async (fileKey: string | undefined) => {
    const deleteStatus = await s3Client.send(
        new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey }),
    );
    return deleteStatus;
};
