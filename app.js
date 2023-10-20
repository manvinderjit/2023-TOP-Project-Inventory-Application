import express from "express";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import routerCategory from "./routes/catalog.js";
import routerUser from "./routes/userRoutes.js";
import main from "./db/mongoose.js";
import { fileURLToPath } from "url";
import cors from 'cors';

const port = process.env.PORT || 5000;
const app = express();

const viewsPath = fileURLToPath(new URL("views", import.meta.url));
const staticsPath = fileURLToPath(new URL("public", import.meta.url));

app.set("views", viewsPath);
app.set("view engine", "ejs");

main().catch((err) => console.log(err));

app.use(express.json());
app.use(express.static(staticsPath));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", indexRouter);
app.use("/catalog", routerCategory);
app.use("/api/users", routerUser);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
