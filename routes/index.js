import express from 'express';
const router = express.Router();
import loginEmployee from '../controllers/loginController.js';

/* GET home page. */
router.get('/', function (req, res) {
    console.log(req.session);
    if (req.session.userId && req.session.authorized === true) {        
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'Login',
            username: '',
            error: '',
        });
    }
    
});

/* Get Login Page */
router.get('/login', function (req, res) {    
    console.log(req.session);
    if (req.session.userId) {
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
