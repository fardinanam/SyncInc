import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../styles/auth.css'

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name</label>
                <input value={firstname} name="firstname" onChange={(e) => setFirstName(e.target.value)} id="firstname" placeholder="First Name" />
                <label htmlFor="lastname">Last Name</label>
                <input value={lastname} name="lastname" onChange={(e) => setLastName(e.target.value)} id="lastname" placeholder="Last Name" />
                <label htmlFor="username">Username</label>
                <input value={username} name="username" onChange={(e) => setUserName(e.target.value)} id="username" placeholder="Username" />
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="phone">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="01xxxxxxxxx" id="phone" name="phone" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Register</button>
            </form>
            <p className="link-btn">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    )
}