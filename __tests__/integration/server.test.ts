import request from 'supertest';
import { app, Shutdown } from '../../src/server';
import connectDB from '../../src/config/mongodb';
import mongoose, { createConnection } from 'mongoose';
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import { loginEmployee } from '../../src/app/services/auth.services';
import Employee from '../../src/app/models/employees';

describe('Inventory App', () => {
    beforeEach(async () => {
        (await connectDB()).ConnectionStates.connected === 1;
    });

    afterAll((done) => {
        Shutdown(done);
    });

    it('Server starts and has the proper test environment', async () => {
        expect(process.env['PORT']).toEqual('5000');
        expect(app).toBeDefined();
        (await connectDB()).ConnectionStates.disconnected === 0;
    }, 3000);

    // it('should authenticate successfully when email and password are valid', async () => {
    //     const email = 'test@example.com';
    //     const password = 'password123';

    //     //const employee = { email, password: bcrypt.hashSync(password, 10) };

    //     jest.mock('../../src/app/models/employees');
    //     jest.mock('bcrypt');

    //     const employee = { email, password: 'hashedPassword' };
    //     Employee.findOne.mockResolvedValue(employee);
    //     bcrypt.compareSync.mockReturnValue(true);

    //     const result = await loginEmployee(email, password);

    //     expect(result).toEqual({
    //         email,
    //         authenticated: true,
    //         error: null,
    //     });

    //     // jest.spyOn(Employee, 'findOne').mockResolvedValue(employee);
    //     // jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    //     // const result = await loginEmployee(email, password);

    //     // expect(result).toEqual({ email, authenticated: true, error: null });
    // });
    
});


