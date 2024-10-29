import { Request, Response } from 'express';

const orderCategoryList = [
    { id: 1, name: 'Ordered' },
    { id: 2, name: 'Processed' },
    { id: 3, name: 'Shipped' },
    { id: 4, name: 'Delivered' },
    { id: 5, name: 'Cancelled' },
    { id: 6, name: 'Returned' },
    { id: 7, name: 'Refunded' },
];

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    res.send('Not Implemented Yet');
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    res.send('Not Implemented Yet');
};

export const postFullfillOrder = async (req: Request, res: Response): Promise<void> => {
    res.send('Not Implemented Yet');
};
