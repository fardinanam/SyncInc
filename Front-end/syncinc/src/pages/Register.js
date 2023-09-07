import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";
import { baseUrl } from "../utils/config";

import { isValidEmail, isValidNumber, isValidUsername } from "../utils/validators";
import notifyWithToast from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import AuthLayout from "../components/AuthLayout";
import { isValidName } from "../utils/validators";
import { Divider } from "@mui/material";

const Register = () => {
    const navigate = useNavigate();
    const {setLoading} = useLoading();
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

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
            if (data?.data?.email) {
                notifyWithToast("error", data.data.email[0]);
            } else if (data?.data?.username) {
                notifyWithToast("error", data.data.username[0]);
            } else {
                notifyWithToast("error", "Something went wrong. Please try again.");
            }
        }

    };

    useEffect(() => {
        if (isFirstNameValid && isLastNameValid && isEmailValid && isUsernameValid && isPhoneValid) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [isFirstNameValid, isLastNameValid, isEmailValid, isUsernameValid, isPhoneValid]);

    return (
        <AuthLayout>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
                p={6}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                        error={!isFirstNameValid}
                        autoComplete="given-name"
                        name="first_name"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        size="small"
                        onChange={(e) => {
                            if (e.target.value === "" || isValidName(e.target.value)) {
                                setIsFirstNameValid(true);
                            }
                            else {
                                setIsFirstNameValid(false);
                            }
                        }}
                        helperText={!isFirstNameValid ? "Name should only contain letters and spaces" : ""}
                    />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                        error={!isLastNameValid}
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="last_name"
                        autoComplete="family-name"
                        size="small"
                        onChange={(e) => {
                            if (e.target.value === "" || isValidName(e.target.value)) {
                                setIsLastNameValid(true);
                            }
                            else {
                                setIsLastNameValid(false);
                            }
                        }}
                        helperText={!isLastNameValid ? "Name should only contain letters and spaces" : ""}
                    />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        error={!isEmailValid}
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        size="small"
                        onChange={(e) => {
                            if (e.target.value === "" || isValidEmail(e.target.value)) {
                                setIsEmailValid(true);
                            }
                            else {
                                setIsEmailValid(false);
                            }
                        }}
                        helperText={!isEmailValid ? "Please enter a valid email address" : ""}
                    />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        error={!isUsernameValid}
                        required
                        fullWidth
                        name="username"
                        label="Username"
                        type="username"
                        id="username"
                        autoComplete="username"
                        size="small"
                        onChange={(e) => {
                            if (e.target.value === "" || isValidUsername(e.target.value)) {
                                setIsUsernameValid(true);
                            }
                            else {
                                setIsUsernameValid(false);
                            }
                        }}
                        helperText={!isUsernameValid ? "Username should only contain letters, numbers, '_', '.' and should start with a letter" : ""}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        error={!isPhoneValid}
                        fullWidth
                        name="phone"
                        label="Phone Number"
                        type="phone"
                        id="phone"
                        autoComplete="phone"
                        size="small"
                        onChange={(e) => {
                            if (e.target.value === "" || isValidNumber(e.target.value)) {
                                setIsPhoneValid(true);
                            }
                            else {
                                setIsPhoneValid(false);
                            }
                        }}
                        helperText={!isPhoneValid ? "Please enter a valid phone number" : ""}
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
                        size="small"
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
                        size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            disabled={isSubmitDisabled}
                        >
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
                <Divider>or</Divider>
                <Grid container>
                    <Grid item xs={12}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2}}
                        >
                            Already have an account? Sign in
                        </Button>

                    </Grid>
                </Grid>
            </Box>
            
        </AuthLayout>
    );
}


export default Register;