import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup';
import Todo from './Components/Todo';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<Todo />} />
        
    </Routes>
    </BrowserRouter>
    
  )
}

export default App