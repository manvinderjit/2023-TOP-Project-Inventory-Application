import { jest } from '@jest/globals';
import errorHandler from '../../src/global.middleware/errorHandler.mw';

describe('Global Error Handler', () => {
    // Handles errors by logging the stack trace
    it('should log the stack trace when an error occurs', () => {
        const err = new Error('Test error');
        const req: any = {} as Request;
        const res: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        const next: any = jest.fn();

        console.error = jest.fn();

        errorHandler(err, req, res, next);

        expect(console.error).toHaveBeenCalledWith(err.stack);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(err.message);
        expect(next).toHaveBeenCalled();
    });

    // Handles non-standard error objects without a stack trace
    it('should handle non-standard error objects without a stack trace', () => {
        const err = { message: 'Non-standard error' };
        const req: any = {} as Request;
        const res: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;
        const next: any = jest.fn();

        console.error = jest.fn();

        errorHandler(err, req, res, next);

        expect(console.error).toHaveBeenCalledWith(undefined);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(err.message);
        expect(next).toHaveBeenCalled();
    });
});
