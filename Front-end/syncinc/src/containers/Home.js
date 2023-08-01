import React, { useState } from "react";
import {Link} from 'react-router-dom';
import '../styles/auth.css'

export const Home = (props) => {
    return (
        <div className="auth-form-container">
            <p>Home</p>
            <p className="link-btn">You are not logged in. <Link to="/login">Login here.</Link></p>
        </div>
    );
}