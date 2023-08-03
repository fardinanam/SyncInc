import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../styles/auth.css'
import axios from "axios";

const baseUrl = 'http://localhost:8000/';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [phone, setPhone] = useState('');

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const isValidPassword = (password) => {           
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isValidEmail(email) === false) {
            alert("Please enter a valid email address.");
            return;
        }

        if(isValidPassword(password) === false) {
            alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }
        
        axios.post(baseUrl + 'accounts/register/', {
            first_name: firstname,
            last_name: lastname,
            username: username,
            email: email,
            phone: phone,
            password: password,
        }).then((response) => {
            console.log(response.data);
        })
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name</label>
                <input value={firstname} name="firstname" onChange={(e) => setFirstName(e.target.value)} id="firstname" placeholder="First Name" required/>
                <label htmlFor="lastname">Last Name</label>
                <input value={lastname} name="lastname" onChange={(e) => setLastName(e.target.value)} id="lastname" placeholder="Last Name" required/>
                <label htmlFor="username">Username</label>
                <input value={username} name="username" onChange={(e) => setUserName(e.target.value)} id="username" placeholder="Username" required/>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" required/>
                <label htmlFor="phone">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="01xxxxxxxxx" id="phone" name="phone" required/>
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
                <button type="submit">Register</button>
            </form>
            <p className="link-btn">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    )
}