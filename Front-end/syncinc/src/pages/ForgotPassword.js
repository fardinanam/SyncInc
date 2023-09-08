import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import notifyWithToast from "../utils/toast"
import { baseUrl } from "../utils/config";
import AuthLayout from "../components/AuthLayout";
import InputAdornment from '@mui/material/InputAdornment';
import MailRoundedIcon from '@mui/icons-material/MailRounded';  
import { useState } from "react";
import { isValidEmail } from "../utils/validators";

const ForgotPassword = () => {
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const body = {
            email: e.target.email.value
        }

        try {
            const response = await axios.post(
                `${baseUrl}accounts/forgot_password/`, 
                body, 
                config
            );

            if (response.status === 200) {
                notifyWithToast("description", "We have sent you an email to reset your password.");
            }
        } catch(error) {
            notifyWithToast("error", "Email does not exist");
        }
    }
    return (
        <AuthLayout>
            <Typography component="h1" variant="h5">
                Forgot Password
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
            >
                <TextField
                    error={!isEmailValid}
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

                    onChange={(e) => {
                        if (isValidEmail(e.target.value)) {
                            setIsEmailValid(true);
                        }
                        else {
                            setIsEmailValid(false);
                        }
                    }}
                    helperText={!isEmailValid ? "Please enter a valid email address" : ""}

                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!isEmailValid}
                >
                    Send Email
                </Button>
            </Box>
        </AuthLayout>
    )
}

export default ForgotPassword