import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {CssBaseline, InputAdornment} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import AuthContext from '../context/AuthContext';
import AuthLayout from "../components/AuthLayout";
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { isValidEmail } from "../utils/validators";

const Login = () => {
    let {loginUser} = useContext(AuthContext);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const handleEmailChange = (e) => {
        if (e.target.value === "") {
            setEmailError(false);
            setIsSubmitDisabled(true);
            return;
        }

        const isEmailValid = isValidEmail(e.target.value);
        if (isEmailValid) {
            setEmailError(false);
            setIsSubmitDisabled(false);
        } else {
            setEmailError(true);
            setIsSubmitDisabled(true);
        }
    }

    return (
        <AuthLayout>
            <Avatar sx={{ m: 1, bgcolor: "secondary" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={loginUser}
                noValidate
                sx={{ mt: 1 }}
            >
                <TextField
                    error={emailError}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MailRoundedIcon />
                            </InputAdornment>
                        ),
                    }}  
                    onChange={handleEmailChange}
                />
                
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <KeyRoundedIcon />
                            </InputAdornment>
                        ),      
                    }}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitDisabled}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item xs>
                    <Link to="/forgot-password">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/register">
                        Don't have an account? Sign Up
                    </Link>
                </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    );
}


export default Login;