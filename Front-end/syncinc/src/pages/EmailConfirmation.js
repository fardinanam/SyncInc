import { useEffect, useState } from "react";
import { baseUrl } from "../utils/config";
import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, CssBaseline } from '@mui/material';
import axios from "axios";

const EmailConfirmation = () => {
    const { token } = useParams();
    const { setLoading } = useLoading();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const verifyEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}accounts/verify-email/${token}/`
            );

            if (response.status === 200) {
                setIsVerified(true);
            }
        } catch (error) {
            setIsVerified(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        verifyEmail();
        setIsLoading(false);
    }, []);

    return (
        !isLoading &&
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
                <Typography 
                    variant="h7"
                    fontWeight="bold"
                >
                    {
                        isVerified ?
                            "Email has been verified!"
                            :
                            "Sorry! We could not verified your email ☹"
                    }
                </Typography>
                <Box
                    sx={{ mt: 3 }}
                >
                    
                    {
                        isVerified ?
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3, mb: 2 }}
                                component={Link}
                                to="/login"
                            >
                                Go To Login
                            </Button>
                            :
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                    component={Link}
                                    to="/register"
                                >
                                    Go To Register
                                </Button>
                                <Divider> or </Divider>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                    component={Link}
                                    to="/login"
                                >
                                    Login With Existing Account
                                </Button>
                            </>
                    }
                </Box>
            </Box>
        </Container>
    );
}

export default EmailConfirmation;