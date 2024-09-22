import express, { NextFunction, Request, Response } from 'express';
import { loginEmployee, logoutEmployee } from '../services/auth.services.js';

const loginView = (req: Request, res: Response) => {
    res.render('login', {
        title: <string>'Login',
        email: <string>'',
        error: <string>'',
    });
};

const loginEmployeeController = async(req: Request, res: Response, next: NextFunction) => {    
    const { email, password } = req.body;
    // Login Employee
    const loginResult = await loginEmployee(email, password);
    // If Login Success
    if(loginResult.authenticated === true && loginResult.error === null) {
        req.session.userId = email;
        req.session.authorized = true;
        // Redirect to Dashboard
        res.redirect('/');
    }
    // If Login Error
    else if(loginResult?.error) {
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

export { loginView, loginEmployeeController, registerView };
