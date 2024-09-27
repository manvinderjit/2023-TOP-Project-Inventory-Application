import { jest } from '@jest/globals';
import { apiGetImage } from '../../../src/api/controllers/image.api.controllers';

describe("get Image", () => {
    const staticsPath =
        '/home/manvinderjit/repos/2023-TOP-Project-Inventory-Application/src/public';

    const allowedImageDirectories = ['promos', 'products', 'guide'];

    // Successfully sends the requested promo image file when valid directory and image name are provided
    it('should send the requested promo image file when valid directory and image name are provided', () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/promos',
        };
        const res: any = {
            sendFile: jest.fn(),
            sendStatus: jest.fn(),
        } as unknown as Response;
        const next: any = jest.fn();

        apiGetImage(req, res, next);

        expect(res.sendFile).toHaveBeenCalledWith(
            '/images/promos/test-image.jpg',
            { root: staticsPath },
            expect.any(Function),
        );
        
        expect(next).not.toHaveBeenCalled();
    });

    // Handles errors when the image file does not exist
    it('should handle errors when the image file does not exist', () => {
        const req: any = {
            params: { name: 'non-existent-image.jpg' },
            baseUrl: '/api/promos',
        };
        const res: any = {
            sendFile: jest.fn((path, options, callback: any) =>
                callback(new Error('File not found')),
            ),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        apiGetImage(req, res, next);

        expect(res.sendFile).toHaveBeenCalledWith(
            '/images/promos/non-existent-image.jpg',
            { root: staticsPath },
            expect.any(Function),
        );
        expect(next).toHaveBeenCalledWith(new Error('File not found'));
    });

    // Returns 404 status when image name is not provided
    it('should return 404 status when image name is not provided', () => {
        const req: any = {
            params: {},
            baseUrl: '/api/promos',
        };
        const res: any = {
            sendFile: jest.fn(),
            sendStatus: jest.fn(),
        };
        const next = jest.fn();

        apiGetImage(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(404);
        expect(res.sendFile).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    // Returns 404 status when directory path is invalid
    it('should return 404 status when directory path is invalid', () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/invalidDirectory',
        };
        const res: any = {
            sendFile: jest.fn(),
            sendStatus: jest.fn(),
        };
        const next = jest.fn();

        apiGetImage(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(404);
        expect(res.sendFile).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    // Logs the image file name upon successful sending
    it('should log the image file name upon successful sending', () => {
        const req: any = {
            params: { name: 'test-image.jpg' },
            baseUrl: '/api/promos',
        };
        const res:any = {
            sendFile: jest.fn((path, options, callback: any) => callback(null)),
            sendStatus: jest.fn(),
        };
        const next = jest.fn();

        jest.spyOn(global.console, 'log');

        apiGetImage(req, res, next);

        expect(res.sendFile).toHaveBeenCalledWith(
            '/images/promos/test-image.jpg',
            { root: staticsPath },
            expect.any(Function),
        );
        expect(console.log).toHaveBeenCalledWith(
            'Sent:',
            '/images/promos/test-image.jpg',
        );
    });
});