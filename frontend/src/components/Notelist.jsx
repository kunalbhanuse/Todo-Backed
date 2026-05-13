import React, { useEffect } from "react";
import axios from "axios";

const Notelist = () => {
  const [todos, setTodos] = React.useState([]);
  useEffect(() => {
    try {
      const featchTodos = async () => {
        const response = await axios.get("http://localhost:3000/todo/getAll");

        console.log("responce:-", response.data.message);
        setTodos(response.data.message);
      };
      featchTodos();
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, []);
  return (
    <div className="listtodos">
      <h1>Hello TOdos</h1>
      {todos.map((todo) => (
        <div className="card" key={todo._id}>
          <h2>{todo.title}</h2>
          <p>{todo.content}</p>
          <p>{todo.userId.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Notelist;
