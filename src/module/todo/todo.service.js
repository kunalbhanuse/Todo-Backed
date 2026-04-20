import mongoose from "mongoose";
import ApiError from "../../common/util/apiError.js";
import Todo from "./todo.model.js";

export const creteTodoService = async ({ userId, title, content, status }) => {
  const todo = await Todo.create({
    title,
    content,
    status,
    userId,
  });
  return todo;
};

export const getTodo = async () => {
  const AllTodo = await Todo.find().populate("userId");
  if (!AllTodo) {
    throw ApiError.notFound("All todo not found !");
  }
  return AllTodo;
};

export const getByIdService = async ({ id }) => {
  const todo = await Todo.findById(id).populate("userId");
  if (!todo) {
    throw ApiError.notFound(" todo not found !");
  }
  return todo;
};

export const updateTodoService = async ({ data, userId, id }) => {
  const updated = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true },
  );
  if (!updated) {
    throw ApiError.notFound(" update failed!");
  }
  return updated;
};
export const deleteTodoService = async ({ id, userId }) => {
  console.log("userid :", userId);
  console.log("id :", id);
  const todo = await Todo.findById(id);
  console.log("todo :", todo);

  if (!todo) {
    throw ApiError.notFound("todo notFound");
  }
  if (todo.userId.toString() !== userId.toString()) {
    throw ApiError.forbidden("U dont have the acces to do this ");
  }
  const deleted = await Todo.findByIdAndDelete(id);
  if (!deleted) {
    throw ApiError.notFound("Unabele to delete ");
  }
  return deleted;
};
