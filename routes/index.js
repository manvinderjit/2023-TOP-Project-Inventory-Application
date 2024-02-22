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
import cmsRouter from './cmsRoutes.js';
import ordersRouter from './ordersRouter.js';

indexRouter.get('/', redirectToLogin, nocache, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        username: res.locals.user,
    });
});

indexRouter.use('/categories', redirectToLogin, nocache, categoryRouter);
indexRouter.use('/allproducts', redirectToLogin, nocache, productRouter);
indexRouter.use('/promos', redirectToLogin, nocache, promoRouter);
indexRouter.use('/cms', redirectToLogin, nocache, cmsRouter);
indexRouter.use('/orders', redirectToLogin, nocache, ordersRouter);

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

indexRouter.get('/guide', (req, res) => {
    const navMenuItems =
        req.session?.userId && req.session.authorized === true
            ? [
                  { name: 'Dashboard', link: '/' },
                  { name: 'Categories', link: '/categories' },
                  { name: 'Products', link: '/allproducts' },
                  { name: 'Promos', link: '/promos' },
              ]
            : [
                  { name: 'Login', link: '/login' },
                  { name: 'Register', link: '/register' },
              ];
    res.render('guide', {
        navMenuItems: navMenuItems,
        title: 'Walkthrough Guide',
        email: '',
        error: '',
    });
});

export default indexRouter;
