import request from 'supertest';
import { jest } from '@jest/globals';
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';
import { registerEmployee } from '../../../src/app/controllers/auth.app.controllers';
import * as appAuthServices from '../../../src/app/services/auth.app.services';
import Employee from '../../../src/models/employees';

describe('Register View', () => {
    beforeEach(async () => {
        (await connectDB()).ConnectionStates.connected === 1;
    });

    afterAll((done) => {
        Shutdown(done);
    });

    afterEach(
        async () => (await connectDB()).ConnectionStates.disconnected === 0,
    );

    it('should render the Login page', async () => {
        const response = await request(app).get('/register');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Registration Page');

        expect(response.text).toContain('Enter Your Information');
        expect(response.text).toContain('Email Address');
        expect(response.text).toContain('Password');
        expect(response.text).toContain('Confirm Password');

        expect(response.text).toContain(
            `<input class=\"form-control\" type=\"email\" id=\"email\" name=\"email\" required minlength=\"6\" maxlength=\"30\" aria-describedby=\"emailHelp\" value= >`,
        );

        expect(response.text).toContain(
            `<input class=\"form-control\" type=\"password\" id=\"password\" name=\"password\" pattern=\"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{5,}\" required>`,
        );

        expect(response.text).toContain(
            `<input class=\"form-control\" type=\"password\" id=\"confirmPassword\" name=\"confirmPassword\" pattern=\"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{5,}\" required>`,
        );

        expect(response.text).toContain(
            `<button type=\"submit\" class=\"btn btn-primary\">Sign Me Up</button>`,
        );
    });
});


describe("Register Employee", () => {
    it("should render validation error when email is empty", async () => {
        const req: any = {
            body: { 
                email: '',
                password: 'Password1',
                confirmPassword: 'Password1',
            }
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: '',
            error: 'Error: Please provide all fields.',
        });
    });

    it('should render validation error when email is invalid', async () => {
        const req: any = {
            body: {
                email: 'emailNotValid',
                password: 'Password1',
                confirmPassword: 'Password1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'emailNotValid',
            error: 'Error: Invalid email and/or password',
        });
    });

    it('should render validation error when password is empty', async () => {
        const req: any = {
            body: {
                email: 'email@abc.com',
                password: '',
                confirmPassword: 'Password1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'email@abc.com',
            error: 'Error: Please provide all fields.',
        });
    });

    it('should render validation error when password is invalid', async () => {
        const req: any = {
            body: {
                email: 'email@abc.com',
                password: 'admin',
                confirmPassword: 'admin',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'email@abc.com',
            error: 'Error: Invalid email and/or password',
        });
    });

    it('should render validation error when confirmPassword is empty', async () => {
        const req: any = {
            body: {
                email: 'email@abc.com',
                password: 'Password1',
                confirmPassword: '',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'email@abc.com',
            error: 'Error: Please provide all fields.',
        });
    });

    it('should render validation error when confirmPassword is invalid', async () => {
        const req: any = {
            body: {
                email: 'email@abc.com',
                password: 'Admin1',
                confirmPassword: 'admin1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'email@abc.com',
            error: 'Error: Invalid email and/or password',
        });
    });

    it("should render validation error when password and confirmPassword don't match", async () => {
        const req: any = {
            body: {
                email: 'email@abc.com',
                password: 'Admin1',
                confirmPassword: 'Admina1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: 'email@abc.com',
            error: 'Error: Password and confirm password must match!',
        });
    });

    it('should render validation error when fields are undefined', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: undefined,
            error: 'Error: Please provide all fields.',
        });
    });

    it('should render registration error when a user with the provided email already exists', async () => {
        const req: any = {
            body: {
                email: 'e@abc.com',
                password: 'Admin1',
                confirmPassword: 'Admin1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: req.body.email,
            error: 'Error: An account with the email already exists.',
        });
    });

    it('should render success message when registration is successful with valid inputs', async () => {
        const req: any = {
            body: {
                email: 'emailanother@abc.com',
                password: 'Admin1',
                confirmPassword: 'Admin1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        (Employee.create as jest.Mock) = jest.fn().mockReturnValueOnce({
            email: req.body.email
        });

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: '',
            error: '',
            success: `Employee account with ${req.body.email} created successfully!`,
        });
    });

    it('should render error message when user creation fails', async () => {
        const req: any = {
            body: {
                email: 'emailanother@abc.com',
                password: 'Admin1',
                confirmPassword: 'Admin1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        (Employee.create as jest.Mock) = jest.fn().mockReturnValueOnce({});

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: req.body.email,
            error: 'User creation failed',
        });
    });

    it('should render error message and handle gracefully when registration fails due to an unknown issue in createEmployeeAccount service', async () => {
        const req: any = {
            body: {
                email: 'emailanother@abc.com',
                password: 'Admin1',
                confirmPassword: 'Admin1',
            },
        };

        const res: any = {
            render: jest.fn(),
        };

        const dummyError = new Error('Dummy Error');

        (Employee.create as jest.Mock) = jest.fn().mockImplementation(() => {
            throw dummyError;
        });

        await registerEmployee(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Registration Page',
            email: req.body.email,
            error: dummyError,
        });
    });
});
