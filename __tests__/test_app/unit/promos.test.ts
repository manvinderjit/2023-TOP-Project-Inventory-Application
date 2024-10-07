import { jest } from '@jest/globals';
import Promo from '../../../src/models/promoModel';
import {
    getPromoDetails,
    getManagePromos,
    getCreatePromo,
    postCreatePromo,
    getEditPromo,
    postEditPromo,
    getDeletePromo,
    postDeletePromo,
} from '../../../src/app/controllers/promos.app.controllers';
import { promoCategories } from '../../../src/app/services/promos.app.services';

const mockPromos = [
    {
        caption: {
            heading: 'Accessories and Peripherals',
            description:
                'Find accessories and peripherals for your computing requirements!',
        },
        _id: '657fc0d54055729bfa20fb1e',
        name: 'All Accessories',
        category: 'Carousel',
        imageUrl: 'promos/image/all-accessories.jpg',
        status: 'Active',
        startsOn: '2024-02-23T00:00:00.000Z',
        endsOn: '2024-02-28T00:00:00.000Z',
        createdAt: '2023-12-18T03:47:33.155Z',
        updatedAt: '2024-02-20T19:14:02.663Z',
        __v: 0,
        imageFilename: 'all-accessories.jpg',
    },
    {
        caption: {
            heading: 'Cyber Monday Promo',
            description: 'Cyber Monday Sale',
        },
        _id: '657a0da15ee419043fb6d922',
        name: 'Cyber Monday Promo',
        category: 'Carousel',
        imageUrl: 'promos/image/boxing-day-promo.png',
        status: 'Active',
        startsOn: '2024-02-24T00:00:00.000Z',
        endsOn: '2024-03-09T00:00:00.000Z',
        createdAt: '2023-12-13T20:01:37.308Z',
        updatedAt: '2024-02-20T19:15:50.566Z',
        __v: 0,
        imageFilename: 'boxing-day-promo.jpg',
    },
    {
        caption: {
            heading: 'Free Shipping For Everyone',
            description: 'Get Free Shipping over $50',
        },
        _id: '657e66db080f38b906989020',
        name: 'Free Shipping',
        category: 'Others',
        imageUrl: 'promos/image/free-shipping.jpg',
        status: 'Active',
        startsOn: '2023-12-16T00:00:00.000Z',
        endsOn: '2023-12-30T00:00:00.000Z',
        createdAt: '2023-12-17T03:11:23.402Z',
        updatedAt: '2024-02-20T19:24:08.101Z',
        __v: 0,
        imageFilename: 'free-shipping.jpg',
    },
    {
        caption: {
            heading: 'Lunar New Year Sale',
            description: 'Lunar New Year Sale.',
        },
        _id: '65d29f856aa32fe047a2c201',
        name: 'Lunar New Year Sale',
        category: 'Carousel',
        imageUrl: 'promos/image/lunar-new-year-sale.jpg',
        status: 'Active',
        startsOn: '2024-02-21T00:00:00.000Z',
        endsOn: '2024-02-29T00:00:00.000Z',
        createdAt: '2024-02-19T00:23:33.660Z',
        updatedAt: '2024-02-20T19:16:56.950Z',
        __v: 0,
        imageFilename: 'lunar-new-year-sale.jpg',
    },
    {
        caption: {
            heading: 'All Types of Storage Solutions',
            description: 'Harddisks and SSDs for varying client requirements.',
        },
        _id: '657fbfec4055729bfa20fb02',
        name: 'Storage Solutions',
        category: 'Carousel',
        imageUrl: 'promos/image/storage-solutions.jpg',
        status: 'Active',
        startsOn: '2023-12-18T00:00:00.000Z',
        endsOn: '2023-12-31T00:00:00.000Z',
        createdAt: '2023-12-18T03:43:40.784Z',
        updatedAt: '2024-02-20T19:18:09.911Z',
        __v: 0,
        imageFilename: 'storage-solutions.jpg',
    },
];

describe('Manage Promos View', () => {
    it('should render Manage Promos view when promos exist and no category is provided', async () => {
        const req: any = {
            body:{

            }
        };

        const res: any = {
            locals: {
                username: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromos),
        });

        await getManagePromos(req, res);

        expect(res.render).toHaveBeenCalledWith('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            promosList: mockPromos,
            promoCategoryList: promoCategories,
            selectedPromoCategory: req.body.promoCategory,
        });
    });

    it('should render Manage Promos view with promos from a category when a categoryId is provided', async () => {
        const req: any = {
            body: {
                promoCategory: '1',
            },
        };

        const res: any = {
            locals: {
                username: 'user@abc.com',
            },
            render: jest.fn(),
        };

        const returnedProducts = mockPromos.filter((promo) => {
            return promo.category === promoCategories[req.body.promoCategory - 1].name;
        });

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(returnedProducts),
        });

        await getManagePromos(req, res);

        expect(res.render).toHaveBeenCalledWith('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            promosList: returnedProducts,
            promoCategoryList: promoCategories,
            selectedPromoCategory: req.body.promoCategory,
        });
    });

    it('should handle error gracefully and render error messages on Manage Promos view when no promos are found', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            locals: {
                username: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getManagePromos(req, res);

        expect(res.render).toHaveBeenCalledWith('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            error: new Error('No Promos Found!'),
            promosList: null,
        });
    });

    it('should handle error gracefully and render error messages on Manage Promos view when an error occurs when fetching promos', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            locals: {
                username: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(() => { throw new Error('Unknown error!') }),
        });

        await getManagePromos(req, res);

        expect(res.render).toHaveBeenCalledWith('promos', {
            title: 'Manage Promos',
            username: res.locals.user,
            error: new Error('No Promos Found!'),
            promosList: null,
        });
    });
});
