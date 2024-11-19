import { jest } from '@jest/globals';
import User from '../../src/models/apiUserModel';
import { postRegisterUser } from '../../src/api/controllers/register.api.controllers';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { mockClient } from 'aws-sdk-client-mock';
import {
    CreateEmailIdentityCommand,    
    SESv2Client,
} from '@aws-sdk/client-sesv2';

const sesMock = mockClient(SESv2Client);

describe("Register API User", () => {

    beforeEach(() => {
        sesMock.reset();
    });

    it("should register api user when a valid email and password is provided", async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'Password1',
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
            email: req.body.userEmail,
            password: await bcrypt.hash(req.body.userPassword, 10),
        };

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce(null),
        });
        (User.create as jest.Mock) = jest.fn().mockReturnValue(user);

        sesMock.on(CreateEmailIdentityCommand).resolvesOnce({
            $metadata: {
                httpStatusCode: 200,
            },            
        });

        await postRegisterUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: `New user created with ${req.body.userEmail}! Verification email sent!`,
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no user email', async () => {
        const req: any = {
            body: {
                userPassword: 'Password1',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all fields!' });
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no user password', async () => {
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
            exec: jest.fn().mockReturnValueOnce(null),
        });
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please provide all fields!' });
    });

    it('should handle errors gracefully and return appropriate response and status code when there is no user email or password', async () => {
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
            exec: jest.fn().mockReturnValueOnce(null),
        });
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Please provide all fields!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user email is invalid', async () => {
        const req: any = {
            body: {
                userEmail: 'testexample.com',
                userPassword: 'Password1',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user email contains spaces', async () => {
        const req: any = {
            body: {
                userEmail: 'testexample  com',
                userPassword: 'Password1',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user email contains invalid chars', async () => {
        const req: any = {
            body: {
                userEmail: 'test+example.com',
                userPassword: 'Password1',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user password has no upper case char', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'password1',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user password length is less than 5 char', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'Pass',
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
        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user with the email already exists', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'Password1',
            },
        };

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (User.findOne as jest.Mock) = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValueOnce({
                _id: new Types.ObjectId(),
                email: req.body.userEmail,
                password: await bcrypt.hash(req.body.userPassword, 10),
            }),
        });

        (User.create as jest.Mock) = jest.fn().mockReturnValue(null);

        await postRegisterUser(req, res, next);

        expect(User.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
             error: 'User with the email already exists!',
        });
    });

    it('should handle errors gracefully and return appropriate response and status code when user registration fails', async () => {
        const req: any = {
            body: {
                userEmail: 'test@example.com',
                userPassword: 'Password1',
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

        (User.create as jest.Mock) = jest.fn().mockReturnValue(() => { throw new Error('')});

        await postRegisterUser(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'User creation failed!',
        });
    });
});
