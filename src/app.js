import express from "express";
import authRouter from "./module/auth/auth.routes.js";
import todoRouter from "./module/todo/todo.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/todo", todoRouter);

export default app;
