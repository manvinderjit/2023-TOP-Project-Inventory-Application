import Employee from '../models/employees.js';
import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '../utilities/validation.js';

const loginEmployee = async (req, res, next) => {
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
                res.redirect('/');
            } else {
                res.render('login', {
                    title: 'Login',
                    email: req.body.email,
                    error: 'Error: Check email and/or password',
                });
            }
        } else {
            res.render('login', {
                title: 'Login',
                email: email,
                error: 'Error: Invalid email and/or password',
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const logoutEmployee = async (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return res.redirect('/');
        }
        res.clearCookie(process.env.SID);
        res.redirect('/login');
    });
};

export { loginEmployee, logoutEmployee };
