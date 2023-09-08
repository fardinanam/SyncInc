import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { Divider, InputAdornment} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import AuthContext from '../context/AuthContext';
import AuthLayout from "../components/AuthLayout";
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { isValidEmail } from "../utils/validators";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitDisabled}
                    size="small"
                    sx={{ mt: 2, mb: 2 }}
                >
                Sign In
                </Button>
                <Divider
                    sx={{
                        mb: 2,
                    }}
                > or </Divider>
                <Grid container
                    spacing={1}
                >
                <Grid item xs={6}>
                    {/* <Link to="/forgot-password">
                        Forgot password?
                    </Link> */}
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot password?
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    {/* <Link to="/register">
                        Don't have an account? Sign Up
                    </Link> */}
                    <Button 
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    );
}


export default Login;