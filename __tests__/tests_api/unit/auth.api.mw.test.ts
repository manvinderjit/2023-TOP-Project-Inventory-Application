import { jest } from '@jest/globals';
import { verifyApiToken } from '../../../src/api/api.middleware/auth.api.middleware';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

describe("validate API JWT Token", () => {
    it('should set req userId and username and proceed to next middleware when JWT token is valid', async () => {

        const secretKey = process.env['JWT_SECRET'] as string;
        const payload = { id: '123', username: 'testUser' };        
        const token = jwt.sign(payload, secretKey, { expiresIn: '5m' });

        const req: any = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const res: any = {};
        const next: any = jest.fn();

        // (jwt.verify as jest.Mock) = jest.fn().mockReturnValue(decodedToken);

        await verifyApiToken(req, res, next);

        expect(req.userId).toBe(payload.id);
        expect(req.username).toBe(payload.username);
        expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when no authorization header is provided', async () => {
        const req: any = {
            headers: {},
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when authorization header is empty', async () => {
        const req: any = {
            headers: {
                authorization: '',
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when authorization header does not start with Bearer', async () => {
        
        const secretKey = process.env['JWT_SECRET'] as string;
        const payload = { id: '123', username: 'testUser' };
        const token = jwt.sign(payload, secretKey, { expiresIn: '5m' });

        const req: any = {
            headers: {
                authorization: `Tearer ${token}`,
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when authorization header does not contain a token', async () => {
        
        const req: any = {
            headers: {
                authorization: `Bearer`,
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when the token is expired', async () => {

        const secretKey = process.env['JWT_SECRET'] as string;
        const payload = { id: '123', username: 'testUser' };
        const token = jwt.sign(payload, secretKey, { expiresIn: '-10' });
        
        const req: any = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when an unknown error occurs during token verification', async () => {

        const secretKey = process.env['JWT_SECRET'] as string;
        const payload = { id: '123', username: 'testUser' };
        const token = jwt.sign(payload, secretKey, { expiresIn: '-10' });
        
        const req: any = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (jwt.verify as jest.Mock) = jest.fn().mockImplementation(() => { throw new Error('Error')});

        await verifyApiToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to do that!'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully and render error messages when an unknown error occurs during token verification', async () => {

        const secretKey = process.env['JWT_SECRET'] as string;
        const payload = { id: '123', username: 'testUser' };
        const token = jwt.sign(payload, secretKey, { expiresIn: '-10' });
        
        const req: any = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnValue(() => {throw new Error('')}),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (jwt.verify as jest.Mock) = jest.fn().mockImplementation(() => { throw new Error('Error')});

        await verifyApiToken(req, res, next);
        
        expect(next).toHaveBeenCalledWith(new TypeError('res.status(...).json is not a function'));
    });

});
