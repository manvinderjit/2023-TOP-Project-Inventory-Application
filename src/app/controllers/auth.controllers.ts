import express, { NextFunction, Request, Response } from 'express';
import { loginEmployee } from '../services/auth.services.js';

const loginView = (req: Request, res: Response) => {
    res.render('login', {
        title: <string>'Login',
        email: <string>'',
        error: <string>'',
    });
};

const loginUser = async(req: Request, res: Response, next: NextFunction) => {
    const loginResult = await loginEmployee(req, res);
    if(loginResult?.error) {
        res.render('login', {
            title: <string>'Login',
            email: <string>`${loginResult.email}`,
            error: <string>`${loginResult.error}`,
        });
    } 
};

const registerView = (req: Request, res: Response) => {
    res.render('register', {
        title: 'Registration Page',
        email: '',
        error: '',
    });
};

export { loginView, loginUser, registerView }