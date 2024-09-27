import { jest } from "@jest/globals";
import Product from '../../../src/models/productModel';
import { fetchProducts } from "../../../src/api/services/products.services";

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

describe("Api Products", () => {
    it('should fetch products when default values for query params are used', async () => {
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

        const result = await fetchProducts(null, undefined, null, null);

        expect(result.error).toBeNull();
        expect(result.productList).toEqual(mockProducts);
        expect(result.totalPagesBasedOnLimit).toBe(2);
    });

    it('should fetch products and return totalPages when totalPages are more than 1', async () => {
        let perPageLimit = 6;
        const returnedProducts = mockProducts.slice(0, perPageLimit);

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

        const result = await fetchProducts(null, perPageLimit, null, null);

        expect(result.error).toBeNull();
        expect(result.productList).toEqual(returnedProducts);
        expect(result.totalPagesBasedOnLimit).toBe(2);
    });

    it('should fetch products with pagination when a per page limit is specified', async () => {
        let perPageLimit = 9;
        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockProducts.slice(0, perPageLimit)),
        });

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(mockProducts.length);

        const result = await fetchProducts(null, perPageLimit, null, null);

        expect(result.error).toBeNull();
        expect(result.productList).toEqual(mockProducts.slice(0, perPageLimit));
        expect(result.totalPagesBasedOnLimit).toBe(2);
    });

    it('should set totalPageCount to 1 when all products are fetched with pagination when a per page limit is specified', async () => {
        let perPageLimit = 12;
        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest
                .fn()
                .mockReturnValueOnce(mockProducts.slice(0, perPageLimit)),
        });

        (Product.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValue(mockProducts.length);

        const result = await fetchProducts(null, perPageLimit, null, null);

        expect(result.error).toBeNull();
        expect(result.productList).toEqual(mockProducts.slice(0, perPageLimit));
        expect(result.totalPagesBasedOnLimit).toBe(1);
    });

    it('should return error message when no products are found', async () => {
        (Product.countDocuments as jest.Mock) = jest.fn().mockReturnValue(0);

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        const result = await fetchProducts(null, undefined, null, null);

        expect(result.error).toBe('No Products to Show!');
        expect(result.productList).toBeNull();
    });

    it('should handle database query errors', async () => {
        const mockError = new Error('Database error');
        
        (console.error as jest.Mock) = jest.fn();
        (Product.countDocuments as jest.Mock) = jest.fn().mockReturnValue(0);

        (Product.find as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const result = await fetchProducts(
            0,
            6,
            null,
            null,
        );

        expect(result.error).toEqual(mockError);
        expect(result.productList).toBeNull();
    });
});
