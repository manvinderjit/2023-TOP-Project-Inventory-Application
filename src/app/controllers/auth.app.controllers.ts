import express, { NextFunction, Request, Response } from 'express';
import { loginEmployee, logoutEmployee } from '../services/auth.app.services.js';
import { validateEmail, validatePassword } from '../../utilities/validation.js';
import * as appAuthServices from '../services/auth.app.services.js';

const loginView = (req: Request, res: Response) => {
    res.render('login', {
        title: <string>'Login',
        email: <string>'',
        error: <string>'',
    });
};

const loginEmployeeController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        // Login Employee
        const loginResult = await loginEmployee(email, password);
        // If Login Success
        if (loginResult.authenticated === true && loginResult.error === null) {
            req.session.userId = email;
            req.session.authorized = true;

            // Redirect to Dashboard
            res.redirect('/');
        }
        // If Login Error
        else if (loginResult?.error) {
            res.render('login', {
                title: <string>`Login`,
                email: <string>`${loginResult.email}`,
                error: <string>`${loginResult.error}`,
            });
        }     
    } catch (error) {
        console.error(error);
        res.render('login', {
            title: <string>`Login`,
            email: <string>`${req.body.email}`,
            error: <string>`${error}`,
        });
    }
    
};

const registerView = (req: Request, res: Response) => {
    res.render('register', {
        title: <string>'Registration Page',
        email: <string>'',
        error: <string>'',
    });
};

const validateInputsEmployeeRegistration = (email: string, password: string, confirmPassword: string) => {
    let error: null | string | undefined = null;
    if (!email || !password || !confirmPassword) {
        error = 'Error: Please provide all fields.';        
    }
    else if (
        !validateEmail(email) ||
        !validatePassword(password) ||
        !validatePassword(confirmPassword)
    ) {
        error = 'Error: Invalid email and/or password';        
    }
    else if (password !== confirmPassword) {
        error = 'Error: Password and confirm password must match!';        
    }
    return error;
};

const registerEmployee = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate fields
        const validationError: string | null = validateInputsEmployeeRegistration(email, password, confirmPassword);

        // If Invalid fields
        if (validationError !== null) {
            res.render('register', {
                title: 'Registration Page',
                email: email,
                error: validationError,
            });
        }
        // If Valid fields
        else if (
            validationError === null
        ) {
            const { success, error } = await appAuthServices.createEmployeeAccount(email, password);

            if (success !== true || error !== null ) {
                res.render('register', {
                    title: <string>'Registration Page',
                    email: <string>email,
                    error: <string>error,
                });
            } else if (success === true && error === null) {
                res.render('register', {
                    title: <string>'Registration Page',
                    email: <string>'',
                    error: <string>'',
                    success: <string>`Employee account with ${email} created successfully!`,
                });
            }
        }
    } catch (error: any) {
        res.render('register', {
            title: <string>'Registration Page',
            email: <string>req.body.email,
            error: <string>error,
        });
    }
};

export { loginView, loginEmployeeController, registerView, registerEmployee };
