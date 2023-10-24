import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './config/mongodb.js';
import errorHandler from './middleware/errorMw.js';
import indexRouter from './routes/index.js';
import mongoose from 'mongoose';

const port = process.env.PORT || 5000;
const app = new express();

const viewsPath = fileURLToPath(new URL('views', import.meta.url));
const staticsPath = fileURLToPath(new URL('public', import.meta.url));

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
            ttl: 60, // 60 seconds
        }),
    }),
);

app.use(express.json());
app.use(express.static(staticsPath));
app.use(express.urlencoded({ extended: true }));

// Makes userId available for all routes
app.use((req, res, next) =>{
    const { userId, authorized } = req.session;
    if(userId && authorized){
        res.locals.user = userId;
    }
    next();
});

app.use('/', indexRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App server listening on port ${port}`);
});
