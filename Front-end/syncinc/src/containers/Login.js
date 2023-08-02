import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/auth.css'
import axios from 'axios';

const baseUrl = 'http://localhost:8000/';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(baseUrl + 'accounts/login/', {
            email: email,
            password: password
        }).then((response) => {
            console.log(response.data);
        })
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" required/>
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
                <button type="submit">Log In</button>
            </form>
            <p className="link-btn">Don't have an account? <Link to="/register">Register here.</Link></p>
        </div>
    )
}