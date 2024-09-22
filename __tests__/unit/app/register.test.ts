import request from 'supertest';
import { jest } from '@jest/globals';
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';
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
