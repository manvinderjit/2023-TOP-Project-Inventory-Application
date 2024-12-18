import { jest } from '@jest/globals';
import Promo from '../../src/models/promoModel';
import {
    getPromoDetails,
    getManagePromos,
    getCreatePromo,
    postCreatePromo,
    getEditPromo,
    postEditPromo,
    getDeletePromo,
    postDeletePromo,
    getEditPromoImage,
    postEditPromoImage,
} from '../../src/app/controllers/promos.app.controllers';
import { deletePromo, getPromoImageName, promoCategories } from '../../src/app/services/promos.app.services';
import fs, { unlink } from 'node:fs';
import { checkImageExists, deleteAppImage } from '../../src/app/services/image.app.services';
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

const s3Mock = mockClient(S3Client);

// jest.mock('../../src/app/services/promos.app.services');

// const getPromoImageNameMock: any = getPromoImageName as jest.Mock;

// jest.mock('../../../src/app/services/promos.app.services', () => ({
//     __esModule: true, // this property makes it work
//     getPromoImageName: jest.fn().mockReturnValue(mockPromoDetails.imageFilename),
// }));
// jest.mock('../../../src/app/services/image.app.services', () => ({
//         __esModule: true,
//     checkImageExists: jest.fn().mockReturnValue(true),
//     deleteAppImage: jest.fn().mockReturnValue(true),
// }));
// jest.unstable_mockModule(
//     '../../../src/app/services/promos.app.services',
//     () => ({
//         checkImageExists: jest.fn().mockReturnValue(true),
//         deleteAppImage: jest.fn().mockReturnValue(true),
//         // etc.
//     }),
// );

// const f1 = jest.spyOn({ getPromoImageName }, 'getPromoImageName').mockResolvedValue(mockPromoDetails.imageFilename);

// const f2 = jest.spyOn({ checkImageExists }, 'checkImageExists').mockResolvedValue(true);

// const f3 = jest.spyOn({ deleteAppImage }, 'deleteAppImage').mockResolvedValue(true);

// const f4 = jest.spyOn({ deletePromo }, 'deletePromo').mockImplementation((id:any) => id);

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

const mockCreatePromo = {
    promoName: 'Dummy Promo',
    promoCaption: 'Dummy Promo Caption',
    promoDescription: 'Dummy Promo Description',
    promoCategory: '1',
    promoStatus: 'Active',
    promoStartDate: '2024-10-15',
    promoEndDate: '2024-10-31',
};

const mockPromoDetails = {
  caption: {
    heading: 'Accessories and Peripherals',
    description: 'Find accessories and peripherals for your computing requirements'
  },
  _id: '657fc0d54055729bfa20fb1e',
  name: 'All dummy',
  category: 'Carousel',
  imageUrl: 'promos/image/all-dummy.jpg',
  status: 'Active',
  startsOn: '2024-02-23T00:00:00.000Z',
  endsOn: '2024-02-28T00:00:00.000Z',
  createdAt:'2023-12-18T03:47:33.155Z',
  updatedAt:'2024-02-20T19:14:02.663Z',
  imageFilename: 'all-dummy.jpg'
}
// const mockPromoImage: {
//     name: 'red-podium-with-gift-shopping-bag-gold-coin-chinese-new-year-sale-banner-3d-background.jpg',
//     data: `<Buffer ff d8 ff e1 10 84 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 09 01 0e 00 02 00 00 00 5b 00 00 00 7a 01 12 00 03 00 00 00 01 00 01 00 00 01 1a 00 05 ... 3883249 more bytes>`,
//     size: 3883299,
//     encoding: '7bit',
//     tempFilePath: '',
//     truncated: false,
//     mimetype: 'image/jpeg',
//     md5: 'd4d1e2d843497b07cf37752f4cd5554e',
//     mv: jest.fn(),
// };

