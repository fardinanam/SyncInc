// import React, { useState } from "react";
// import {Link} from 'react-router-dom';
// import '../styles/auth.css'
// import axios from "axios";

// const baseUrl = 'http://localhost:8000/';

// export const Register = (props) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [firstname, setFirstName] = useState('');
//     const [lastname, setLastName] = useState('');
//     const [username, setUserName] = useState('');
//     const [phone, setPhone] = useState('');

//     const isValidEmail = (email) => {
//         return /\S+@\S+\.\S+/.test(email);
//     }

//     const isValidPassword = (password) => {           
//         return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if(isValidEmail(email) === false) {
//             alert("Please enter a valid email address.");
//             return;
//         }

//         if(isValidPassword(password) === false) {
//             alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
//             return;
//         }
        
//         axios.post(baseUrl + 'accounts/register/', {
//             first_name: firstname,
//             last_name: lastname,
//             username: username,
//             email: email,
//             phone: phone,
//             password: password,
//         }).then((response) => {
//             console.log(response.data);
//         })
//     }

//     return (
//         <div className="auth-form-container">
//             <h2>Register</h2>
//             <form className="register-form" onSubmit={handleSubmit}>
//                 <label htmlFor="firstname">First Name</label>
//                 <input value={firstname} name="firstname" onChange={(e) => setFirstName(e.target.value)} id="firstname" placeholder="First Name" required/>
//                 <label htmlFor="lastname">Last Name</label>
//                 <input value={lastname} name="lastname" onChange={(e) => setLastName(e.target.value)} id="lastname" placeholder="Last Name" required/>
//                 <label htmlFor="username">Username</label>
//                 <input value={username} name="username" onChange={(e) => setUserName(e.target.value)} id="username" placeholder="Username" required/>
//                 <label htmlFor="email">Email</label>
//                 <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" required/>
//                 <label htmlFor="phone">Phone Number</label>
//                 <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="01xxxxxxxxx" id="phone" name="phone" required/>
//                 <label htmlFor="password">Password</label>
//                 <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" required/>
//                 <button type="submit">Register</button>
//             </form>
//             <p className="link-btn">Already have an account? <Link to="/login">Login here</Link></p>
//         </div>
//     )
// }

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link } from "react-router-dom";
import Copyright from "../components/Copyright";
import { baseUrl } from "../utils/config";

const theme = createTheme();

const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}

const isValidPassword = (password) => {           
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!_@$%^&*-])(?=.{8,})/.test(password);
}

const Register = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(e.target.email.value);
        if(isValidEmail(e.target.email.value) === false) {
            alert("Please enter a valid email address.");
            return;
        }

        if (e.target.password.value !== e.target.confirmPassword.value) {
            alert("Passwords do not match.");
            return;
        }

        let response = await fetch(baseUrl + 'accounts/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: e.target.first_name.value,
                last_name: e.target.last_name.value,
                username: e.target.username.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                password: e.target.password.value,
            })
        });

        let data = await response.json();
        console.log(data);

        if (response.status === 200) {
            alert("We have sent you an email. Please verify your email address to login.");
            window.location.href = "/login";
        } else {
            console.log(data.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="username"
                    label="Username"
                    type="username"
                    id="username"
                    autoComplete="username"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    type="phone"
                    id="phone"
                    autoComplete="phone"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    />
                </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign Up
                </Button>
                <Grid container justifyContent="center">
                <Grid item>
                    <Link to="/login">
                    Already have an account? Sign in
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
        </ThemeProvider>
    );
}


export default Register;