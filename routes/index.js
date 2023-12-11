import express from 'express';
const indexRouter = express.Router();
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
import categoryRouter from './categoryRoutes.js';
import productRouter from './productRoutes.js';
import promoRouter from './promoRoutes.js';

indexRouter.get('/', redirectToLogin, nocache, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        username: res.locals.user,
    });
});

indexRouter.use('/categories', redirectToLogin, nocache, categoryRouter);
indexRouter.use('/allproducts', redirectToLogin, nocache, productRouter);
indexRouter.use('/promos', redirectToLogin, nocache, promoRouter);

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
