import request from 'supertest';
import { jest } from '@jest/globals';
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';
import Category from '../../../src/models/categoryModel';
import {
    getCategoryDetailsView,
    getManageCategoriesView,
    getCreateCategoryView,
    postCreateCategory,
} from '../../../src/app/controllers/category.app.controllers';
import { saveCategoryDetails } from '../../../src/app/services/category.app.services';

const dataMockCategories = [
  {
    _id: '652624671853eb7ecdacd6b8',
    name: 'Computer Keyboards',
    description: 'Different types of computer keyboards.'
  },
  {
    _id: '651f74b0df4699212c8abacb',
    name: 'Monitors',
    description: 'Different types of monitors.'
  },
  {
    _id: '6534680c8a7ce6a6af7f9cb9',
    name: 'Mouse',
    description: 'Different types of computer mice.'
  },
];

const mockCategoryDetails = {
    _id: '652624671853eb7ecdacd6b8',
    name: 'Monitors',
    description: 'Different types of monitors.',
    url: 'categories/652624671853eb7ecdacd6b8',
};

describe('Manage Categories View', () => {

    it('should render the Manage Categories view', async () => {
        const req: any = {};

        const res: any = {
            locals: {
                username: 'user@abc.com'
            }, 
            render: jest.fn(),
        };
        (Category.find as jest.Mock) = jest
            .fn()
            .mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockReturnValueOnce(dataMockCategories),
            });
        
        await getManageCategoriesView(req, res);

        expect(res.render).toHaveBeenCalledWith('categories', {
            title: 'Manage Categories',
            username: res.locals.user,
            allCategoriesList: dataMockCategories,
        })
    });

    it('should render the Manage Categories error', async () => {
        const req: any = {};

        const res: any = {
            locals: {
                username: 'user@abc.com',
            },
            render: jest.fn(),
        };
        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce(() => {
            throw new Error();
        });

        await getManageCategoriesView(req, res);

        expect(res.render).toHaveBeenCalledWith('categories', {
            title: 'Manage Categories',
            username: res.locals.user,
            error: 'Something went wrong!',
        });
    });
});

describe("Manage Categories Page", () => {

    let agent: any;

    beforeEach(async () => {
        (await connectDB()).ConnectionStates.connected === 1;
        agent = request.agent(app);
    });

    afterAll((done) => {
        Shutdown(done);
    });

    afterEach(
        async () => (await connectDB()).ConnectionStates.disconnected === 0,
    );
    
    it("should render the Manage Categories route when user is logged in", async () => {

        // Log in to establish session
        await agent
            .post('/login') 
            .send({ email: 'e@abc.com', password: 'Admin1' }) // Login credentials
            .set('Accept', 'application/json');

        (Category.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockCategories),
        });

        const response = await agent.get('/categories');        

        expect(response.status).toBe(200);
        expect(response.text).toContain(
            `<h2 class=\"py-2 text-center \">Manage Categories</h2>`,
        );

        expect(response.text).toContain(
            '<h2 class="py-2 text-center ">Add a New Category</h2>',
        );
        expect(response.text).toContain(
            '<a href="/categories/create" class="btn btn-primary ">Add A New Category </a>',
        );

        expect(response.text).toContain(
            `<a class=\"card-link\"  href= > Computer Keyboards</a>`,
        );
        expect(response.text).toContain(
            `<h5 class=\"card-title\">Computer Keyboards</h5>`
        );
        expect(response.text).toContain(
            `<p class=\"card-text\">Different types of computer keyboards.</p>`
        );
        
         expect(response.text).toContain(
             `<a class=\"card-link\"  href= > Monitors</a>`,
         );
        expect(response.text).toContain(`<h5 class=\"card-title\">Monitors</h5>`);
        expect(response.text).toContain(`<p class=\"card-text\">Different types of monitors.</p>`);

        expect(response.text).toContain(
            `<a class=\"card-link\"  href= > Mouse</a>`,
        );
        expect(response.text).toContain(`<h5 class=\"card-title\">Mouse</h5>`);
        expect(response.text).toContain(
            `<p class=\"card-text\">Different types of computer mice.</p>`,
        );
        expect(response.text).toContain(
            `<button class=\"btn btn-outline-primary me-2\">Logout</button>`,
        );
        
    });
});

