import { jest } from '@jest/globals';
import { redirectToLogin, redirectToDashboard } from "../../../src/app/middleware/auth.mw";

describe("Redirect To Login", () => {
    
    it('should redirect to login when session userId is not present', () => {
        const req: any = {
            session: {
                userId: null,
                authorized: true,
            },
        };
        
        const res:any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session authorized is false', () => {
        const req: any = {
            session: {
                userId: 'email@abc.com',
                authorized: false,
            },
        };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session object is not defined', () => {
        const req: any = {};

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session object is not defined', () => {
        const req: any = { session: undefined };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session object is null', () => {
        const req: any = {
            session: null
        };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session userId is an empty string', () => {
        const req: any = {
            session: { userId: '', authorized: true },
        };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should redirect to login when session authorized is undefined', () => {
        const req: any = {
            session: { userId: 'email@abc.com', authorized: undefined },
        };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    it('should call the next middleware only once if session userId is present and authorized is true', () => {
        const req: any = {
            session: {
                userId: 'email@abc.com',
                authorized: true,
            },
        };

        const res: any = {
            redirect: jest.fn(),
        };

        const next = jest.fn();

        redirectToLogin(req, res, next);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
