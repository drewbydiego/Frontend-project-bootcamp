import React, { useState } from "react";
import TodoForm from "./TodoForm";
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiArrowDownCircleLine,
} from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Todo = ({
  todos,
  completeTodo,
  removeTodo,
  updateTodo,
  showDescription,
}) => {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return (
      <TodoForm
        edit={edit}
        onSubmit={submitUpdate}
        newID={edit.id}
        newTitle={edit.title}
        dd={edit.isDone}
      />
    );
  }

  return todos.map((todo, index) => (
    // <div>
    <div className={todo.isDone ? "todo-row complete" : "todo-row"} key={index}>
      <div className="description">
        <div
          key={todo.id}
          onClick={() => completeTodo(todo.id, todo.lastModified)}
          className="todo"
        >
          {todo.title}
          <p id="subtitle">
            {" "}
            {todo.createdAt === todo.lastModified
              ? ""
              : todo.showDescription === false
              ? "Last edit: " + todo.lastModified
              : ""}
          </p>
          {/*todo.text*/}
          {/*console.log(todos)*/}
        </div>
        <div className="icons">
          <RiCheckboxCircleLine
            onClick={() => completeTodo(todo.id, todo.lastModified)}
            className="delete-icon"
          />
          <RiArrowDownCircleLine
            onClick={() => showDescription(todo.id)}
            className="delete-icon"
          />
          <RiCloseCircleLine
            onClick={() => removeTodo(todo.id)}
            className="delete-icon"
          />
          <TiEdit
            onClick={() =>
              setEdit({
                id: todo.id,
                value: todo.title,
                description: todo.description,
                isDone: todo.isDone,
              })
            }
            className="edit-icon"
          />
        </div>
      </div>
      {todo.showDescription && (
        <>
          <div
            onClick={() => completeTodo(todo.id, todo.lastModified)}
            className="description"
          >
            <ul>
              <li> Description: {todo.description}</li>
              <li>
                {" "}
                <p id="subtitle">
                  Created at: {todo.createdAt}
                  <br></br>
                  {todo.createdAt === todo.lastModified
                    ? " "
                    : "Edited at: " + todo.lastModified}
                </p>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
    // </div>
  ));
};

export default Todo;
