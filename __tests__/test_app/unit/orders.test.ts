import { jest } from '@jest/globals';
import Orders from '../../../src/models/ordersModel';
import Category from '../../../src/models/categoryModel';
import { getAllOrders, getOrderById } from '../../../src/app/controllers/orders.app.controller.js';

const orderStatusList = [
    { id: 1, name: 'Ordered' },
    { id: 2, name: 'Processed' },
    { id: 3, name: 'Shipped' },
    { id: 4, name: 'Delivered' },
    { id: 5, name: 'Cancelled' },
    { id: 6, name: 'Returned' },
    { id: 7, name: 'Refunded' },
];

const dataMockOrders = [
    {
        "_id":"65e776668ab602638976d41f",
        "customerId":"654715c5941455dd27f32425",
        "items":[
            {
                "itemId":"653c5786811a24a8761b73b6",
                "itemQuantity":1,
                "itemPrice":310.1,
                "_id":"653c5786811a24a8761b73b6",
                "id":"653c5786811a24a8761b73b6",
                "itemDetails":{
                    "_id":"653c5786811a24a8761b73b6",
                    "name":"AOC 27G2SP Monitor",
                    "description":"This is a 165Hz version of AOC Gaming monitor",
                    "url":"/products/653c5786811a24a8761b73b6",
                    "id":"653c5786811a24a8761b73b6"
                }
            },
            {
                "itemId":"65ab113a23afb3b699a1aba9",
                "itemQuantity":2,
                "itemPrice":25,
                "_id":"65ab113a23afb3b699a1aba9",
                "id":"65ab113a23afb3b699a1aba9",
                "itemDetails":{
                    "_id":"65ab113a23afb3b699a1aba9",
                    "name":"CM CK790RGB Keyboard",
                    "description":"RGB version of 2024 Cooler Master keyboard",
                    "url":"/products/65ab113a23afb3b699a1aba9",
                    "id":"65ab113a23afb3b699a1aba9"
                }
            }
        ],
        "totalAmount":"360.10",
        "status":"Cancelled",
        "createdAt":"2024-03-05",
        "updatedAt":"2024-03-05",
        "__v":0,
        "url":"/orders/65e776668ab602638976d41f",
        "id":"65e776668ab602638976d41f"
    },
    {
        "_id":"65e773c28ab602638976d2a4",
        "customerId":"654715c5941455dd27f32425",
        "items":[
            {
                "itemId":"653c5786811a24a8761b73b6",
                "itemQuantity":1,
                "itemPrice":310.1,
                "_id":"653c5786811a24a8761b73b6",
                "id":"653c5786811a24a8761b73b6",
                "itemDetails":{
                    "_id":"653c5786811a24a8761b73b6",
                    "name":"AOC 27G2SP Monitor",
                    "description":"This is a 165Hz version of AOC Gaming monitor",
                    "url":"/products/653c5786811a24a8761b73b6",
                    "id":"653c5786811a24a8761b73b6"}
            },
            {
                "itemId":"653c63f3af869615c64a531d",
                "itemQuantity":1,
                "itemPrice":300,
                "_id":"653c63f3af869615c64a531d",
                "id":"653c63f3af869615c64a531d",
                "itemDetails":{
                    "_id":"653c63f3af869615c64a531d",
                    "name":"ASUS PD718A",
                    "description":"Asus 240Hz Gaming Monitor",
                    "url":"/products/653c63f3af869615c64a531d",
                    "id":"653c63f3af869615c64a531d"
                }
            }
        ],
        "totalAmount":"610.10",
        "status":"Ordered",
        "createdAt":"2024-03-05",
        "updatedAt":"2024-03-05",
        "__v":0,
        "url":"/orders/65e773c28ab602638976d2a4",
        "id":"65e773c28ab602638976d2a4"
    },
    {
        "_id":"65e56b01d305ecb31080cfee",
        "customerId":"654715c5941455dd27f32425",
        "items":[
            {
                "itemId":"653b132b966fe37a29d33c28",
                "itemQuantity":1,
                "itemPrice":250,
                "_id":"653b132b966fe37a29d33c28",
                "id":"653b132b966fe37a29d33c28",
                "itemDetails":{
                    "_id":"653b132b966fe37a29d33c28",
                    "name":"AOC 27G2 Monitor",
                    "description":"Monitor from AOC for gaming.",
                    "url":"/products/653b132b966fe37a29d33c28",
                    "id":"653b132b966fe37a29d33c28"
                }
            },
            {
                "itemId":"653c5786811a24a8761b73b6",
                "itemQuantity":1,
                "itemPrice":310.1,
                "_id":"653c5786811a24a8761b73b6",
                "id":"653c5786811a24a8761b73b6",
                "itemDetails":
                {
                    "_id":"653c5786811a24a8761b73b6",
                    "name":"AOC 27G2SP Monitor",
                    "description":"This is a 165Hz version of AOC Gaming monitor",
                    "url":"/products/653c5786811a24a8761b73b6",
                    "id":"653c5786811a24a8761b73b6"
                }
            },
            {
                "itemId":"653c63f3af869615c64a531d",
                "itemQuantity":1,
                "itemPrice":300,
                "_id":"653c63f3af869615c64a531d",
                "id":"653c63f3af869615c64a531d",
                "itemDetails":
                {
                    "_id":"653c63f3af869615c64a531d",
                    "name":"ASUS PD718A",
                    "description":"Asus 240Hz Gaming Monitor",
                    "url":"/products/653c63f3af869615c64a531d",
                    "id":"653c63f3af869615c64a531d"
                }
            }
        ],
        "totalAmount":"860.10",
        "status":"Processed",
        "createdAt":"2024-03-04",
        "updatedAt":"2024-03-04",
        "__v":0,
        "url":"/orders/65e56b01d305ecb31080cfee",
        "id":"65e56b01d305ecb31080cfee"
    },
];

