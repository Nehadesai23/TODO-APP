import React from 'react'
import logo2 from '../asset/logo2.png';
import '../styles/Home.css'
import { User } from "react-feather";
import { Link } from 'react-router-dom';




const Home = () => {


  return (
    <div className='wrapper'>
      <nav className='navbar'>
        <img src={logo2} alt='Logo' />
        <h5 style={{color:"white"}}>Todo App</h5>
        <div className='navigation'>
        <ul>
          <li className='items'><a href=''>Home </a></li>
          <li className='items'><a href=''>About Us</a></li>
          <li className='items'><a href=''>Contact Us</a></li>
          <li className='login'><Link to='/login'><User/>Login</Link></li>

        </ul>
        </div>
 
         {/* <button className='btn-login'>Sign-In</button>  */}
      </nav>

      <section className="banner">
            <div className="banner-content">
                <h2 className="banner-title">Your roadmap to success starts here – use our to-do app!!</h2>
                <p className="banner-caption">Your daily tasks, your way.</p>
                <p className="banner-caption">Plan, prioritize, and conquer.</p>
                <p className="banner-caption">Effortless productivity, anytime, anywhere.</p>
            </div>
        </section>
    </div>
  )
}

export default Home