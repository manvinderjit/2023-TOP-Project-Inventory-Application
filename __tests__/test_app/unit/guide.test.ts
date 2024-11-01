import { jest } from '@jest/globals';
import { getGuidePage } from '../../../src/app/controllers/guide.app.controllers';

describe("GET Guide Page", () => {
    it("should render the guide page when a user is logged out", async () => {
        const req: any = {
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },           
            render: jest.fn(),
        };

        await getGuidePage(req, res);

        expect(res.render).toHaveBeenCalledWith('guide', {
            navMenuItems: [
                { name: 'Login', link: '/login' },
                { name: 'Register', link: '/register' },
            ],
            title: 'Walkthrough Guide',
            email: '',
            error: '',
        });
    });

    it("should render the guide page when a user is logged in", async () => {
        const req: any = {
            session: { 
                userId: 'dummyUser',
                authorized: true,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        await getGuidePage(req, res);

        expect(res.render).toHaveBeenCalledWith('guide', {
            navMenuItems: [
                  { name: 'Dashboard', link: '/' },
                  { name: 'Categories', link: '/categories' },
                  { name: 'Products', link: '/products' },
                  { name: 'Promos', link: '/promos' },
                  { name: 'Orders', link: '/orders' },
              ],
            title: 'Walkthrough Guide',
            email: '',
            error: '',
        });
    });
});
