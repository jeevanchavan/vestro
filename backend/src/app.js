import express from 'express'
import morgan from 'morgan';
import cors from 'cors'

const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
    origin:"http://localhost:5173",
    method: ["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

import authRouter from './routers/auth.routes.js';

app.use("/api/auth",authRouter);

export default app;