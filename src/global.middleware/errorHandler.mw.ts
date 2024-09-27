import { Request, Response, NextFunction } from "express";

//Global error handler
const errorHandler = (err:any, req: Request, res:Response , next: NextFunction): void => {
    console.error(err.stack);    
    res.status(500).send(err?.message || 'Something went wrong');
    next();
};

export default errorHandler;
