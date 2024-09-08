import express, { Express, Request, Response } from 'express';
import 'dotenv/config';

const port: string | 5000 = process.env.PORT || 5000;
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});
