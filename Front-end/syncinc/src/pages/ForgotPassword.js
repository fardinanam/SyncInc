import { Container } from "@mui/material"
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import notifyWithToast from "../utils/toast"
import { baseUrl } from "../utils/config";

const ForgotPassword = () => {
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
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >

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
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Email
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default ForgotPassword