describe('Manage Promos View', () => {
    it('should render Manage Promos view when promos exist and no category is provided', async () => {
        const req: any = {
            body:{}
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
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
                user: 'user@abc.com',
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
                user: 'user@abc.com',
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
                user: 'user@abc.com',
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

describe('GET Promo View', () => {
    it('should render Promo View with the details of a promo', async () => {
        const req: any = {
            params: {
                id: mockPromos[0]._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromos[0]),
        });

        await getPromoDetails(req, res);

        expect(Promo.findById).toHaveBeenCalledWith(mockPromos[0]._id);

        expect(res.render).toHaveBeenCalledWith('promoView', {
            title: 'Promo Details',
            username: res.locals.user,
            promoDetails: mockPromos[0],
        });
    });

    it('should handle error gracefull and render error messages when an invalid promo Id is provided', async () => {
        const req: any = {
            params: {
                id: 'Invalid Id',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromos[0]),
        });

        await getPromoDetails(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('promoView', {
            title: 'Promo Details: Error',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided'),
        });
    });

    it('should handle error gracefull and render error messages when a promo Id is not provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromos[0]),
        });

        await getPromoDetails(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('promoView', {
            title: 'Promo Details: Error',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided'),
        });
    });

    it('should handle error gracefull and render error messages when promo details are not found', async () => {
        const req: any = {
            params: {
                id: mockPromos[0]._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getPromoDetails(req, res);

        expect(Promo.findById).toHaveBeenCalledWith(mockPromos[0]._id);

        expect(res.render).toHaveBeenCalledWith('promoView', {
            title: 'Promo Details: Error',
            username: res.locals.user,
            error: new Error('Promo not found!'),
        });
    });
});

describe('GET Create Promo View', () => {
    it("should render the Create Promo View", async() => {
        const req: any = {};

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        await getCreatePromo(req, res);

        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            promoName: '',
            promoCaption: '',
            promoDescription: '',
            promoCategoryList: promoCategories,
            selectedPromoCategory: null,
        });
    });

    it('should hander error gracefully in a Create Promo View', async () => {
        const req: any = {};

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        jest.spyOn(res, 'render').mockImplementationOnce(() => {
            throw new Error('Test Error');
        });

        await getCreatePromo(req, res);

        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: new Error('Test Error'),
            selectedPromoCategory: null,
            promoCategoryList: promoCategories,
        });
    });
});

