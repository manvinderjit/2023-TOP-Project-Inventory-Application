import { jest } from '@jest/globals';
import Product from '../../../src/models/productModel';
import Category from '../../../src/models/categoryModel';
import { getManageProducts } from '../../../src/app/controllers/products.app.controllers';
import { getProductDetails } from '../../../src/app/controllers/products.app.controllers';

const dataMockCategories = [
    {
        _id: '652624671853eb7ecdacd6b8',
        name: 'Computer Keyboards',
        description: 'Different types of computer keyboards.',
    },
    {
        _id: '651f74b0df4699212c8abacb',
        name: 'Monitors',
        description: 'Different types of monitors.',
    },
    {
        _id: '6534680c8a7ce6a6af7f9cb9',
        name: 'Mouse',
        description: 'Different types of computer mice.',
    },
];

const dataMockProducts = [
    {
        _id: '65cea4a2b9d6ae606013be23',
        name: 'ABC 27G2SP Monitor',
        description: 'ABC 27G2SP Monitor',
        imageUrl: 'api/images/products/abc-27g2sp-monitor.jpg',
        imageFilename: 'abc-27g2sp-monitor.jpg',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
        },
        price: 30000,
        stock: 20,
    },
    {
        _id: '653c63f3af869615c64a531d',
        name: 'ASUS PD718A',
        description: 'Asus 240Hz Gaming Monitor',
        category: {
            _id: '651f74b0df4699212c8abacb',
            name: 'Monitors',
        },
        price: 30000,
        stock: 20,
        imageFilename: 'asus-pd718a.jpg',
    },
    {
        _id: '65aad4f450de8f03e5c94620',
        name: 'CM CK750 Keyboard',
        description: 'This is cooler masters 2024 keyboard CK750.',
        imageUrl: 'api/images/products/cm-ck750-keyboard.png',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
        },
        price: 1000,
        stock: 30,
        imageFilename: 'cm-ck750-keyboard.jpg',
    },
    {
        _id: '65ab113a23afb3b699a1aba9',
        name: 'CM CK790RGB Keyboard',
        description: 'RGB version of 2024 Cooler Master keyboard',
        imageUrl: 'api/images/products/cm-ck790rgb-keyboard.png',
        imageFilename: 'cm-ck790rgb-keyboard.jpg',
        category: {
            _id: '652624671853eb7ecdacd6b8',
            name: 'Computer Keyboards',
        },
        price: 2500,
        stock: 23,
    },
];

describe('Manage Products View', () => {
    it('should render the Manage Products view with all the fetched products', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockProducts),
        });

        await getManageProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('products', {
            title: 'All Products',
            username: res.locals.user,
            allProductsList: dataMockProducts,
            categoryList: dataMockCategories,
            selectedCategory: req.body.productCategory,
        });
    });

    it('should render the Manage Products view with all products from a category specified in the body', async () => {

        const expectedProductData = [
            {
                _id: '65aad4f450de8f03e5c94620',
                name: 'CM CK750 Keyboard',
                description: 'This is cooler masters 2024 keyboard CK750.',
                imageUrl: 'api/images/products/cm-ck750-keyboard.png',
                category: {
                    _id: '652624671853eb7ecdacd6b8',
                    name: 'Computer Keyboards',
                },
                price: 1000,
                stock: 30,
                imageFilename: 'cm-ck750-keyboard.jpg',
            },
            {
                _id: '65ab113a23afb3b699a1aba9',
                name: 'CM CK790RGB Keyboard',
                description: 'RGB version of 2024 Cooler Master keyboard',
                imageUrl: 'api/images/products/cm-ck790rgb-keyboard.png',
                imageFilename: 'cm-ck790rgb-keyboard.jpg',
                category: {
                    _id: '652624671853eb7ecdacd6b8',
                    name: 'Computer Keyboards',
                },
                price: 2500,
                stock: 23,
            },
        ];

        const req: any = {
            body: {
                productCategory: '652624671853eb7ecdacd6b8',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockProducts.filter(product => product.category._id === req.body.productCategory)),
        });

        await getManageProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('products', {
            title: 'All Products',
            username: res.locals.user,
            allProductsList: expectedProductData,
            categoryList: dataMockCategories,
            selectedCategory: req.body.productCategory,
        });
    });

    it('should handle errors gracefull and render messages when no products are found', async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getManageProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('products', {            
            title: 'All Products',
            username: res.locals.user,
            error: new Error('No products found!'),
            selectedCategory: req.body.productCategory,
        });
    });

    it('should handle errors gracefull and render messages when no products are found for a particular category', async () => {
        const req: any = {
            body: {
               productCategory: '6534680c8a7ce6a6af7f9cb9',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getManageProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('products', {
            title: 'All Products',
            username: res.locals.user,
            error: new Error('No products found!'),
            selectedCategory: req.body.productCategory,
        });
    });

    it('should handle errors gracefull and render messages when an invalid category is provided', async () => {
        const req: any = {
            body: {
                productCategory: 'invalid category',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce([]),
        });

        await getManageProducts(req, res);

        expect(Product.find).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('products', {
            title: 'All Products',
            username: res.locals.user,
            error: new Error('No products found!'),
            selectedCategory: req.body.productCategory,
        });
    });
});

// Product View
describe('Product View', () => {
    it('should render the Product view with details for the provided productId', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        const expectedData = dataMockProducts.filter(product => product._id === req.params.id);
        
        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),            
            exec: jest.fn().mockReturnValueOnce(expectedData[0]),
        });

        await getProductDetails(req, res);

        expect(res.render).toHaveBeenCalledWith('productView', {
            title: 'Product Details',
            username: res.locals.user,
            productDetails: dataMockProducts[0],
                
        });
    });

    it('should handle error gracefull and render error messages when an invalid productId is provided', async () => {
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

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        expect(Product.findById).not.toHaveBeenCalled();

        await getProductDetails(req, res);

        expect(res.render).toHaveBeenCalledWith('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: new Error('Product not found!'),
        });
    });

    it('should handle error gracefull and render error messages when a productId is not provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        expect(Product.findById).not.toHaveBeenCalled();

        await getProductDetails(req, res);

        expect(res.render).toHaveBeenCalledWith('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: new Error('Product not found!'),
        });
    });

    it('should handle error gracefull and render error messages when a product does not exists', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be21',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getProductDetails(req, res);

        expect(res.render).toHaveBeenCalledWith('productView', {
            title: 'Product Details',
            username: res.locals.user,
            error: new Error('Product not found!'),
        });
    });
});