describe("GET Manage Orders", () => {
    it("should render all orders by default, if orderCategory is not provided", async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockOrders),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
            ordersList: dataMockOrders,
        });
    });

    it('should render all orders for a category, if orderCategory is provided', async () => {
        const req: any = {
            body: { orderCategory: '1' },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        const expectedData = [{
            "_id":"65e773c28ab602638976d2a4",
            "customerId":"654715c5941455dd27f32425",
            "items":[
                {
                    "itemId":"653c5786811a24a8761b73b6",
                    "itemQuantity":1,
                    "itemPrice":310.1,
                    "_id":"653c5786811a24a8761b73b6",
                    "id":"653c5786811a24a8761b73b6",
                    "itemDetails":{
                        "_id":"653c5786811a24a8761b73b6",
                        "name":"AOC 27G2SP Monitor",
                        "description":"This is a 165Hz version of AOC Gaming monitor",
                        "url":"/products/653c5786811a24a8761b73b6",
                        "id":"653c5786811a24a8761b73b6"}
                },
                {
                    "itemId":"653c63f3af869615c64a531d",
                    "itemQuantity":1,
                    "itemPrice":300,
                    "_id":"653c63f3af869615c64a531d",
                    "id":"653c63f3af869615c64a531d",
                    "itemDetails":{
                        "_id":"653c63f3af869615c64a531d",
                        "name":"ASUS PD718A",
                        "description":"Asus 240Hz Gaming Monitor",
                        "url":"/products/653c63f3af869615c64a531d",
                        "id":"653c63f3af869615c64a531d"
                    }
                }
            ],
            "totalAmount":"610.10",
            "status":"Ordered",
            "createdAt":"2024-03-05",
            "updatedAt":"2024-03-05",
            "__v":0,
            "url":"/orders/65e773c28ab602638976d2a4",
            "id":"65e773c28ab602638976d2a4"
        }];

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockOrders.filter(order => order.status === (orderStatusList.filter(order => order.id === Number(req.body.orderCategory)))[0].name)),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
            ordersList: expectedData,
        });
    });

    it('should handle error gracefully and render messages when there are no orders for a particular order Status', async () => {
        const req: any = {
            body: {
                body: { orderCategory: '7' },
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        const getOrderStatusObject = orderStatusList.filter(
            (order) => order.id === Number(req.body.orderCategory),
        );

        const returnedData =
            getOrderStatusObject.length > 0
                ? dataMockOrders.filter(
                          (order) =>
                              order.status === getOrderStatusObject[0].name,
                      )                  
                : null;

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(returnedData),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            error: new Error('No orders found!'),
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
        });
    });

    it('should handle error gracefully and render messages when there are no orders returned', async () => {
        const req: any = {
            body: {
                body: { orderCategory: '1' },
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            error: new Error('No orders found!'),
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
        });
    });

    it('should handle error gracefully and render messages when an orderCategory does not exists', async () => {
        const req: any = {
            body: {
                orderCategory: '11',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            error: new Error('Invalid Order Category!'),
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
        });
    });

    it('should handle error gracefully and render messages when an orderCategory is invalid', async () => {
        const req: any = {
            body: {
                orderCategory: 'abc',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.find as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getAllOrders(req, res);

        expect(res.render).toHaveBeenCalledWith('orders', {
            title: 'Manage Orders',
            username: res.locals.user,
            error: new Error('Invalid Order Category!'),
            orderCategoryList: orderStatusList,
            selectedOrderCategory: req.body.orderCategory,
        });
    });
});

