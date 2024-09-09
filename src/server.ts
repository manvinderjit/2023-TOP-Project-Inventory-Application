import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import { Server } from 'http';

const port: string | 5000 = process.env.PORT || 5000;
export const app: Express = express();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Hi!');
});

const server: Server = app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});

export const Shutdown = (callback: any) => server && server.close(callback);
