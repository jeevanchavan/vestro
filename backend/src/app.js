import express from 'express'
import morgan from 'morgan';
import connectDB from './config/db.js';

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("dev"));

import authRouter from './routers/auth.routes.js';

app.use("/api/auth",authRouter);

export default app;