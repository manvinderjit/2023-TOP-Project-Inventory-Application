import { Request, Response, NextFunction } from 'express';

const dashboardView = (req: Request, res: Response) => {
    res.render('dashboard', {
        title: <string>'Dashboard',
        username: <string>res.locals.user,
        error: <string>'',
    });
};

export { dashboardView };
