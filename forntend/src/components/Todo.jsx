import React, { useEffect, useState } from 'react';

function Todo() {
  const [todoValue, setTodoValue] = useState("");
  const [todoLists, setTodolists] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const fetchData = async () => {
    const res = await fetch("https://todo-fb-react.onrender.com/todo");
    const resData = await res.json();

    if (resData.status === 200) {
      setTodolists(resData.data);
    }
  };

  const addTodoListData = async () => {
    const res = await fetch("https://todo-fb-react.onrender.com/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        todoValue,
      }),
    });
    return res;
  };

  const updateTodoListData = async () => {
    const res = await fetch(`https://todo-fb-react.onrender.com/todo/${currentTodo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        todoValue,
      }),
    });
    return res;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const res = isEditing ? await updateTodoListData() : await addTodoListData();
    fetch('https://todo-fb-react.onrender.com/todo/')
    if (res.ok) {
      fetchData();
      setTodoValue("");
      setIsEditing(false);
      setCurrentTodo(null);
    }
  }

  const handleEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setTodoValue(todo.value);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`https://todo-fb-react.onrender.com/todo/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
    }
  };

  function handleChange(e) {
    let todoInput = e.target.value;
    setTodoValue(todoInput);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor='todoInput'>Add Todo:</label>
        <input
          type='text'
          placeholder='Enter the today activities...'
          onChange={handleChange}
          required
          id="todoInput"
          value={todoValue}
        />
        <button className='btn' type='submit'>{isEditing ? "Update" : "Add"}</button>
      </form>

      <ol>
        <div className='litem'>
          
          {todoLists.map((todoList) => (
            
            <li key={todoList._id}>
             <div> {todoList.value}</div>
              

              <div className='bitem'>
                <button className='btn2' onClick={() => handleEdit(todoList)}>📝</button>
                <button className='btn3' onClick={() => handleDelete(todoList._id)}>❌</button>
              </div>
            </li>
          ))}
        </div>
      </ol>
    </>
  );
}

export default Todo;
