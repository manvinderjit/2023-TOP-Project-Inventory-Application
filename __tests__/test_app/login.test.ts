import request from 'supertest';
import { jest } from "@jest/globals";
import { app, Shutdown } from '../../src/server';
import connectDB from '../../src/config/mongodb';
import httpMocks from 'node-mocks-http';
import { loginEmployee, logoutEmployee } from '../../src/app/services/auth.app.services';
import { loginEmployeeController } from '../../src/app/controllers/auth.app.controllers';

describe('Login View', function () {

    beforeEach(async () => {
        (await connectDB()).ConnectionStates.connected === 1;
    });

    afterAll((done) => {
        Shutdown(done);
    });

    afterEach(async () => (await connectDB()).ConnectionStates.disconnected === 0);

    it('should render the Login page', async () => {
        const response = await request(app).get('/login');
        
        expect(response.status).toBe(200);        
        expect(response.text).toContain('Login');

        expect(response.text).toContain('Enter Your Information');
        expect(response.text).toContain('Email Address');
        expect(response.text).toContain('Password');

        expect(response.text).toContain(
            '<label class="form-label" for="email">Email Address: </label>',
        );

        expect(response.text).toContain(
            '<input class="form-control" type="email" id="email" name="email" required minlength="3" maxlength="30" value= >'
        );
    });

    it('should Login user when the credentials are correct', async () => {
        const email = 'e@abc.com';
        const password = 'Admin1';

        const response = await loginEmployee(email, password);
        expect(response).toEqual({
            authenticated: true,
            email: 'e@abc.com',
            error: null,
        });
    });

    it('should return the correct error when the login email is incorrect', async () => {
        const email = 'invalid@email.com';
        const password = 'Admin1';

        const response = await loginEmployee(email, password);
        expect(response.authenticated).toEqual(false);
        expect(response.email).toEqual(email);
        expect(response.error).toEqual("Error: Check email and/or password");
    });

    it('should return the correct error when the login password is incorrect', async () => {
        const email = 'e@abc.com';
        const password = 'invalidPwd';

        const response = await loginEmployee(email, password);
        expect(response.authenticated).toEqual(false);
        expect(response.email).toEqual(email);
        expect(response.error).toEqual('Error: Check email and/or password');
    });

    it('should return the correct error when the email is invalid', async () => { // Not in correct format
        const email = 'notAnEmail';
        const password = 'invalidPwd';

        const response = await loginEmployee(email, password);
        expect(response.authenticated).toEqual(false);
        expect(response.email).toEqual(email);
        expect(response.error).toEqual('Error: Invalid email and/or password');
    });

    it('should return the correct error when the email is empty', async () => {
        // Not in correct format
        const email = '';
        const password = 'invalidPwd';

        const response = await loginEmployee(email, password);
        expect(response.authenticated).toEqual(false);
        expect(response.email).toEqual(email);
        expect(response.error).toEqual('Error: Invalid email and/or password');
    });

    it('should return the correct error when the password is empty', async () => {
        // Not in correct format
        const email = '';
        const password = '';

        const response = await loginEmployee(email, password);
        expect(response.authenticated).toEqual(false);
        expect(response.email).toEqual(email);
        expect(response.error).toEqual('Error: Invalid email and/or password');
    });

});

describe('Login Employee', () => {

    it('should login employee and redirect to dashboard if credentials are valid', async() => {
        const validEmail = 'e@abc.com';
        const validPassword = 'Admin1';
        
        let req: any = {
            body: { email: validEmail, password: validPassword },
            session:{
                userId: '',
                authorized: false,
            }
        }

        const res: any = {
            redirect: jest.fn(),
            render: jest.fn(),
        };

        const next: any = jest.fn();

        await loginEmployeeController(req, res, next);
        expect(req.session.userId).toEqual(validEmail);
        expect(req.session.authorized).toEqual(true);
        expect(res.redirect).toHaveBeenCalledWith('/');
        expect(next).not.toHaveBeenCalled();
    });

    it('should not log in employee and render login with error', async () => {
        const invalidEmail = 'invalid@abc.com';
        const invalidPassword = 'wrongPass';

        let req: any = {
            body: { email: invalidEmail, password: invalidPassword },
            session: {
                userId: '',
                authorized: false,
            },
        };

        const res: any = {
            redirect: jest.fn(),
            render: jest.fn(),
        };

        const next: any = jest.fn();

        await loginEmployeeController(req, res, next);
        
        expect(res.render).toHaveBeenCalledWith('login', {
            email: 'invalid@abc.com',
            error: 'Error: Check email and/or password',
            title: 'Login',
        });
        expect(next).not.toHaveBeenCalled();
    });

});

describe("should Logout User", () => {
    it('should logout user, destroy session, and redirect to login', async () => {
        const req = httpMocks.createRequest({
            session: {
                destroy: jest.fn((cb:any) => cb(null)),
            },
        });
        
        let res: any = {
            redirect: jest.fn(),
            session: {
                destroy: jest.fn(),
            },
            clearCookie: jest.fn(),
            render: jest.fn(),
        };

        const next = jest.fn();
        await logoutEmployee(req, res, next);
        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith('inventory-app');        
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

     it('should render dashboard with an error message when session destruction fails', async () => {
        const req = httpMocks.createRequest({
            session: {
                destroy: jest.fn((cb: any) => cb(new Error('Server error'))),
            },
        });

        let res: any = {            
            session: {
                destroy: jest.fn(),
            },
            render: jest.fn(),
            locals: {
                user: 'Dummy user',
            },
        };

        const next = jest.fn();
        await logoutEmployee(req, res, next);
        expect(res.render).toHaveBeenCalledWith('dashboard', {
            error: 'Error: Server error',
            title: 'Dashboard',
            username: 'Dummy user',
        });
     });

});
