import request from 'supertest';
import { app, Shutdown } from '../../src/server.ts';

describe('Application', () => {
    afterAll((done) => {
        Shutdown(done);
    });

    it('Server starts and has the proper test environment', async () => {
        expect(process.env.PORT).toEqual('5000');
        expect(app).toBeDefined();
    }, 3000);
});