describe("POST Create Promo", () => {

    beforeEach(() => s3Mock.reset());

    it("should create a promo and render success message when all details are provided", async () => {
        const req: any = {
            body: mockCreatePromo,
            files: {
                promoImage: {
                    name: 'image.png',
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        s3Mock.on(PutObjectCommand).resolvesOnce({});

        (Promo.create as jest.Mock) = jest.fn().mockReturnValueOnce(mockCreatePromo);

        await postCreatePromo(req, res);

        expect(res.render).toHaveBeenCalled();
        expect(Promo.create).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            success: 'Promo Created!',
            promoName: '',
            promoCaption: '',
            promoDescription: '',
            promoStatus: '',
            promoStartDate: '',
            promoEndDate: '',
            selectedPromoCategory: null,
            promoCategoryList: promoCategories,
        });
    });

    it('should hander error gracefully and render error messages when a file is not uploaded', async () => {
        const req: any = {
            body: mockCreatePromo,
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        (Promo.create as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockCreatePromo);

        await postCreatePromo(req, res);

        expect(Promo.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: new Error('No file was uploaded!'),
            // TODO: Pass following field values
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    });

    it('should hander error gracefully and render error messages when fields are missing', async () => {
        const req: any = {
            body: {},
            files: {
                promoImage: {
                    name: 'image.png',
                    mv: jest.fn((path, callback: any) => callback(null)),
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        (Promo.create as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockCreatePromo);

        await postCreatePromo(req, res);

        expect(Promo.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: new Error(
                'Please check  promoName, promoCaption, promoDescription, promoCategory, promoStatus, promoStartDate, promoEndDate',
            ),
            // TODO: Pass following field values
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    });

    it('should hander error gracefully and render error messages when fields are invalid', async () => {
        const req: any = {
            body: {
                promoName: 'Du',
                promoCaption:
                    'Dummy Promo Caption That is too long and will trigger an invalid field error',
                promoDescription: 'A',
                promoCategory: 'Invalid',
                promoStatus: 'Invalid',
                promoStartDate: 'Not A Date',
                promoEndDate: '20241031',
            },
            files: {
                promoImage: {
                    name: 'image.png',
                    mv: jest.fn((path, callback: any) => callback(null)),
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        (Promo.create as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockCreatePromo);

        await postCreatePromo(req, res);

        expect(Promo.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: new Error(
                'Please check  promoName, promoCaption, promoDescription, promoCategory, promoStatus, promoStartDate, promoEndDate',
            ),
            // TODO: Pass following field values
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    });

    it("should handle errors gracefully and render error message when file upload fails", async () => {
        const req: any = {
            body: mockCreatePromo,
            files: {
                promoImage: {
                    name: 'image.png',
                    // mv: jest.fn((path, callback: any) => callback(new Error('Upload failed'))),
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        s3Mock.on(PutObjectCommand).rejectsOnce('Upload failed!');

        (Promo.create as jest.Mock) = jest.fn().mockReturnValueOnce(mockCreatePromo);

        await postCreatePromo(req, res);
        
        expect(Promo.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: new Error('Upload failed!'),
            // TODO: Pass following field values
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    });

    it("should handle errors gracefully and render error message when Promo Creation fails", async () => {
        const req: any = {
            body: mockCreatePromo,
            files: {
                promoImage: {
                    name: 'image.png',
                    // mv: jest.fn((path, callback: any) => callback(null)),
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        s3Mock.on(PutObjectCommand).resolvesOnce({});

        (Promo.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        // jest.spyOn({ unlink }, 'unlink').mockImplementationOnce(
        //     (path, callback) => callback(null),
        // );

        await postCreatePromo(req, res);
        
        expect(res.render).toHaveBeenCalledWith('promoCreate', {
            title: 'Create Promo',
            username: res.locals.user,
            error: 'Promo creation failed!',
            promoName: req.body.promoName,
            promoCaption: req.body.promoCaption,
            promoDescription: req.body.promoDescription,
            promoStatus: req.body.promoStatus,
            promoStartDate: req.body.promoStartDate,
            promoEndDate: req.body.promoEndDate,
            selectedPromoCategory: req.body.promoCategory,
            promoCategoryList: promoCategories,
        });
    });

    // it("should handle errors gracefully and render error message when file deletion error occurs", async () => {
    //     const req: any = {
    //         body: mockCreatePromo,
    //         files: {
    //             promoImage: {
    //                 name: 'image.png',
    //                 mv: jest.fn((path, callback: any) => callback(null)),
    //             },
    //         },
    //     };

    //     const res: any = {
    //         render: jest.fn(),
    //         locals: {
    //             user: 'user@abc.com',
    //         },
    //     };

    //     (Promo.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

    //     // jest.mock('fs');

    //     // jest.mock('fs');
    //     // fs.unlink.mockImplementation(
    //     //     (path, callback) => callback(new Error('File deletion failed')),
    //     // );
    //     // jest.spyOn({ unlink }, 'unlink').mockImplementation(
    //     //     (path, callback) => {
    //     //         console.log('+++++++++++')
    //     //         callback(new Error('File deletion failed'))},
    //     // );
    //     (unlink as unknown as jest.Mock) = jest.fn().mockImplementation((path, callback: any) => callback(new Error('File not found')));

    //     // (unlink as jest.fn).mockRejectedValueOnce(new Error('File not found'));

    //     // (unlink as unknown as jest.Mock) = jest.fn().mockImplementation((p, cb: any) => 
    //     //     cb(new Error('File not found'))
    //     // ); // Mocking an error
    //     //  = jest.fn().mockImplementationOnce((path, cb: any) => cb(new Error('File not found'))); // Mocking an error

    //     await postCreatePromo(req, res);

    //     expect(req.files.promoImage.mv).toHaveBeenCalled();
    //     expect(res.render).toHaveBeenCalledWith('promoCreate', {
    //         title: 'Create Promo',
    //         username: res.locals.user,
    //         error: new Error('Promo creation failed!'),
    //         promoName: req.body.promoName,
    //         promoCaption: req.body.promoCaption,
    //         promoDescription: req.body.promoDescription,
    //         promoStatus: req.body.promoStatus,
    //         promoStartDate: req.body.promoStartDate,
    //         promoEndDate: req.body.promoEndDate,
    //         selectedPromoCategory: req.body.promoCategory,
    //         promoCategoryList: promoCategories,
    //     });
    // });
});

describe('GET Edit Promo View', () => {
    it('should render the Edit Promo View', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            }
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await getEditPromo(req, res);

        expect(Promo.findById).toHaveBeenCalledWith(mockPromoDetails._id);
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            promoDetails: mockPromoDetails,            
            promoUrl: `/promos/${mockPromoDetails._id}`,
            promoCategoryList: promoCategories,
        });
    });

    it('should hander error gracefully in the Edit Promo View when a promo Id is not provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await getEditPromo(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error('Invalid Promo ID provided!'),
        });
    });

    it('should hander error gracefully in the Edit Promo View when an invalid promo Id is provided', async () => {
        const req: any = {
            params: { id: 'Invalid Id'},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await getEditPromo(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error('Invalid Promo ID provided!'),
        });
    });
    
    it('should hander error gracefully in the Edit Promo View when promo details are not found', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getEditPromo(req, res);

        expect(Promo.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error('Promo not found!'),
        });
    });
});

describe('POST Edit Promo View', () => {
    it('should update promo details and redirect to the Promo Page after successfully updating Promo data', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id },
            body: {
                promoId: mockPromoDetails._id,
                promoName: mockPromoDetails.name,
                promoCaption: mockPromoDetails.caption.heading,
                promoDescription: mockPromoDetails.caption.description,
                promoStatus: mockPromoDetails.status,
                promoStartDate: mockPromoDetails.startsOn,
                promoEndDate: mockPromoDetails.endsOn,
                promoCategory: '1',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postEditPromo(req, res);

        expect(res.render).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(`/promos/${mockPromoDetails._id}`);
    });

    it('should handle error gracefully and display error message when promo update fails due to db error', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id },
            body: {
                promoId: mockPromoDetails._id,
                promoName: mockPromoDetails.name,
                promoCaption: mockPromoDetails.caption.heading,
                promoDescription: mockPromoDetails.caption.description,
                promoStatus: mockPromoDetails.status,
                promoStartDate: mockPromoDetails.startsOn,
                promoEndDate: mockPromoDetails.endsOn,
                promoCategory: '1',
                promoImageName: mockPromoDetails.imageFilename,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postEditPromo(req, res);

        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error ('Promo Update Failed!'),
            promoDetails: {
                caption: {
                    description: req.body.promoDescription,
                    heading: req.body.promoCaption,
                },
                category: mockPromoDetails.category,
                endsOn: req.body.promoEndDate,
                id: req.body.promoId,                
                name: req.body.promoName,
                startsOn: req.body.promoStartDate,
                status: req.body.promoStatus,
                imageFilename: req.body.promoImageName
            },
            promoUrl: `/promos/${req.body.promoId}`,
            promoCategoryList: promoCategories,
        });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should hander error gracefully in the POST Edit Promo when a promo Id is not provided', async () => {
        const req: any = {
            params: {},
            body: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postEditPromo(req, res);

        expect(Promo.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error('Invalid Promo ID provided!'),
        });
    });

    it('should hander error gracefully in the POST Edit Promo when an invalid promo Id is provided', async () => {
        const req: any = {
            params: { id: 'Invalid Promo Id' },
            body: { promoId: 'Invalid Promo Id' },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postEditPromo(req, res);

        expect(Promo.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error('Invalid Promo ID provided!'),
        });
    });

    it('should hander error gracefully and render error messages in the POST Edit Promo when fields are missing', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id },
            body: { 
                promoId: mockPromoDetails._id
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postEditPromo(req, res);

        expect(Promo.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error(
                'Please check  promoName, promoCaption, promoDescription, promoCategory, promoStatus, promoStartDate, promoEndDate',
            ),
            promoCategoryList: promoCategories,
            promoDetails: {
                id: req.body?.promoId,
                name: req.body?.promoName,
                caption: {
                    heading: req.body?.promoCaption,
                    description: req.body?.promoDescription,
                },
                status: req.body?.promoStatus,
                startsOn: req.body?.promoStartDate,
                endsOn: req.body?.promoEndDate,
                category: promoCategories[req.body?.promoCategory - 1]?.name,
                imageFilename: req.body?.promoImageName,
            },
            promoUrl: `/promos/${req.body.promoId}`,
        });
    });

    it('should hander error gracefully and render error messages in the POST Edit Promo when fields are invalid', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id },
            body: {
                promoId: mockPromoDetails._id,
                promoName: 'a     ',
                promoCaption: 'a      ',
                promoDescription: 'a     ',
                promoStatus: ' a    ',
                promoStartDate: 'a     ',
                promoEndDate: '  a   ',
                promoCategory: 'a',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postEditPromo(req, res);

        expect(Promo.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoEdit', {
            title: 'Promo Edit',
            username: res.locals.user,
            error: new Error(
                'Please check  promoName, promoCaption, promoDescription, promoCategory, promoStatus, promoStartDate, promoEndDate',
            ),
            promoCategoryList: promoCategories,
            promoDetails: {
                id: req.body?.promoId,
                name: req.body?.promoName,
                caption: {
                    heading: req.body?.promoCaption,
                    description: req.body?.promoDescription,
                },
                status: req.body?.promoStatus,
                startsOn: req.body?.promoStartDate,
                endsOn: req.body?.promoEndDate,
                category: promoCategories[req.body?.promoCategory - 1]?.name,
                imageFilename: req.body?.promoImageName,
            },
            promoUrl: `/promos/${req.body.promoId}`,
        });
    });
});

describe('GET Delete Promo View', () => {
    it('should render the Delete Promo View', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            }
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await getDeletePromo(req, res);

        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            promoDetails: mockPromoDetails,
        });
    });

    it('should hander error gracefully in a Delete Promo View when an invalid promo Id is passed', async () => {
        const req: any = {
            params:{}
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce(mockPromoDetails);

        await getDeletePromo(req, res);
        
        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should hander error gracefully in a Delete Promo View when an invalid promo Id is passed', async () => {
        const req: any = {
            params: {
                id: 'Invalid Id'
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await getDeletePromo(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should handle error gracefully in a Delete Promo View when promo details are not found', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getDeletePromo(req, res);

        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: new Error('Promo not found!')
        });
    });
});