describe("GET Manage An Order", () => {
    it("should render the data for an order after fetching order data", async () => {
        const req: any = {
            params: {
                id: '65e776668ab602638976d41f',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockOrders.filter(order => order._id === req.params.id)[0]),
        });

        await getOrderById(req, res);

        expect(Orders.findById).toHaveBeenCalledWith(req.params.id);
        
        expect(res.render).toHaveBeenCalledWith('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            orderDetails: dataMockOrders[0],
            orderStatusList: orderStatusList,
        });
    });

    it('should handle error gracefully and render error messages when no order id is provided', async () => {
        const req: any = {
            params: {},
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getOrderById(req, res);

        expect(Orders.findById).not.toHaveBeenCalledWith(req.params.id);

        expect(res.render).toHaveBeenCalledWith('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: new Error('Order not found!'),
            orderStatusList: orderStatusList,
        });
    });

    it('should handle error gracefully and render error messages when an invalid order id is provided', async () => {
        const req: any = {
            params: {
                id: 'abc'
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(null),
        });

        await getOrderById(req, res);

        expect(Orders.findById).not.toHaveBeenCalledWith(req.params.id);

        expect(res.render).toHaveBeenCalledWith('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: new Error('Order not found!'),
            orderStatusList: orderStatusList,
        });
    });

    it('should handle error gracefully and render error messages when data for an order is not found', async () => {
        const req: any = {
            params: {
                id: '65e776668ab602638976d412',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValueOnce(dataMockOrders.filter(order => order._id === req.params.id)[0]),
        });

        await getOrderById(req, res);

        expect(res.render).toHaveBeenCalledWith('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: new Error('Order not found!'),
            orderStatusList: orderStatusList,
        });
    });

    it('should handle error gracefully and render error messages when there order id mismatch occurs', async () => {
        const req: any = {
            params: {
                id: '65e776668ab602638976d413',
            },
        };

        const res: any = {
            locals: {
                user: 'user@abc.com',
            },
            render: jest.fn(),
        };

        (Orders.findById as jest.Mock) = jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnThis(),
            exec: jest
                .fn()
                .mockReturnValueOnce(dataMockOrders[0]),
        });

        await getOrderById(req, res);

        expect(res.render).toHaveBeenCalledWith('orderView', {
            title: 'Customer Order Details',
            username: res.locals.user,
            error: new Error('Order not found!'),
            orderStatusList: orderStatusList,
        });
    });
});
