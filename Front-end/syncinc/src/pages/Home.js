import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../styles/auth.css'
import AuthContext from "../context/AuthContext";

export const Home = (props) => {
    const {loggedIn} = React.useContext(AuthContext);
    return (
        <div className="auth-form-container">
            {loggedIn ? 
                <p>Welcome, User!</p> :
                <p className="link-btn">You are not logged in. <Link to="/login">Login here.</Link></p>
            }   
        </div>
    );
}