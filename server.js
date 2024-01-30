import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './config/mongodb.js';
import errorHandler from './middleware/errorMw.js';
import indexRouter from './routes/index.js';
import mongoose from 'mongoose';
import apiRouter from './routes/apiIndexRoutes.js';
import cors from 'cors';
import path from 'path';

const port = process.env.PORT || 5000;
const app = express();

const viewsPath = fileURLToPath(new URL('views', import.meta.url));
const staticsPath = fileURLToPath(new URL('.', import.meta.url));

app.set('views', viewsPath);
app.set('view engine', 'ejs');

connectDB().catch((err) => console.log(err));

app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: false,
        name: process.env.SID,
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            autoRemove: 'native',
            ttl: process.env.SESSION_TTL, // 60 minutes
        }),
    }),
);

app.use(express.json());
app.use(express.static(path.join(staticsPath, './public')));
app.use(express.urlencoded({ extended: true }));

// Makes userId available for all routes
app.use((req, res, next) => {
    const { userId, authorized } = req.session;
    if(userId && authorized){
        res.locals.user = userId;
    }
    next();
});

app.use('/', indexRouter);

app.use(cors());
app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});
