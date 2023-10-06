import express from 'express';
import "dotenv/config";
import indexRouter from "./routes/index.js";
import catalogRouter from "./routes/catalog.js";

const port = process.env.PORT || 5000;
const app = express();

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
