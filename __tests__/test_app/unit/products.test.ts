import { jest } from '@jest/globals';
import Product from '../../../src/models/productModel';
import Category from '../../../src/models/categoryModel';
import {
    getManageProducts,
    getProductDetails,
    getCreateProducts,
    postCreateProduct,
    getEditProduct,
    postEditProduct,
    getDeleteProduct,
    postDeleteProduct,
} from '../../../src/app/controllers/products.app.controllers';
import { unlink } from 'fs';

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

const dataMockCreateProduct = {
    productName: 'Dummy',
    productDescription: 'Dummy',
    productCategory: '652624671853eb7ecdacd6b8',
    productPrice: '10',
    productStock: '5',
};

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

describe("Create Product", () => {
    it("should render the GET Create Product view", async() => {
        const req: any = {};

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

        await getCreateProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: 0.0,
            productStock: 0,
            categoryList: dataMockCategories,
        }); 
    });

    it('should handle errors gracefully and render messages when error occurs in GET Create Product view', async () => {
        const req: any = {};

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

        jest.spyOn(res, 'render').mockImplementationOnce(() => {
            throw new Error('Test Error');
        });

        await getCreateProducts(req, res);

        expect(res.render).toHaveBeenCalledWith('productCreate', {
            username: res.locals.user,
            title: 'Create Product',
            error: new Error('Test Error'),
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: 0.0,
            productStock: 0,
            categoryList: dataMockCategories,
        });
    });
});

