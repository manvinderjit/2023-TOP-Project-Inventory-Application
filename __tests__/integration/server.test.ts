import request from 'supertest';
import { app, Shutdown } from '../../src/server';
import connectDB from '../../src/config/mongodb';
import mongoose, { createConnection } from 'mongoose';
import { jest } from '@jest/globals';

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
    
});
