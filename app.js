import express from 'express';
import "dotenv/config";
import indexRouter from "./routes/index.js";
import catalogRouter from "./routes/catalog.js";
import main from './db/mongoose.js';
import { fileURLToPath } from "url";

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

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
