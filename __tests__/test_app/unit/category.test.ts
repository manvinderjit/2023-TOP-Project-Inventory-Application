import request from 'supertest';
import { jest } from '@jest/globals';
import { app, Shutdown } from '../../../src/server';
import connectDB from '../../../src/config/mongodb';
import Category from '../../../src/models/categoryModel';
import { manageCategoriesView } from '../../../src/app/controllers/category.app.controllers';

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
        
        await manageCategoriesView(req, res);

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

        await manageCategoriesView(req, res);

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
