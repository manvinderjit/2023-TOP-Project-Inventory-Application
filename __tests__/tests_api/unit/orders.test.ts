import { jest } from '@jest/globals';
import { getUserOrders } from '../../../src/api/controllers/orders.api.controllers';
import Order from '../../../src/models/ordersModel';

const dataMockOrders = [
    {
        _id: '65e776668ab602638976d41f',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653c5786811a24a8761b73b6',
                itemQuantity: 1,
                itemPrice: 310.1,
                _id: '653c5786811a24a8761b73b6',
                id: '653c5786811a24a8761b73b6',
                itemDetails: {
                    _id: '653c5786811a24a8761b73b6',
                    name: 'AOC 27G2SP Monitor',
                    description:
                        'This is a 165Hz version of AOC Gaming monitor',
                    imageFilename: 'aoc-27g2sp-monitor.jpg',
                    url: '/products/653c5786811a24a8761b73b6',
                    id: '653c5786811a24a8761b73b6',
                },
            },
            {
                itemId: '65ab113a23afb3b699a1aba9',
                itemQuantity: 2,
                itemPrice: 25,
                _id: '65ab113a23afb3b699a1aba9',
                id: '65ab113a23afb3b699a1aba9',
                itemDetails: {
                    _id: '65ab113a23afb3b699a1aba9',
                    name: 'CM CK790RGB Keyboard',
                    description: 'RGB version of 2024 Cooler Master keyboard',
                    imageFilename: 'cm-ck790rgb-keyboard.jpg',
                    url: '/products/65ab113a23afb3b699a1aba9',
                    id: '65ab113a23afb3b699a1aba9',
                },
            },
        ],
        totalAmount: '360.10',
        status: 'Refunded',
        createdAt: '2024-03-05',
        updatedAt: '2024-11-01',
        __v: 0,
        url: '/orders/65e776668ab602638976d41f',
        id: '65e776668ab602638976d41f',
    },
    {
        _id: '65e773c28ab602638976d2a4',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653c5786811a24a8761b73b6',
                itemQuantity: 1,
                itemPrice: 310.1,
                _id: '653c5786811a24a8761b73b6',
                id: '653c5786811a24a8761b73b6',
                itemDetails: {
                    _id: '653c5786811a24a8761b73b6',
                    name: 'AOC 27G2SP Monitor',
                    description:
                        'This is a 165Hz version of AOC Gaming monitor',
                    imageFilename: 'aoc-27g2sp-monitor.jpg',
                    url: '/products/653c5786811a24a8761b73b6',
                    id: '653c5786811a24a8761b73b6',
                },
            },
            {
                itemId: '653c63f3af869615c64a531d',
                itemQuantity: 1,
                itemPrice: 300,
                _id: '653c63f3af869615c64a531d',
                id: '653c63f3af869615c64a531d',
                itemDetails: {
                    _id: '653c63f3af869615c64a531d',
                    name: 'ASUS PD718A',
                    description: 'Asus 240Hz Gaming Monitor',
                    imageFilename: 'asus-pd718a.jpg',
                    url: '/products/653c63f3af869615c64a531d',
                    id: '653c63f3af869615c64a531d',
                },
            },
        ],
        totalAmount: '610.10',
        status: 'Ordered',
        createdAt: '2024-03-05',
        updatedAt: '2024-03-05',
        __v: 0,
        url: '/orders/65e773c28ab602638976d2a4',
        id: '65e773c28ab602638976d2a4',
    },
    {
        _id: '65e56b01d305ecb31080cfee',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 1,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653c5786811a24a8761b73b6',
                itemQuantity: 1,
                itemPrice: 310.1,
                _id: '653c5786811a24a8761b73b6',
                id: '653c5786811a24a8761b73b6',
                itemDetails: {
                    _id: '653c5786811a24a8761b73b6',
                    name: 'AOC 27G2SP Monitor',
                    description:
                        'This is a 165Hz version of AOC Gaming monitor',
                    imageFilename: 'aoc-27g2sp-monitor.jpg',
                    url: '/products/653c5786811a24a8761b73b6',
                    id: '653c5786811a24a8761b73b6',
                },
            },
            {
                itemId: '653c63f3af869615c64a531d',
                itemQuantity: 1,
                itemPrice: 300,
                _id: '653c63f3af869615c64a531d',
                id: '653c63f3af869615c64a531d',
                itemDetails: {
                    _id: '653c63f3af869615c64a531d',
                    name: 'ASUS PD718A',
                    description: 'Asus 240Hz Gaming Monitor',
                    imageFilename: 'asus-pd718a.jpg',
                    url: '/products/653c63f3af869615c64a531d',
                    id: '653c63f3af869615c64a531d',
                },
            },
        ],
        totalAmount: '860.10',
        status: 'Processed',
        createdAt: '2024-03-04',
        updatedAt: '2024-03-04',
        __v: 0,
        url: '/orders/65e56b01d305ecb31080cfee',
        id: '65e56b01d305ecb31080cfee',
    },
    {
        _id: '65e520b93658be09b30974ca',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 1,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653cab978823cd95ec683e2e',
                itemQuantity: 1,
                itemPrice: 70,
                _id: '653cab978823cd95ec683e2e',
                id: '653cab978823cd95ec683e2e',
                itemDetails: {
                    _id: '653cab978823cd95ec683e2e',
                    name: 'Cooler Master MK450',
                    description: 'RGB Gaming Keyboard from Cooler Master',
                    imageFilename: 'cooler-master-mk450.jpg',
                    url: '/products/653cab978823cd95ec683e2e',
                    id: '653cab978823cd95ec683e2e',
                },
            },
        ],
        totalAmount: '320.00',
        status: 'Ordered',
        createdAt: '2024-03-03',
        updatedAt: '2024-03-03',
        __v: 0,
        url: '/orders/65e520b93658be09b30974ca',
        id: '65e520b93658be09b30974ca',
    },
    {
        _id: '65e516b0d65457631a9683be',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '65cea4a2b9d6ae606013be23',
                itemQuantity: 2,
                itemPrice: 300,
                _id: '65cea4a2b9d6ae606013be23',
                id: '65cea4a2b9d6ae606013be23',
                itemDetails: {
                    _id: '65cea4a2b9d6ae606013be23',
                    name: 'ABC 27G2SP Monitor',
                    description: 'ABC 27G2SP Monitor',
                    imageFilename: 'abc-27g2sp-monitor.jpg',
                    url: '/products/65cea4a2b9d6ae606013be23',
                    id: '65cea4a2b9d6ae606013be23',
                },
            },
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 2,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
        ],
        totalAmount: '1100.00',
        status: 'Ordered',
        createdAt: '2024-03-03',
        updatedAt: '2024-03-03',
        __v: 0,
        url: '/orders/65e516b0d65457631a9683be',
        id: '65e516b0d65457631a9683be',
    },
    {
        _id: '65e4cf56782d9cddad45d4b5',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '65cea4a2b9d6ae606013be23',
                itemQuantity: 2,
                itemPrice: 300,
                _id: '65cea4a2b9d6ae606013be23',
                id: '65cea4a2b9d6ae606013be23',
                itemDetails: {
                    _id: '65cea4a2b9d6ae606013be23',
                    name: 'ABC 27G2SP Monitor',
                    description: 'ABC 27G2SP Monitor',
                    imageFilename: 'abc-27g2sp-monitor.jpg',
                    url: '/products/65cea4a2b9d6ae606013be23',
                    id: '65cea4a2b9d6ae606013be23',
                },
            },
        ],
        totalAmount: '600.00',
        status: 'Ordered',
        createdAt: '2024-03-03',
        updatedAt: '2024-03-03',
        __v: 0,
        url: '/orders/65e4cf56782d9cddad45d4b5',
        id: '65e4cf56782d9cddad45d4b5',
    },
    {
        _id: '6552f8bfca1d404c14ace86b',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653c5470189c20f1df257752',
                itemQuantity: 1,
                itemPrice: 9.99,
                _id: '653c5470189c20f1df257752',
                id: '653c5470189c20f1df257752',
                itemDetails: {
                    _id: '653c5470189c20f1df257752',
                    name: 'Victsing Keyboard',
                    description: 'Victsing keyboard for offices',
                    imageFilename: 'victsing-keyboard.jpg',
                    url: '/products/653c5470189c20f1df257752',
                    id: '653c5470189c20f1df257752',
                },
            },
        ],
        totalAmount: '9.99',
        status: 'Cancelled',
        createdAt: '2023-11-13',
        updatedAt: '2023-11-15',
        __v: 0,
        url: '/orders/6552f8bfca1d404c14ace86b',
        id: '6552f8bfca1d404c14ace86b',
    },
    {
        _id: '6552f86eca1d404c14ace7df',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b4cc0280eb66de86cd7a7',
                itemQuantity: 1,
                itemPrice: 49.99,
                _id: '653b4cc0280eb66de86cd7a7',
                id: '653b4cc0280eb66de86cd7a7',
                itemDetails: {
                    _id: '653b4cc0280eb66de86cd7a7',
                    name: 'Cooler Master MK350',
                    description: 'Cooler Master Gaming Keyboard',
                    imageFilename: 'cooler-master-mk350.jpg',
                    url: '/products/653b4cc0280eb66de86cd7a7',
                    id: '653b4cc0280eb66de86cd7a7',
                },
            },
        ],
        totalAmount: '49.99',
        status: 'Cancelled',
        createdAt: '2023-11-13',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/6552f86eca1d404c14ace7df',
        id: '6552f86eca1d404c14ace7df',
    },
    {
        _id: '6552f817ca1d404c14ace7bc',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 1,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
        ],
        totalAmount: '250.00',
        status: 'Cancelled',
        createdAt: '2023-11-13',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/6552f817ca1d404c14ace7bc',
        id: '6552f817ca1d404c14ace7bc',
    },
    {
        _id: '6552f7d8ca1d404c14ace7ad',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b3a46a988d78a3d073545',
                itemQuantity: 1,
                itemPrice: 600,
                _id: '653b3a46a988d78a3d073545',
                id: '653b3a46a988d78a3d073545',
                itemDetails: {
                    _id: '653b3a46a988d78a3d073545',
                    name: 'ASUS PG918',
                    description: 'Asus Gaming Monitor 360Hz.',
                    imageFilename: 'asus-pg918.jpg',
                    url: '/products/653b3a46a988d78a3d073545',
                    id: '653b3a46a988d78a3d073545',
                },
            },
        ],
        totalAmount: '600.00',
        status: 'Ordered',
        createdAt: '2023-11-13',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/6552f7d8ca1d404c14ace7ad',
        id: '6552f7d8ca1d404c14ace7ad',
    },
    {
        _id: '6552f74fca1d404c14ace770',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 2,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653b4cc0280eb66de86cd7a7',
                itemQuantity: 2,
                itemPrice: 49.99,
                _id: '653b4cc0280eb66de86cd7a7',
                id: '653b4cc0280eb66de86cd7a7',
                itemDetails: {
                    _id: '653b4cc0280eb66de86cd7a7',
                    name: 'Cooler Master MK350',
                    description: 'Cooler Master Gaming Keyboard',
                    imageFilename: 'cooler-master-mk350.jpg',
                    url: '/products/653b4cc0280eb66de86cd7a7',
                    id: '653b4cc0280eb66de86cd7a7',
                },
            },
        ],
        totalAmount: '599.98',
        status: 'Ordered',
        createdAt: '2023-11-13',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/6552f74fca1d404c14ace770',
        id: '6552f74fca1d404c14ace770',
    },
    {
        _id: '6552f5fa38b04dc9c9d89af8',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 2,
                itemPrice: 250,
                _id: '653b132b966fe37a29d33c28',
                id: '653b132b966fe37a29d33c28',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653b4cc0280eb66de86cd7a7',
                itemQuantity: 2,
                itemPrice: 49.99,
                _id: '653b4cc0280eb66de86cd7a7',
                id: '653b4cc0280eb66de86cd7a7',
                itemDetails: {
                    _id: '653b4cc0280eb66de86cd7a7',
                    name: 'Cooler Master MK350',
                    description: 'Cooler Master Gaming Keyboard',
                    imageFilename: 'cooler-master-mk350.jpg',
                    url: '/products/653b4cc0280eb66de86cd7a7',
                    id: '653b4cc0280eb66de86cd7a7',
                },
            },
        ],
        totalAmount: '599.98',
        status: 'Cancelled',
        createdAt: '2023-11-13',
        updatedAt: '2024-03-03',
        __v: 0,
        url: '/orders/6552f5fa38b04dc9c9d89af8',
        id: '6552f5fa38b04dc9c9d89af8',
    },
    {
        _id: '654d5a232d8e6fc692563ca6',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 2,
                itemPrice: 250,
                _id: '654d5a232d8e6fc692563ca7',
                id: '654d5a232d8e6fc692563ca7',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653c5786811a24a8761b73b6',
                itemQuantity: 1,
                itemPrice: 310.1,
                _id: '654d5a232d8e6fc692563ca8',
                id: '654d5a232d8e6fc692563ca8',
                itemDetails: {
                    _id: '653c5786811a24a8761b73b6',
                    name: 'AOC 27G2SP Monitor',
                    description:
                        'This is a 165Hz version of AOC Gaming monitor',
                    imageFilename: 'aoc-27g2sp-monitor.jpg',
                    url: '/products/653c5786811a24a8761b73b6',
                    id: '653c5786811a24a8761b73b6',
                },
            },
        ],
        totalAmount: '1120.20',
        status: 'Cancelled',
        createdAt: '2023-11-09',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/654d5a232d8e6fc692563ca6',
        id: '654d5a232d8e6fc692563ca6',
    },
    {
        _id: '654af6a8aec94b3bc0191de2',
        customerId: '654715c5941455dd27f32425',
        items: [
            {
                itemId: '653b132b966fe37a29d33c28',
                itemQuantity: 2,
                itemPrice: 250,
                _id: '654af6a8aec94b3bc0191de3',
                id: '654af6a8aec94b3bc0191de3',
                itemDetails: {
                    _id: '653b132b966fe37a29d33c28',
                    name: 'AOC 27G2 Monitor',
                    description: 'Monitor from AOC for gaming.',
                    imageFilename: 'aoc-27g2-monitor.jpg',
                    url: '/products/653b132b966fe37a29d33c28',
                    id: '653b132b966fe37a29d33c28',
                },
            },
            {
                itemId: '653c5786811a24a8761b73b6',
                itemQuantity: 1,
                itemPrice: 310.1,
                _id: '654af6a8aec94b3bc0191de4',
                id: '654af6a8aec94b3bc0191de4',
                itemDetails: {
                    _id: '653c5786811a24a8761b73b6',
                    name: 'AOC 27G2SP Monitor',
                    description:
                        'This is a 165Hz version of AOC Gaming monitor',
                    imageFilename: 'aoc-27g2sp-monitor.jpg',
                    url: '/products/653c5786811a24a8761b73b6',
                    id: '653c5786811a24a8761b73b6',
                },
            },
        ],
        totalAmount: '1120.20',
        status: 'Cancelled',
        createdAt: '2023-11-07',
        updatedAt: '2023-11-13',
        __v: 0,
        url: '/orders/654af6a8aec94b3bc0191de2',
        id: '654af6a8aec94b3bc0191de2',
    },
];

