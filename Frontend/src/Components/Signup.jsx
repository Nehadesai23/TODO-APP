import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import '../styles/Signup.css'
import NavBar from './Navbar';
import logo2 from '../asset/logo2.png';
import Validation from './SignupValidation';
import axios from 'axios';
// import NavbarL from './Navbar';

const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const err = (Validation(values));
        setErrors(err);
        if (err.name === "" && err.email === "" && err.password === "") {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/login');
                })
                .catch(err => console.log(err));
        }

    }
    return (
        <>
          <NavBar />
            <div className='d-flex justify-content-center align-items-center vh-100'>

                <div className='bg-white p-3 rounded w-25 form'>

                    <h4>Create Your account here</h4>
                    <h2>Sign-Up</h2>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor="name"><strong>Name</strong></label>
                            <input type="text" placeholder='Enter Name' name='name'
                                onChange={handleInput} className='form-control rounded-0' />
                            {errors.name && <span className='text-danger'>{errors.name}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="email"><strong>Emai</strong>l</label>
                            <input type="email" placeholder='Enter Email' name='email'
                                onChange={handleInput} className='form-control rounded-0' />
                            {errors.email && <span className='text-danger'>{errors.email}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input type="password" placeholder='Enter Password' name='password'
                                onChange={handleInput} className='form-control rounded-0' />
                            {errors.password && <span className='text-danger'>{errors.password}</span>}
                        </div>
                        <button type="submit" className='btn btn-success w-100 rounded-0' ><strong>Sign Up</strong></button>
                        <p>You are agree to Our terms and Policies</p>
                        <NavLink to="/Login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Log in</NavLink>
                    </form>
                </div>
            </div>
        </>
    )
}


export default Signup