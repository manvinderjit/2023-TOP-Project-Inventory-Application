import { jest } from '@jest/globals';
import Product from '../../src/models/productModel';
import Category from '../../src/models/categoryModel';
import { getProducts, getProductCategories } from '../../src/api/controllers/products.api.controllers';
import createHttpError from 'http-errors';

const mockProducts = [
    {
        name: 'ABC 27G2SP Monitor',
        description: 'ABC 27G2SP Monitor',
        imageFilename: 'abc-27g2sp-monitor.jpg',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
            url: '/categories/651f74b0df4699212c8abacb',
            id: '651f74b0df4699212c8abacb',
        },
        price: '300.00',
        stock: 20,
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'AOC 27G2 Monitor',
        description: 'Monitor from AOC for gaming.',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
            url: '/categories/651f74b0df4699212c8abacb',
            id: '651f74b0df4699212c8abacb',
        },
        price: '250.00',
        stock: 47,
        imageFilename: 'aoc-27g2-monitor.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'AOC 27G2SP Monitor',
        description: 'This is a 165Hz version of AOC Gaming monitor',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
            url: '/categories/651f74b0df4699212c8abacb',
            id: '651f74b0df4699212c8abacb',
        },
        price: '310.10',
        stock: 10,
        imageFilename: 'aoc-27g2sp-monitor.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'ASUS PD718A',
        description: 'Asus 240Hz Gaming Monitor',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
            url: '/categories/651f74b0df4699212c8abacb',
            id: '651f74b0df4699212c8abacb',
        },
        price: '300.00',
        stock: 20,
        imageFilename: 'asus-pd718a.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'ASUS PG918',
        description: 'Asus Gaming Monitor 360Hz.',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
            url: '/categories/651f74b0df4699212c8abacb',
            id: '651f74b0df4699212c8abacb',
        },
        price: '600.00',
        stock: 20,
        imageFilename: 'asus-pg918.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'CM CK750 Keyboard',
        description: 'This is cooler masters 2024 keyboard CK750.',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
            url: '/categories/652624671853eb7ecdacd6b8',
            id: '652624671853eb7ecdacd6b8',
        },
        price: '10.00',
        stock: 30,
        imageFilename: 'cm-ck750-keyboard.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'CM CK790RGB Keyboard',
        description: 'RGB version of 2024 Cooler Master keyboard',
        imageFilename: 'cm-ck790rgb-keyboard.jpg',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
            url: '/categories/652624671853eb7ecdacd6b8',
            id: '652624671853eb7ecdacd6b8',
        },
        price: '25.00',
        stock: 23,
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'Cooler Master MK350',
        description: 'Cooler Master Gaming Keyboard',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
            url: '/categories/652624671853eb7ecdacd6b8',
            id: '652624671853eb7ecdacd6b8',
        },
        price: '49.99',
        stock: 50,
        imageFilename: 'cooler-master-mk350.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'Cooler Master MK450',
        description: 'RGB Gaming Keyboard from Cooler Master',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
            url: '/categories/652624671853eb7ecdacd6b8',
            id: '652624671853eb7ecdacd6b8',
        },
        price: '70.00',
        stock: 20,
        imageFilename: 'cooler-master-mk450.jpg',
        url: '/product/undefined',
        id: null,
    },
    {
        name: 'Victsing Keyboard',
        description: 'Victsing keyboard for offices',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
            url: '/categories/652624671853eb7ecdacd6b8',
            id: '652624671853eb7ecdacd6b8',
        },
        price: '9.99',
        stock: 50,
        imageFilename: 'victsing-keyboard.jpg',
        url: '/product/undefined',
        id: null,
    },
];

const mockProductCategories = [
    { _id: '652624671853eb7ecdacd6b8', name: 'Computer Keyboards' },
    { _id: '651f74b0df4699212c8abacb', name: 'Monitors' },
    { _id: '6534680c8a7ce6a6af7f9cb9', name: 'Mouse' },
    { _id: '65389dec03f4c7f5bfb7f72e', name: 'PSU-SMPS' },
    { _id: '6538a0572e4b5bfd1aa31384', name: 'Power Cable' },
    { _id: '65398be37d1f92b9d4568a87', name: 'Speakers' },
    { _id: '653c607042f0b21c93e70020', name: 'UPS' },
    { _id: '67003cc58ea8ab54fe0cf65b', name: 'Wifi Dongles' },
];

describe("Get Products", () => {
    // Return result with default values when no query search parameters are provided
    it('should return products and total pages when no query parameters are provided', async () => {
        const req: any = {
            query: {},
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockProducts),
        });

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(mockProducts.length);

        await getProducts(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            productList: mockProducts,
            totalPages: 2,
        });
    });

    // Handle valid category parameter
    it('should return result from the provided category only when category param is provided', async () => {
        const req: any = {
            query: {
                category: '652624671853eb7ecdacd6b8',
            },
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        const returnedProducts = mockProducts.filter((product) => {
            return product.category.id === req.query.category;
        });

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(returnedProducts.length);

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(returnedProducts),
        });

        await getProducts(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            productList: returnedProducts,
            totalPages: 1,
        });
    });

    // Handle valid search parameter
    it('should return result from the provided search only when search param is provided', async () => {
        const req: any = {
            query: {
                search: 'keyboard',
            },
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        const returnedProducts = mockProducts.filter((product) => {
            return product.description.includes(req.query.search);
        });

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(returnedProducts.length);

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(returnedProducts),
        });

        await getProducts(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            productList: returnedProducts,
            totalPages: 1,
        });
    });

    // Handle valid page and limit parameters
    it('should return result from the provided page only when page and limit params are provided', async () => {
        const req: any = {
            query: {
                page: 2,
                limit: 6,
            },
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        const returnedProducts = mockProducts.slice(
            req.query.limit - mockProducts.length,
        );

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(mockProducts.length);

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(returnedProducts),
        });

        await getProducts(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            productList: returnedProducts,
            totalPages: 2,
        });
    });

    // Handle empty database result
    it('should return appropriate response if no products are found', async () => {
        const req: any = {
            query: {},
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getProducts(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No Products to Show!',
            productList: null,
        });
    });

    // Return error if url query params are provided as array
    it('should return invalid request error if url params contain array', async () => {
        const req: any = {
            query: {
                category: ['validCategoryId', 'anotherValidCategoryId'],
            },
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        await getProducts(req, res, next);

        expect(next).toHaveBeenCalledWith(
            createHttpError(400, 'Invalid request!'),
        );
    });

    // Unknown error
    it('should handle unknown errors gracefully and call the next function', async () => {
        const req: any = {
            query: {},
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const next: any = jest.fn();

        (Product.find as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error('Test Error');
        });

        await getProducts(req, res, next);

        expect(next).toHaveBeenCalledWith(new Error('Test Error'));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe("GET Product Categories", () => {
    it("should return Product Categories upon a successful request", async () => {
        const req: any = {};

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockProductCategories),
        });

        await getProductCategories(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ productCategories: mockProductCategories });
        expect(next).not.toHaveBeenCalled();

    });

    it('should return an error when no product categories found', async () => {
        const req: any = {};

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getProductCategories(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: 'No Product Categories Found!',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle unknown errors gracefully and call the next function', async () => {
        const req: any = {};

        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const next: any = jest.fn();

        (Category.find as jest.Mock) = jest.fn().mockImplementationOnce(() => { throw new Error ('Test Error')});

        await getProductCategories(req, res, next);


        expect(next).toHaveBeenCalledWith(new Error('Test Error'));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        
    });


});