describe("GET User Orders", () => {
    it("should fetch users orders for a default with request with no page number", async () => {
        
        const req: any = {
            query: {},
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();
        
        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip:jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(dataMockOrders.slice(0, 7)),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(dataMockOrders.length);

        await getUserOrders(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Order.find).toHaveBeenCalled();
        expect(Order.countDocuments).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            ordersList: dataMockOrders.slice(0, 7),
            totalOrdersPages: 2,
        });
    });

    it('should fetch users orders when a page number is provided in the request', async () => {
        const req: any = {
            query: {
                page: '2',
            },
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(dataMockOrders.slice(7, 13)),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(dataMockOrders.length);

        await getUserOrders(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Order.find).toHaveBeenCalled();
        expect(Order.countDocuments).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            ordersList: dataMockOrders.slice(7, 13),
            totalOrdersPages: 2,
        });
    });

    it('should handle errors gracefully and render error messages when no orders exist for a user', async () => {
        const req: any = {
            query: {},
            userId: '654715c5941455dd27f32425',
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(null),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await getUserOrders(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Order.find).toHaveBeenCalled();
        expect(Order.countDocuments).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No Orders to Show!',
        });
    });

    it('should handle errors gracefully and render error messages when no user id exists', async () => {
        const req: any = {
            query: {},
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(null),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await getUserOrders(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Order.find).not.toHaveBeenCalled();
        expect(Order.countDocuments).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'You are not authorized to do that!',
        });
    });

    it('should handle errors gracefully and render error messages when a user id is empty', async () => {
        const req: any = {
            query: {
                userId: '',
            },
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next: any = jest.fn();

        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(null),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await getUserOrders(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(Order.find).not.toHaveBeenCalled();
        expect(Order.countDocuments).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'You are not authorized to do that!',
        });
    });

    it('should handle errors gracefully and render error messages when an unexpected error occurs', async () => {
        const req: any = {
            query: {},
        };
        const res: any = {
            json: jest.fn(),
            status: jest.fn().mockReturnValue(() => { throw new Error('')}),
        };
        const next: any = jest.fn();

        (Order.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(() => {throw new Error('')}),
        });

        (Order.countDocuments as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await getUserOrders(req, res, next);

        expect(next).toHaveBeenCalledWith(
            new TypeError('res.status(...).json is not a function'),
        );
        expect(Order.find).not.toHaveBeenCalled();
        expect(Order.countDocuments).not.toHaveBeenCalled();        
    });
});