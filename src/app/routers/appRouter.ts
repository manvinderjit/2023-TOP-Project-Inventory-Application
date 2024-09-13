import express, { Request, Response, Router } from 'express';
const appRouter: Router = express.Router();

appRouter.get('/login', (req: Request, res: Response) => {
    res.render('login', {
        title: <string>'Login',
        email: <string>'',
        error: <string>'',
    });
});

export default appRouter;
