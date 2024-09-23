import { jest } from '@jest/globals';
import { dashboardView } from '../../../src/app/controllers/index.controllers';

describe('Dashboard View', () => {
    it("should render Dashboard View", () => {
        const req: any = {};

        const res: any = {
            locals: {
                user: 'email@abc.com',
            },
            render: jest.fn(),
        }

        dashboardView(req, res);

        expect(res.render).toHaveBeenCalledWith('dashboard', {
            "error": "",
            "title": "Dashboard",
            "username": "email@abc.com",
        });
    });
});
