import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import logo2 from '../asset/logo2.png';
import NavBar from './Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Todo.css'
// import NavbarL from './Navbar';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [updateTodoId, setUpdateTodoId] = useState('');
  const [updateTodoText, setUpdateTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const [items, setItems] = useState([]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('user'));
    if (items) {
      setItems(items);
    }
  }, []);

  console.log(items)


  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
  }, []);


  useEffect(() => {
    fetchTodos();
  }, [items]);

  const fetchTodos = async () => {
    const response = await axios.get(`http://localhost:8081/todo?userId=${items.userId}`);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      const formattedDateTime = selectedDate ? selectedDate.toISOString() : null;
      const response = await axios.post('http://localhost:8081/todo', {
        title: newTodo,
        completed: false,
        dateTime: formattedDateTime,
        userId: items.userId
      });
      const newTodoId = response.data.id;
      setTodos([
        ...todos,
        { id: newTodoId, title: newTodo, completed: false, dateTime: new Date().toISOString() },
      ]);
      setNewTodo('');
    }
  };

  const updateTodo = async (id, completed, title) => {
    const updatedCompleted = !completed;
    const response = await axios.put(`http://localhost:8081/todo/${id}`, {
      completed: updatedCompleted,
      title: title,
    });

    if (response.status === 200) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedCompleted } : todo
        )
      );
    }
  };

  const deleteTodo = async (id) => {
    const response = await axios.delete(`http://localhost:8081/todo/${id}`);
    if (response.status === 200) {
      fetchTodos();
    }
  };

  const handleTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleUpdateInputChange = (event) => {
    setUpdateTodoText(event.target.value);
  };

  const openUpdateTodoForm = (id, title) => {
    setUpdateTodoId(id);
    setUpdateTodoText(title);
  };

  const cancelUpdateTodo = () => {
    setUpdateTodoId('');
    setUpdateTodoText('');
  };

  const saveUpdatedTodo = async () => {
    if (updateTodoText.trim() !== '') {
      const response = await axios.put(
        `http://localhost:8081/todo/${updateTodoId}`,
        {
          title: updateTodoText,
        }
      );
      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === updateTodoId ? { ...todo, title: updateTodoText } : todo
          )
        );
        setUpdateTodoId('');
        setUpdateTodoText('');
      }
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {

    // Clear the local storage
    localStorage.clear();

    // Set the user to logged out

    // Navigate to the login page
    navigate('/');
  };

  return (
    <>
     <NavBar />
      <div className='body'>
        <div className="App">
          <h1>Todo List</h1>
          <div className="todo-form">
            <input type="text" value={newTodo} onChange={handleTodoChange} />
            <DatePicker className="datep"
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="d MMMM, yyyy h:mm aa"
              placeholderText='Select date and time'
            />
            <button className='addbtn' onClick={addTodo}>Add Todo</button>
          </div>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => updateTodo(todo.id, todo.completed, todo.title)}
                />
                {todo.id === updateTodoId ? (
                  <>
                    <input
                      type="text"
                      value={updateTodoText}
                      onChange={handleUpdateInputChange}
                    />
                    <button className="save-btn" onClick={saveUpdatedTodo}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={cancelUpdateTodo}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className={todo.completed ? 'completed' : ''}>
                      {todo.title}
                    </span>


                    <span className="datetime" style={{ marginLeft: '10px' }}>
                      {todo.dateTime && new Date(todo.dateTime).toLocaleString()}
                    </span>
                    <button
                      className="update-btn"
                      onClick={() => openUpdateTodoForm(todo.id, todo.title)}
                    >
                      Update
                    </button>
                  </>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  )
}

export default Todo;