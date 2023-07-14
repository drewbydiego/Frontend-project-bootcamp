import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";
function TodoList() {
  const [todos, setTodos] = useState([]);

  const getList = async () => {
    const result = await fetch("http://localhost:8000/api");

    const resultJson = await result.json();
    setTodos(resultJson.data);
  };

  useEffect(() => {
    getList();
  }, []);

  const addTodo = (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }

      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }

    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = async (id) => {
    const removedArr = [...todos].filter((todo) => todo.id !== id);

    const result = await fetch(`http://localhost:8000/api/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resultJson = await result.json();

    setTodos(removedArr);
  };

  const completeTodo = (id, lastModified) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isDone = !todo.isDone;
        updateChecked(
          id,
          todo.isDone,
          todo.title,
          todo.description,
          lastModified
        );
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>What's the Plan for Today? 😼</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

const updateChecked = async (id, isDone, title, description, lastModified) => {
  const result = await fetch(`http://localhost:8000/api/${id}`, {
    body: JSON.stringify({
      title: title,
      description: description,
      isDone: isDone,
      lastModified: lastModified,
    }),
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resultJson = await result.json();
  //await console.log(resultJson);
};
export default TodoList;
