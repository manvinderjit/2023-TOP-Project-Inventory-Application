import { Request, Response } from 'express';
export const getGuidePage = (req: Request, res: Response) => {
    const navMenuItems =
        req.session?.userId && req.session.authorized === true
            ? [
                  { name: 'Dashboard', link: '/' },
                  { name: 'Categories', link: '/categories' },
                  { name: 'Products', link: '/products' },
                  { name: 'Promos', link: '/promos' },
                  { name: 'Orders', link: '/orders' },
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
};
