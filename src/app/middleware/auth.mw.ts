import { Request, Response, NextFunction } from "express";
const redirectToLogin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session?.userId || req.session.authorized !== true) {
        res.redirect('/login');
    } else {
        next();
    }
};

const redirectToDashboard = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session?.userId && req.session.authorized === true) {
        res.redirect('/');
    } else {
        next();
    }
};

export { redirectToLogin, redirectToDashboard };
