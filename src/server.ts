import express, { Express } from 'express';
import 'dotenv/config';
import { Server } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/mongodb.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';

import appRouter from './app/routers/appRouter.js';
import apiRouter from './api/routers/index.api.router.js';
import errorHandler from './global.middleware/errorHandler.mw.js';

const port: string | number = process.env['PORT'] || 5000;
export const app: Express = express();

const viewsPath: string = fileURLToPath(new URL('app/views', import.meta.url));
const staticsPath: string = fileURLToPath(new URL('.', import.meta.url));

app.set('views', viewsPath);
app.set('view engine', 'ejs');

connectDB().catch((err) => console.log(err));

app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET as string | string[],
        resave: false,
        saveUninitialized: false,
        name: 'inventory-app',
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            autoRemove: 'native',
            ttl: Number(process.env.SESSION_TTL), // 60 minutes
        }),
    }),
    
);

app.use(express.json());
app.use(express.static(path.join(staticsPath, './public')));
app.use(express.urlencoded({ extended: true }));

// Makes userId available for all routes
// app.use((req, res, next) => {
//     const { userId, authorized } = req.session;
//     if (userId && authorized) {
//         res.locals.user = userId;
//     }
//     next();
// });

// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello Hi!');
// });

app.use('/', appRouter);

app.use(cors());

app.use('/api', apiRouter);

app.use(errorHandler);

const server: Server = app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});

export const Shutdown = (callback: any) => server && server.close(callback);
