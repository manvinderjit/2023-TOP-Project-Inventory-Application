import Router from 'express';
const indexRouter = new Router();
import {
    redirectToLogin,
    redirectToDashboard,
} from '../middleware/AuthenticateMw.js';
import {
    loginEmployee,
    logoutEmployee,
} from '../controllers/authenticateController.js';
import { registerEmployee } from '../controllers/registrationController.js';
import nocache from '../middleware/noCacheMw.js';

indexRouter.get('/', redirectToLogin, nocache, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        username: res.locals.user,
    });
});

indexRouter.get('/login', redirectToDashboard, (req, res) => {
    res.render('login', {
        title: 'Login',
        email: '',
        error: '',
    });
});

indexRouter.post('/login', redirectToDashboard, loginEmployee);

indexRouter.get('/register', redirectToDashboard, (req, res) => {
    res.render('register', {
        title: 'Registration Page',
        email: '',
        error: '',
    });
});

indexRouter.post('/register', registerEmployee);

indexRouter.post('/logout', redirectToLogin, logoutEmployee);

export default indexRouter;
