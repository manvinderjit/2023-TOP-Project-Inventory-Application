import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import { Server } from 'http';
import { fileURLToPath } from 'url';

const port: string | 5000 = process.env.PORT || 5000;
export const app: Express = express();

const viewsPath = fileURLToPath(new URL('views', import.meta.url));
const staticsPath = fileURLToPath(new URL('.', import.meta.url));

app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Hi!');
});

const server: Server = app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});

export const Shutdown = (callback: any) => server && server.close(callback);
