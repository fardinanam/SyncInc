import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import AuthContext from '../context/AuthContext';

export const Login = (props) => {
    let {loginUser} = useContext(AuthContext);

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={loginUser}>
                <label htmlFor="email">email</label>
                <input type="email" placeholder="youremail@gmail.com" id="email" name="email" required/>
                <label htmlFor="password">password</label>
                <input type="password" placeholder="********" id="password" name="password" required/>
                <button type="submit">Log In</button>
            </form>
            <p className="link-btn">Don't have an account? <Link to="/register">Register here.</Link></p>
        </div>
    )
}