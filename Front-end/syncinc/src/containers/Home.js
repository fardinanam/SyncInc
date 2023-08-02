import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../styles/auth.css'
import { useContext } from "react";
import { LoginContext } from "../App";

export const Home = (props) => {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    return (
        <div className="auth-form-container">
            {loggedIn ? 
                <p>Welcome, User!</p> :
                <p className="link-btn">You are not logged in. <Link to="/login">Login here.</Link></p>
            }   
        </div>
    );
}