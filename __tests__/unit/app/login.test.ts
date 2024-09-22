import request from 'supertest';
import { jest } from "@jest/globals";
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';
import httpMocks from 'node-mocks-http';
import { loginEmployee, logoutEmployee } from '../../../src/app/services/auth.services';

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
