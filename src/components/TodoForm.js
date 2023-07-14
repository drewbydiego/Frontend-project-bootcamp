import React, { useState, useEffect, useRef } from "react";
import { BsArrowDown, BsPlusCircleFill } from "react-icons/bs";
import { RiCheckboxCircleLine } from "react-icons/ri";
import Swal from "sweetalert2";

function getTime() {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
  const day = String(currentDateTime.getDate()).padStart(2, "0");
  const hours = String(currentDateTime.getHours()).padStart(2, "0");
  const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function TodoForm(props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : "");
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState(
    props.edit ? props.edit.description : ""
  );

  const inputRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setShowDescription(!showDescription);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description === "" || input === "") {
      //console.log("textarea vacio");
      Swal.fire({
        title: "Error",
        text: `Please enter a title and a description 😿`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      const formattedDateTime = getTime();

      const result = await fetch("http://localhost:8000/api", {
        method: "POST",
        body: JSON.stringify({
          title: input,
          description,
          created_at: formattedDateTime,
          last_modified_at: formattedDateTime,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resultJson = await result.json();
      props.onSubmit({
        id: resultJson.toDo.id,
        title: input,
        description,
        isDone: false,
        showDescription: false,
        createdAt: formattedDateTime,
        lastModified: formattedDateTime,
      });
      setInput("");
      setDescription("");
    }
  };
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (description === "" || input === "") {
      Swal.fire({
        title: "Error",
        text: "Please enter a title and a description 😿",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      const formattedDateTime = getTime();

      const result = await fetch(`http://localhost:8000/api/${props.newID}`, {
        body: JSON.stringify({
          title: input,
          description,
          isDone: props.dd,
          lastModified: formattedDateTime,
        }),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resultJson = await result.json();
      await props.onSubmit({
        id: props.newID,
        title: input,
        description,
        isDone: props.dd,
        showDescription: false,
        createdAt: resultJson.ToDo.createdAt,
        lastModified: formattedDateTime,
      });
      setInput("");
      setDescription("");
    }
  };

  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="todo-form">
        {props.edit ? (
          <div className="todo-form--update">
            <input
              placeholder="Update your item"
              value={input}
              onChange={handleChange}
              name="text"
              ref={inputRef}
              className="todo-input edit todo-description"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              name="description"
              className="todo-input todo-description"
            />
            <button onClick={handleSubmitUpdate} className="todo-button">
              <RiCheckboxCircleLine />
            </button>
          </div>
        ) : (
          <>
            <input
              placeholder="Add a todo"
              value={input}
              onChange={handleChange}
              name="text"
              className="todo-input"
              ref={inputRef}
            />
            <button onClick={handleDescription} className="todo-button edit">
              <BsArrowDown />
            </button>
            <button onClick={handleSubmit} className="todo-button">
              <BsPlusCircleFill />
            </button>
            {showDescription && (
              <textarea
                placeholder="Description"
                value={description}
                onChange={handleDescriptionChange}
                name="description"
                className="todo-input todo-description"
              />
            )}
          </>
        )}
      </form>
    </>
  );
}

export default TodoForm;
