import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '../../utilities/validation.js';
import { Request, Response, NextFunction } from 'express';
import Employee from '../../models/employees.js';

export const loginEmployee = async (email: string, password: string) => {
    try {
        // Validate email and password
        if (validateEmail(email) && validatePassword(password)) {
            // Check if employee exists in the database
            const employee = await Employee.findOne({ email }).exec();
            // Compare password
            if (
                employee &&
                (await bcrypt.compareSync(password, employee.password))
            ) {
                return  { email, authenticated:true, error: null };
            } else {
                return {
                    email,
                    authenticated: false,
                    error: 'Error: Check email and/or password',
                };
            }
        } 
        // If email or password is invalid, return error
        else {
            return {
                email,
                authenticated: false,
                error: 'Error: Invalid email and/or password',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            email,
            authenticated: false,
            error: `Error: Something went wrong!`,
        };
    }
};

export const logoutEmployee = async (req:Request, res:Response, next: NextFunction) => {    
    req.session.destroy((error) => {
        if (error) {
            res.render('dashboard', {
                title: <string>'Dashboard',
                username: <string>res.locals.user,
                error: <string>`${error}`,
            });
        }
        else {
            res.clearCookie('inventory-app');
            res.redirect('/login');
        }
    });
};
