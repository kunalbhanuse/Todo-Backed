import { Router } from "express";
import { isLoggedIn } from "../auth/auth.middleware.js";
import * as todoController from "./todo.controller.js";

const todoRouter = Router();

todoRouter.use(isLoggedIn);

todoRouter.post("/crateTodo", todoController.creteTodo);
todoRouter.get("/getAll", todoController.getAllTodos);
todoRouter.get("/getTodo/:id", todoController.getById);
todoRouter.patch("/update/:id", todoController.updateTodo);
todoRouter.delete("/delete/:id", todoController.deleteTodo);
export default todoRouter;
