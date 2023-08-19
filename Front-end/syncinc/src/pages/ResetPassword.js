import {useParams, useNavigate} from 'react-router-dom';
import { Box, Container, TextField, Typography, Button, Grid, CssBaseline } from '@mui/material';
import notifyWithToast from '../utils/toast';
import axios from 'axios';
import { baseUrl } from '../utils/config';

const ResetPassword = () => {
    const navigate = useNavigate();
    const username = useParams().username;
    const token = useParams().token;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPassword = e.target.new_password.value;
        const confirmPassword = e.target.confirm_password.value;

        if (newPassword !== confirmPassword) {
            notifyWithToast("error", "Passwords do not match");
            return;
        }

        const config = {
            header: {
                "Content-Type": "application/json" 
            }
        }

        const body = {
            username: username,
            email_token: token,
            password: newPassword
        }

        try {
            const response = await axios.post(`${baseUrl}accounts/reset_password/`,
                body,
                config
            );

            if (response.status === 200) {
                notifyWithToast("success", "Password has been reset");
                navigate("/login");
            }
        } catch (error) {
            notifyWithToast("error", "Something went wrong");
        }
    }

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
                <Typography component="h1" variant="h5">
                    Change Password
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <TextField
                        required
                        fullWidth
                        type='password'
                        id="new_password"
                        label="New Password"
                        name="new_password"
                    />
                    <TextField
                        required
                        fullWidth
                        type='password'
                        id="confirm_password"
                        label="Confirm Password"
                        name="confirm_password"
                        sx={{ mt: 2 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default ResetPassword;