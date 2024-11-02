import { jest } from '@jest/globals';
import User from '../../../src/models/apiUserModel';
import { postLoginUser } from '../../../src/api/controllers/login.api.controllers';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe("Login API User", () => {
    it("should login api user when a valid email and password is provided", async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'correctPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        const user = {
            _id: new Types.ObjectId(),
            email: 'test@example.com',
            password: await bcrypt.hash('correctPassword', 10),
        };

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(user)
        });
        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce('fakeToken');

        await postLoginUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ token: 'fakeToken' });        
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no userEmail', async () => {
        const req: any = {
            body: {
                userPassword: 'correctPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null)
        });
        
        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all fields.' });
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no userPassword', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null)
        });
        
        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all fields.' });
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no userEmail or userPassword', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null)
        });
        
        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all fields.' });
    });

    it('should handle errors gracefully and return appropriate response and status code when the userEmail is invalid', async () => {
        const req: any = {
            body: {
                userEmail: 'testexamplecom',
                userPassword: 'correctPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null),
        });

        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password.',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when the userEmail is only spaces', async () => {
        const req: any = {
            body: {
                userEmail: '      ',
                userPassword: 'correctPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null),
        });

        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(true);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password.',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when invalid password is provided', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'incorrectPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        const user = {
            _id: new Types.ObjectId(),
            email: 'test@example.com',
            password: await bcrypt.hash('correctPassword', 10),
        };

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(user),
        });

        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(false);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);

        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when invalid email is provided', async () => {
        const req: any = {
            body: {
                userEmail: 'invalid@example.com',
                userPassword: 'incorrectPassword',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null),
        });

        (bcrypt.compare as jest.Mock) = jest.fn().mockReturnValueOnce(false);
        (jwt.sign as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postLoginUser(req, res, next);
        
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });
});
