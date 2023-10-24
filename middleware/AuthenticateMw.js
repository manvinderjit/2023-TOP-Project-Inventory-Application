const redirectToLogin = (req, res, next) => {
    if (!req.session?.userId || req.session.authorized === false) {
        res.redirect('/login');
    } else {
        next();
    }
};

const redirectToDashboard = (req, res, next) => {
    if (req.session?.userId && req.session.authorized === true) {
        res.redirect('/');
    } else {
        next();
    }
};

export { redirectToLogin, redirectToDashboard };