describe("POST Create Product", () => {
    it("should create a new product and render success message", async () => {

        const dataCreatedProduct = {
            name: 'Dummy',
            description: 'Dummy',
            price: '10',
            stock: '5',
            _id: '65cea4a2b9d6ae606013be23',
            imageFilename: 'abc-27g2sp-monitor.jpg',
            category: {
                _id: '652624671853eb7ecdacd6b8',
                name: 'Computer Keyboards',
            },    
        };

        const req: any = {
            body: dataMockCreateProduct,
            files: {
                productImage: {
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

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest.fn().mockReturnValueOnce(dataCreatedProduct);

        await postCreateProduct(req, res);

        expect(res.render).toHaveBeenCalled();
        expect(req.files.productImage.mv).toHaveBeenCalled();
        expect(Product.create).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            success: `Product created with name ${dataMockCreateProduct.productName}`,
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: '',
            productStock: '',
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error message when a file is not uploaded', async () => {
        const req: any = {
            body: dataMockCreateProduct,
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postCreateProduct(req, res);

        expect(res.render).toHaveBeenCalled();        
        expect(Product.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            error: new Error('No file was uploaded!'),
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,            
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error messages when fields are not provided', async () => {
        const req: any = {
            body: {},
            files: {
                productImage: {
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

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postCreateProduct(req, res);

        expect(res.render).toHaveBeenCalled();
        expect(Product.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            error: new Error('Please check  Product Name, Product Description, Product Category, Product Price, Product Stock'),
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error messages when fields are invalid', async () => {
        const req: any = {
            body: {
                productName: '   ',
                productDescription: '   ',
                productCategory: '6526671853eb7ecdacd6b8',
                productPrice: 'aa',
                productStock: 'a',
            },
            files: {
                productImage: {
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

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postCreateProduct(req, res);

        expect(res.render).toHaveBeenCalled();
        expect(Product.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            error: new Error(
                'Please check  Product Name, Product Description, Product Category, Product Price, Product Stock',
            ),
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error messages when file upload fails', async () => {
        const req: any = {
            body: dataMockCreateProduct,
            files: {
                productImage: {
                    name: 'image.png',
                    mv: jest.fn((path, callback: any) => callback(new Error('Upload failed!'))),
                },
            },
        };

        const res: any = {
            render: jest.fn(),
            locals: {
                user: 'user@abc.com',
            },
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postCreateProduct(req, res);

        expect(req.files.productImage.mv).toHaveBeenCalled();
        expect(Product.create).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            error: new Error(
                'Upload failed!',
            ),
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error message when product creation fails', async () => {
        const req: any = {
            body: dataMockCreateProduct,
            files: {
                productImage: {
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

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.create as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        jest.spyOn({ unlink }, 'unlink').mockImplementationOnce(
            (path, callback) => callback(null),
        );

        await postCreateProduct(req, res);

        expect(res.render).toHaveBeenCalled();
        expect(req.files.productImage.mv).toHaveBeenCalled();
        expect(Product.create).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productCreate', {
            title: 'Create Product',
            username: res.locals.user,
            error: new Error('Product creation failed!'),
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productPrice: req.body.productPrice,
            productStock: req.body.productStock,
            categoryList: dataMockCategories,
        });
    });
});

describe("GET Edit Product Details", () => {
    it("should render the Edit Product view with product details to edit a product", async () => {
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

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });
        
        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),            
            exec: jest.fn().mockReturnValueOnce(expectedData[0]),
        });

        await getEditProduct(req, res);

        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            productDetails: {
                productName: expectedData[0].name,
                productDescription: expectedData[0].description,
                productCategory: expectedData[0].category,
                productImage: expectedData[0].imageFilename,
                productPrice: expectedData[0].price,
                productStock: expectedData[0].stock,
                productUrl: `/products/${expectedData[0]._id}`,
            },
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error message when a product id is not provided', async () => {
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

        const expectedData = dataMockProducts.filter(
            (product) => product._id === req.params.id,
        );

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getEditProduct(req, res);
        expect(Product.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error message when an invalid product id is provided', async () => {
        const req: any = {
            params: {
                id: 'invalid id',
            },
            body: {}
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        const expectedData = dataMockProducts.filter(
            (product) => product._id === req.params.id,
        );

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getEditProduct(req, res);
        expect(Product.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle error gracefully and render error message when product details are not found', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
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

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getEditProduct(req, res);
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });
});

describe("POST Product Edit", () => {
    it("should edit product succesfully and redirect to the product page", async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const updatedProductData = {
            name: 'New Name',
            description: 'New Description',
            price: 20,
            stock: 10,
            _id: '65cea4a2b9d6ae606013be23',
            imageFilename: 'abc-27g2sp-monitor.jpg',
            category: {
                _id: '652624671853eb7ecdacd6b8',
                name: 'Computer Keyboards',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValueOnce(updatedProductData);

        await postEditProduct(req, res);
        
        expect(res.render).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith(`/products/${req.params.id}`);
    });

    it('should handle errors gracefully and render error message when an invalid product id is provided', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be',
            },
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle errors gracefully and render error message when a product id is not provided', async () => {
        const req: any = {
            params: {},
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle errors gracefully and render error messages when fields are invalid', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
            body: {
                productName: '   ',
                productDescription: '   ',
                productCategory: '6526671853eb7ecdacd6b8',
                productPrice: 'aa',
                productStock: 'a',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(Product.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Please check  Product Name, Product Description, Product Category, Product Price, Product Stock'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle errors gracefully and render error messages when product update fails', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(() => {throw new Error('Failure')});

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();        
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error(
                'Product update failed!',
            ),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle errors gracefully and render error messages when product update returns nothing', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(null);

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();        
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error(
                'Product update failed!',
            ),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });

    it('should handle errors gracefully and render error messages when product update returns a mismatched id', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be23',
            },
            body: {
                productName: 'New Name',
                productDescription: 'New Description',
                productCategory: '652624671853eb7ecdacd6b8',
                productPrice: '20',
                productStock: '10',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        // Data with mismatched id
        const updatedProductData = {
            name: 'New Name',
            description: 'New Description',
            price: 20,
            stock: 10,
            _id: '65cea4a2b9d6ae606013be21',
            imageFilename: 'abc-27g2sp-monitor.jpg',
            category: {
                _id: '652624671853eb7ecdacd6b8',
                name: 'Computer Keyboards',
            },
        };

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        (Product.findByIdAndUpdate as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(updatedProductData);

        await postEditProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productEdit', {
            title: 'Product Edit',
            username: res.locals.user,
            error: new Error('Product update failed!'),
            productUrl: req.body.productUrl,
            categoryList: dataMockCategories,
        });
    });
});

describe("GET Delete Product", () => {
    it("should render the Delete Product view with product details to delete a product", async () => {
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

        await getDeleteProduct(req, res);

        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            productDetails: expectedData[0],
        });
    });

    it('should handle errors gracefully and render error messages when a product id is not provided', async () => {
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

        await getDeleteProduct(req, res);

        expect(Product.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });

    it('should handle errors gracefully and render error messages when an invalid product id is provided', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be2',
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

        await getDeleteProduct(req, res);

        expect(Product.findById).not.toHaveBeenCalled();

        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });

    it('should handle errors gracefully and render error messages when a product is not found', async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be29',
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

        await getDeleteProduct(req, res);

        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });

    it('should handle errors gracefully and render error messages when product id mismatches', async () => {
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

        const expectedData = dataMockProducts.filter(
            (product) => product._id === req.params.id,
        );

        // Data with mismatched id
        const mismatchedProductData = {
            name: 'New Name',
            description: 'New Description',
            price: 20,
            stock: 10,
            _id: '65cea4a2b9d6ae606013be21',
            imageFilename: 'abc-27g2sp-monitor.jpg',
            category: {
                _id: '652624671853eb7ecdacd6b8',
                name: 'Computer Keyboards',
            },
        };

        (Product.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mismatchedProductData),
        });

        await getDeleteProduct(req, res);
        
        expect(Product.findById).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });
});

describe("POST Delete Product", () => {
    it("should delete product successfully and redirect to the Manage Product page", async () => {
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
            redirect: jest.fn(),
        };

        const expectedData = dataMockProducts.filter(product => product._id === req.params.id);
        
        (Product.findByIdAndDelete as jest.Mock) = jest.fn().mockReturnValueOnce(expectedData[0]);

        await postDeleteProduct(req, res);

        expect(res.render).not.toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/products');
    });

    it("should handle errors gracefully and render error messages when a product id is not provided", async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };
        
        (Product.findByIdAndDelete as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postDeleteProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });

    it("should handle errors gracefully and render error messages when an invalid product id is provided", async () => {
        const req: any = {
            params: {
                id: '65cea4a2b9d6ae606013be2',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
            redirect: jest.fn(),
        };

        (Product.findByIdAndDelete as jest.Mock) = jest.fn().mockReturnValueOnce(null);

        await postDeleteProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(Product.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Product not found!'),
            productDetails: '',
        });
    });

    it("should handle errors gracefully and render error messages when deletion fails", async () => {
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
            redirect: jest.fn(),
        };

        (Product.findByIdAndDelete as jest.Mock) = jest.fn().mockReturnValueOnce(new Error(''));

        await postDeleteProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();        
        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Deletion failed!'),
            productDetails: '',
        });
    });

    it("should handle errors gracefully and render error messages when deletion results in an id mismatch", async () => {
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
            redirect: jest.fn(),
        };

        // Data with mismatched id
        const mismatchedProductData = {
            name: 'New Name',
            description: 'New Description',
            price: 20,
            stock: 10,
            _id: '65cea4a2b9d6ae606013be21',
            imageFilename: 'abc-27g2sp-monitor.jpg',
            category: {
                _id: '652624671853eb7ecdacd6b8',
                name: 'Computer Keyboards',
            },
        };

        (Product.findByIdAndDelete as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce(mismatchedProductData);

        await postDeleteProduct(req, res);

        expect(res.redirect).not.toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('productDelete', {
            title: 'Product Delete',
            username: res.locals.user,
            error: new Error('Deletion failed!'),
            productDetails: '',
        });
    });
});
