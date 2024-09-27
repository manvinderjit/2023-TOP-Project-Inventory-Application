import { jest } from '@jest/globals';
import Promo from '../../../src/models/promoModel';
import { fetchCarouselPromos } from '../../../src/api/services/promos.services';
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';

interface Promos {
     caption: { 
        heading: string; 
        description: string; 
    }; 
    name: string;
    category: string; 
    imageUrl: string; 
    url: string; 
    id: null; 
}[];

describe("Promos", () =>{
    beforeAll(async () => {
        (await connectDB()).ConnectionStates.connected === 1;
    });

    afterAll((done) => {
        Shutdown(done);
    });

    afterAll(
        async () => (await connectDB()).ConnectionStates.disconnected === 0,
    );

    it('should return active carousel promos when they exist', async () => {
        const req: any = {};
        const res: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();

        const mockPromos = [
            {
                caption: {
                    heading: 'Cyber Monday Promo',
                    description: 'Cyber Monday Promo',
                },
                name: 'Cyber Monday Promo',
                category: 'Carousel',
                imageUrl: 'promos/carousel/cyber-monday-promo.jpg',
                url: '/promos/undefined',
                id: null,
            },
            {
                caption: {
                    heading: 'Laptops Available',
                    description: 'Laptops Available',
                },
                name: 'Laptops Available',
                category: 'Carousel',
                imageUrl: 'promos/carousel/laptops-available.jpg',
                url: '/promos/undefined',
                id: null,
            },
            {
                caption: {
                    heading: 'Lunar New Year Sale',
                    description:
                        'Lunar New Year Sale with significant discounts.',
                },
                name: 'Lunar New Year Sale',
                category: 'Carousel',
                imageUrl: 'promos/carousel/lunar-new-year-sale.jpg',
                url: '/promos/undefined',
                id: null,
            },
            {
                caption: {
                    heading: 'Storage Devices',
                    description: 'Storage Devices for All Use Cases',
                },
                name: 'Storage Devices',
                category: 'Carousel',
                imageUrl: 'promos/carousel/storage-devices.png',
                url: '/promos/undefined',
                id: null,
            },
        ];

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromos),
        });

        await fetchCarouselPromos(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ carouselPromos: mockPromos });
    });

    it('should return 400 error when no carousel promos found', async () => {
        const req: any = {};
        const res: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();

        (Promo.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await fetchCarouselPromos(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: 'No Promos to Show!',
        });
    });

    // Handle database connection failure
    it('should handle database connection failure', async () => {
        const req: any = {};
        const res: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();

        (Promo.find as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error('Database connection failure');
        });

        await fetchCarouselPromos(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: 'Something went wrong!',
        });
        expect(next).toHaveBeenCalled();
    });
});
