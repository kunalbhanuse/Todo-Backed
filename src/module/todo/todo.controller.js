import { createValidator, updateValidator } from "./dto/validation.dto.js";
import { ApiResponse } from "../../common/util/apiResponce.js";
import * as todoService from "./todo.service.js";

export const creteTodo = async (req, res) => {
  try {
    const validate = await createValidator.parseAsync(req.body);
    const todo = await todoService.creteTodoService({
      ...validate,
      userId: req.user.id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, "Todo created succefully !", todo));
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const AllTodo = await todoService.getTodo();
    return res
      .status(200)
      .json(new ApiResponse(200, "All Todus featched Succefully ", AllTodo));
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const todo = await todoService.getByIdService(req.params);
    return res
      .status(200)
      .json(new ApiResponse(200, " Todus featched Succefully ", todo));
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const data = await updateValidator.parseAsync(req.body);
    const updatedTodo = await todoService.updateTodoService({
      data: data,
      userId: req.user.id,
      id: req.params.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, " todu Updated  Succefully ", updatedTodo));
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await todoService.deleteTodoService({
      id: req.params.id,
      userId: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, " todu Deleted succefully  ", deletedTodo));
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
    });
  }
};
