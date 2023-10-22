const loginEmployee = async (req, res, next) => {
    try {        
            if (
                req.body.username == 'admin' &&
                req.body.password == 'password'
            ) {
                
                req.session.userId = req.body.username;                
                req.session.authorized = true;

                console.log(req.session);
                res.redirect('/catalog');
            } else {
                res.render('login', {
                    title: 'Login',
                    username: req.body.username,
                    error: 'Error: Check username and/or password',
                });                
            };       
        
        // const { email, password } = req.body;

        // // Check if user with the provided email exists
        // const user = await User.findOne({ email }).exec();

        // if (user && (await bcrypt.compareSync(password, user.password))) {
        //     res.cookie('jwt', generateRefreshToken(user._id), {
        //         httpOnly: true,
        //         sameSite: 'None',
        //         secure: true,
        //         maxAge: 24 * 60 * 60 * 1000,
        //     });
        //     res.status(201).json({
        //         _id: user._id,
        //         username: user.email,
        //         token: generateToken(user._id),
        //     });
        // } else {
        //     res.status(400).send({
        //         error: 'Invalid email or password.',
        //     });
        // }
        next();
    } catch (error) {
        console.error(error);
    }    
};


export default loginEmployee;