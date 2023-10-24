import express from "express";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import routerCategory from "./routes/catalog.js";
import routerUser from "./routes/userRoutes.js";
import main from "./db/mongoose.js";
import { fileURLToPath } from "url";
import corsOptions from './config/corsOptions.js';
import cors from 'cors';
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from 'cookie-parser';
import { credentials } from "./config/corsOptions.js";
import session from 'express-session';
import { strict } from "assert";
import { checkSessionStatus } from "./middleware/authMiddleware.js";

const port = process.env.PORT || 5000;
const app = express();

const viewsPath = fileURLToPath(new URL("views", import.meta.url));
const staticsPath = fileURLToPath(new URL("public", import.meta.url));

app.set("views", viewsPath);
app.set("view engine", "ejs");

main().catch((err) => console.log(err));

app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: true,
        sameSite: strict,
        cookie: { },
        // name: 'inventory-app',
    })
);
app.use(express.json());
app.use(express.static(staticsPath));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use('/catalog', checkSessionStatus, routerCategory);

app.use(credentials);
app.use(cors(corsOptions));
app.use("/api/users", routerUser);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export default app;
