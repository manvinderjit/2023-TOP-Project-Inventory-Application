import { jest } from '@jest/globals';
import { apiGetImage } from '../../src/api/controllers/image.api.controllers';
import { retrieveFileFromS3 } from '../../src/common/services/s3.aws.services';
import '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@smithy/util-stream';

const s3Mock = mockClient(S3Client);

describe("get Image", () => {
    it('should retrieve file from s3 succefully', async () => {
        // create Stream from string
        const stream = new Readable();
        stream.push('hello world');
        stream.push(null); // end of stream

        // wrap the Stream with SDK mixin
        const sdkStream = sdkStreamMixin(stream);

        s3Mock.on(GetObjectCommand).resolves({ Body: sdkStream });
        const mockFileKey = 'valid-file-key';

        const result = await retrieveFileFromS3(mockFileKey);

        expect(result).toEqual({ Body: sdkStream });
    });

    // Successfully sends the requested promo image file when valid directory and image name are provided
    it('should fetch the requested promo image file from s3 and send as a stream when a valid image key (name) is provided', async () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/promos',
        };

        const res: any = {
            sendStatus: jest.fn(),
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        const next: any = jest.fn();

        // create Stream from string
        const stream = new Readable();
        stream._read = () => {};
        stream.pipe = jest.fn() as any;
        stream.push('hello world');
        stream.push(null); // end of stream

        // wrap the Stream with SDK mixin
        const sdkStream = sdkStreamMixin(stream);

        s3Mock
            .on(GetObjectCommand)
            .resolves({ Body: sdkStream, ContentType: 'image/jpeg' });

        await apiGetImage(req, res, next);

        expect(stream.pipe).toHaveBeenCalled();
        expect(stream.pipe).toHaveBeenCalledWith(res);
        expect(res.setHeader).toHaveBeenCalledWith(
            'Content-Type',
            'image/jpeg',
        );
        expect(next).not.toHaveBeenCalled();
    });

    // Successfully sends the requested promo image file when valid directory and image name are provided
    it('should fetch the requested promo image file from s3 and send as a stream with the default ContentType if it is not provided', async () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/promos',
        };

        const res: any = {
            sendStatus: jest.fn(),
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        const next: any = jest.fn();

        // create Stream from string
        const stream = new Readable();
        stream._read = () => {};
        stream.pipe = jest.fn() as any;
        stream.push('hello world');
        stream.push(null); // end of stream

        // wrap the Stream with SDK mixin
        const sdkStream = sdkStreamMixin(stream);

        s3Mock
            .on(GetObjectCommand)
            .resolves({ Body: sdkStream });

        await apiGetImage(req, res, next);

        expect(stream.pipe).toHaveBeenCalled();
        expect(stream.pipe).toHaveBeenCalledWith(res);
        expect(res.setHeader).toHaveBeenCalledWith(
            'Content-Type',
            'image/jpeg',
        );
        expect(next).not.toHaveBeenCalled();
    });

    // // Handles errors when the image file does not exist
    it('should handle errors gracefully when the image file key does not exists in the s3 bucket', async () => {
        const req: any = {
            params: { name: 'non-existent-image.jpg' },
            baseUrl: '/api/promos',
        };
        const res: any = {
            sendStatus: jest.fn(),
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        s3Mock.on(GetObjectCommand).rejects();

        await apiGetImage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: 'Something went wrong!',
        });
    });

    // Returns 404 status when image name is not provided
    it('should return 404 status when image name is not provided', async () => {
        const req: any = {
            params: {},
            baseUrl: '/api/promos',
        };
        const res: any = {
            sendStatus: jest.fn(),
            setHeader: jest.fn(),
        };
        const next = jest.fn();

        await apiGetImage(req, res, next);

        expect(res.setHeader).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(404);
        expect(next).not.toHaveBeenCalled();
    });

    // Returns 404 status when directory path is invalid
    it('should return 404 status when the directory path is invalid', async () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/invalidDirectory',
        };
        const res: any = {
            setHeader: jest.fn(),
            sendStatus: jest.fn(),
        };
        const next = jest.fn();

        await apiGetImage(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(404);
        expect(res.setHeader).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});
