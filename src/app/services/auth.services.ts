import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '../../utilities/validation.js';
import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employees.js';

export const loginEmployee = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (validateEmail(email) && validatePassword(password)) {
            // Check if employee exists in the database
            const employee = await Employee.findOne({ email }).exec();

            if (
                employee &&
                (await bcrypt.compareSync(password, employee.password))
            ) {                
                req.session.userId = email;
                req.session.authorized = true;
                console.log('tr')
                res.redirect('/');
            } else {
                return {
                    email: req.body.email,
                    error: 'Error: Check email and/or password',
                };
            }
        } else {
            return {
                email: req.body.email,
                error: 'Error: Invalid email and/or password',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            email: req.body.email,
            error: `Error: Something went wrong!`,
        };
    }
};
