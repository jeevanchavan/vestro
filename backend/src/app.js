import express from 'express'
import morgan from 'morgan';
const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

import authRouter from './routers/auth.routes.js';

app.use("/api/auth",authRouter);

export default app;