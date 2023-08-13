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

import { Link } from "react-router-dom";
import Copyright from "../components/Copyright";
import { baseUrl } from "../utils/config";

import { isValidEmail } from "../utils/validators";
import notifyWithToast from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

const Register = () => {
    const navigate = useNavigate();
    const {setLoading} = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(e.target.email.value);
        if(isValidEmail(e.target.email.value) === false) {
            notifyWithToast("info", "Please enter a valid email address.");
            return;
        }

        if (e.target.password.value !== e.target.confirmPassword.value) {
            notifyWithToast("info", "Passwords do not match.");
            return;
        }

        setLoading(true);
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
        
        setLoading(false);
        let data = await response.json();

        if (response.status === 200) {
            notifyWithToast("description", "Registration successful! We have sent you an email. Please verify your email address to login.");
            navigate('/login');
        } else {
            notifyWithToast("error", data.message);
        }

    };

    return (
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
            <Avatar sx={{ m: 1, bgcolor: "secondary" }}>
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
    );
}


export default Register;