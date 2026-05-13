import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function CreateNote() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) =>
    await axios.post("http://localhost:3000/todo/crateTodo", data);
  return (
    <div className="createnote">
      <h1>Create Note</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <input
          type="text"
          placeholder="title"
          {...register("title", {
            required: "Title is required",
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}

        <input
          placeholder="content"
          {...register("content", {
            required: "content  is required ",
          })}
        />
        {errors.content && <p>{errors.content.message}</p>}

        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

export default CreateNote;
