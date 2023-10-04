import express from 'express';
import "dotenv/config";

const port = process.env.PORT || 5000;
const app = express();

import indexRouter from './routes/index.js';

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
