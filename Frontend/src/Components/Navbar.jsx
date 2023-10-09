import React from 'react';
import { Link } from 'react-router-dom';
import logo2 from '../asset/logo2.png';
import '../styles/Navbar.css';

const NavBar = () => {
  return (
    <nav className='navbar-login'>
      <img src={logo2} alt='Logo' />
      <h5 className='name'>Todo App</h5>
      <div className='navigation-login'>
        <ul>
          {/* <li className='items'><Link to='/'>Home</Link></li> */}
         
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
