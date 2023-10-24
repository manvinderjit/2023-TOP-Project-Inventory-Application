import express from 'express';
const router = express.Router();
import loginEmployee from '../controllers/loginController.js';
import { checkSessionStatus } from '../middleware/authMiddleware.js';

/* GET home page. */
router.get('/', checkSessionStatus, function (req, res) {
    // console.log(req.session);
    // if (req.session.userId && req.session.authorized === true) {
    //     res.redirect('/');
    // } else {
    // res.render('login', {
    //     title: 'Login',
    //     username: '',
    //     error: '',
    // });
    // }
    res.redirect('/');
});

/* Get Login Page */
router.get('/login', function (req, res) {    
    console.log(req.session);
    if (req.session.userId && req.session.authorized === true) {
        console.log(req.session.userId);
        res.redirect('/');
    } else {        
        res.render('login', {
            title: 'Login',  
            username:'',
            error:''
        });
    }
});

router.post('/login', loginEmployee);

export default router;
