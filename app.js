import express from 'express';
import "dotenv/config";
import indexRouter from "./routes/index.js";
import catalogRouter from "./routes/catalog.js";
import main from './db/mongoose.js';

const port = process.env.PORT || 5000;
const app = express();

main().catch((err) => console.log(err));

app.use(express.json());

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