describe('POST Delete Promo', () => {

    beforeEach(() => s3Mock.reset());

    it('should be able to Delete Promo and redirect to the Manage Promos page', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        // const f1 = jest.spyOn({ getPromoImageName }, 'getPromoImageName').mockResolvedValue(mockPromoDetails.imageFilename);

        // const f2 = jest.spyOn({ checkImageExists }, 'checkImageExists').mockResolvedValue(true);

        // const f3 = jest.spyOn({ deleteAppImage }, 'deleteAppImage').mockResolvedValue(true);

        // const f4 = jest.spyOn({ deletePromo }, 'deletePromo').mockResolvedValue(req.params.id);
        // (deleteAppImage as jest.Mock).mockReturnValue(true);

        // type GetPromoImageName = () => Promise<string | null | undefined>;

        // const mock = jest.spyOn(getPromoImageName, 'getPromoImageName');
        // mock.mockImplementation(() => Promise.resolve({ data: {} }));

        // getPromoImageNameMock.mockResolvedValue(mockPromoDetails.imageFilename);
        //     // jest.fn() as jest.MockedFunction<GetPromoImageName>;

        // // Now you can mock its resolved value
        // // (getPromoImageName as jest.Mock).mockReturnValue('image.png');
        // // (getPromoImageName as jest.Mock).mockResolvedValue(mockPromoDetails.imageFilename);
        // jest.mock('../../../src/app/services/image.app.services', () => ({
        //     checkImageExists: jest.fn().mockReturnValue(true),
        //     deleteAppImage: jest.fn().mockReturnValue(true),
        // }));

        // const dbSpy = jest
        //     .spyOn(
        //         require('../../../src/app/services/image.app.services'),
        //         'checkImageExists',
        //     )
        //     .mockImplementation(() => true);

        s3Mock.on(DeleteObjectCommand).resolvesOnce({});

        (Promo.findByIdAndDelete as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postDeletePromo(req, res);
        // expect(dbSpy).toHaveBeenCalledWith(mockPromoDetails.imageFilename);
        // expect(f1).toHaveBeenCalledWith(mockPromoDetails.imageFilename);
        // expect(f2).toHaveBeenCalledWith(mockPromoDetails.imageFilename);
        expect(res.redirect).toHaveBeenCalledWith('/promos');
    });

    // Invalid promo ID results in an error
    it('should render error messages when invalid promo ID is provided', async () => {
        const req: any = {
            params: { id: 'invalidMongoObjectId' },
        };
        const res: any = {
            redirect: jest.fn(),
            render: jest.fn(),
            locals: { user: 'testUser' },
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        (Promo.findByIdAndDelete as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mockPromoDetails);

        await postDeletePromo(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(Promo.findByIdAndDelete).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    // Invalid promo ID results in an error
    it('should render error messages when deletion fails', async () => {
        const req: any = {
            params: { id: mockPromoDetails._id },
        };
        const res: any = {
            redirect: jest.fn(),
            render: jest.fn(),
            locals: { user: 'testUser' },
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        (Promo.findByIdAndDelete as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        s3Mock.on(DeleteObjectCommand).resolvesOnce({});

        await postDeletePromo(req, res);

        // expect(Promo.findById).toHaveBeenCalledWith(req.params.id);
        expect(Promo.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);

        expect(res.render).toHaveBeenCalledWith('promoDelete', {
            title: 'Promo Delete',
            username: res.locals.user,
            error: new Error('Deletion Failed!'),
        });
    });
});

describe('GET Edit Promo Image', () => {
    it('should render the Edit Promo Image view when a valid id is provided', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            }
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await getEditPromoImage(req, res);

        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            promoData: { 
                promoName: mockPromoDetails.name,
                promoImage: mockPromoDetails.imageFilename,
                promoCaption: mockPromoDetails.caption?.heading,
                promoDescription: mockPromoDetails.caption?.description,
                promoUrl: `/promos/${mockPromoDetails._id}`,
            }
        });
    });

    it('should render the error messages on Edit Promo Image view when no promo id is provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await getEditPromoImage(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should render the error messages on Edit Promo Image view when an invalid id is provided', async () => {
        const req: any = {
            params: {
                id: 'invalid id',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await getEditPromoImage(req, res);
        
        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should render the error messages on Edit Promo Image view when a promo is not found', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getEditPromoImage(req, res);
        
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('Promo not found!'),
        });
    });
});


describe('POST Edit Promo Image', () => {

    beforeEach(() => {
        s3Mock.reset();
    });

    it('should update the promo image and redirect succesfully', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
            files: {
                promoImage: {
                    name: 'image.png',
                },
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        s3Mock.on(PutObjectCommand).resolvesOnce({});

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await postEditPromoImage(req, res);
        expect(res.redirect).toHaveBeenCalledWith(
            `/promos/${req.params.id}/edit/image`,
        );
    });

    it('should render the error messages on POST Edit Promo Image when no promo id is provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await postEditPromoImage(req, res);
        
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should render the error messages on POST Edit Promo Image when an invalid id is provided', async () => {
        const req: any = {
            params: {
                id: 'invalid id',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await postEditPromoImage(req, res);

        expect(Promo.findById).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('Invalid promo ID provided!'),
        });
    });

    it('should render the error messages on POST Edit Promo Image when no image file is provided', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockPromoDetails),
        });

        await postEditPromoImage(req, res);
        
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('No image uploaded!'),
            promoData: {
                promoName: mockPromoDetails.name,
                promoImage: mockPromoDetails.imageFilename,
                promoCaption: mockPromoDetails.caption?.heading,
                promoDescription: mockPromoDetails.caption?.description,
                promoUrl: `/promos/${mockPromoDetails._id}`,
            },
        });
    });

    it('should render the error if it does not find promo details while uploading file', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
            files: {
                promoImage: {
                    name: 'image.png',
                    mv: jest.fn((path, callback: any) => callback(null)),
                },
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await postEditPromoImage(req, res);
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('File upload failed!'),            
        });
    });

    it('should render the error if it fails to upload file', async () => {
        const req: any = {
            params: {
                id: mockPromoDetails._id,
            },
            files: {
                promoImage: {
                    name: 'image.png',
                },
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        s3Mock.on(PutObjectCommand).rejectsOnce();

        (Promo.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await postEditPromoImage(req, res);
        expect(res.render).toHaveBeenCalledWith('promoImageEdit', {
            title: 'Promo Edit Image',
            username: res.locals.user,
            error: new Error('File upload failed!'),
        });
    });
});