describe("Category Details View", () => {
    
    it("should render category details for a valid category Id", async () => {
        const req: any = {
            params: { id: mockCategoryDetails._id },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next = jest.fn();

        (Category.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(mockCategoryDetails),
        });
        
        await getCategoryDetailsView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryView', {
            username: 'testUser',
            _id: mockCategoryDetails._id,
            title: mockCategoryDetails.name,
            name: mockCategoryDetails.name,
            description: mockCategoryDetails.description,
            url: mockCategoryDetails.url,
        });

    });

    it('should render error message when an invalid category ID is provided', async () => {
        const req: any = {
            params: { id: 'invalidId' },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next = jest.fn();

        await getCategoryDetailsView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryView', {
            username: 'testUser',
            error: "Category not provided or invalid!",
            title: "Error! Not found.",
        });

    });

    it('should render error message when a category Id is not provided', async () => {
        const req: any = {
            params: {  },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next = jest.fn();

        await getCategoryDetailsView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryView', {
            username: 'testUser',
            error: 'Category not provided or invalid!',
            title: 'Error! Not found.',
        });
    });

    it('should render error message when category details are not found', async () => {
        const req: any = {
            params: { id: '652624671853eb7ecdacd6b0' },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next = jest.fn();

        (Category.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getCategoryDetailsView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryView', {
            username: 'testUser',
            error: 'Category details not found!',
            title: 'Error! Not found.',
        });
    });

    it('should handle unknown errors gracefully and render error message', async () => {
        const req: any = {
            params: { id: '652624671853eb7ecdacd6b0' },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next = jest.fn();

        (Category.findById as jest.Mock) = jest.fn().mockReturnValueOnce(() => {
            throw new Error();
        });
        
        await getCategoryDetailsView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryView', {
            username: 'testUser',
            title: 'Error! Something went wrong!',
            error: 'Something went wrong!',
        });
    });
});


describe("GET Create Category", () => {

    it("should render Create Category view", async() => {
        const req: any = {};
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        await getCreateCategoryView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            categoryName: '',
            categoryDescription: '',
        });
    });


    it('should handle errors gracefully and render error message for Create Category view', async () => {
        const req: any = {};
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        jest.spyOn(res, 'render').mockImplementationOnce(() => {
            throw new Error('Test Error');
        });

        await getCreateCategoryView(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: res.locals.error,
            categoryName: '',
            categoryDescription: '',
        });
    });

});

describe('POST Create Category', () => {
    it('should successfully create a category when valid data is provided', async () => {
        const req: any = {
            body: {
                categoryName: 'Valid Category',
                categoryDescription: 'Valid description for a dummy category',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        const mockedCategoryValue = {
            name: req.body.categoryName,
            description: req.body.categoryDescription,
            _id: '67004786a187d56061d095a7',
        };

        (Category.create as jest.Mock) = jest.fn().mockReturnValue(mockedCategoryValue);

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            success: `Category ${req.body.categoryName} created successfully`,
            categoryName: '',
            categoryDescription: '',
        });
    });

    it('should handle errors gracefully and render error message when the categoryName is not provided', async () => {
        const req: any = {
            body: {
                categoryDescription: 'Valid description for a dummy category',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: new Error('Please provide all fields!'),
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    });

    it('should handle errors gracefully and render error message when the categoryName is invalid', async () => {
        const req: any = {
            body: {
                categoryName: '   ',
                categoryDescription: 'Valid description for a dummy category',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: new Error('Please ensure all fields are valid!'),
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    });

    it('should handle errors gracefully and render error message when the categoryDescription is not provided', async () => {
        const req: any = {
            body: {
                categoryName: 'Valid Category',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: new Error('Please provide all fields!'),
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    });

    it('should handle errors gracefully and render error message when the categoryDescription is invalid', async () => {
        const req: any = {
            body: {
                categoryName: 'Valid Category',
                categoryDescription: '   ',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: new Error('Please ensure all fields are valid!'),
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    });

    it('should handle errors gracefully and render error message when category creation throws error', async () => {
        const req: any = {
            body: {
                categoryName: 'Valid Category',
                categoryDescription: 'Valid description for a dummy category',
            },
        };
        const res: any = {
            render: jest.fn(),
            locals: { user: 'testUser' },
        };
        const next: any = jest.fn();

        const mockError = new Error('Validation failed');

        (Category.create as jest.Mock) = jest
            .fn()
            .mockReturnValue(() => { throw new Error('');});

        await postCreateCategory(req, res, next);

        expect(res.render).toHaveBeenCalledWith('categoryCreate', {
            username: res.locals.user,
            title: 'Create Category',
            error: new Error('Category creation failed!'),
            categoryName: req.body.categoryName,
            categoryDescription: req.body.categoryDescription,
        });
    });
});
