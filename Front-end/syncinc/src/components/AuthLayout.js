import { Container, Grid, Typography, Box, CssBaseline, SvgIcon } from "@mui/material"
import Logo from "../assets/logo.svg"
import Copyright from "./Copyright"

const AuthLayout = ({children}) => {
    return (
        <Box
            component="main"
            sx={{
                height: '100vh',
                width: '100vw',
                margin: 0,
            }}
        >
            <CssBaseline />
            <Grid
                container

            >
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh'
                        }}
                    >
                        <Box 
                            component="img"
                            alt="SyncInc. Logo"
                            src={Logo}
                            sx={{ height: '20%' }}
                        />
                        <Typography variant="h1" fontWeight='bold'>
                            SyncInc.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                            padding: '10% 10%',
                            maxWidth: '600px'
                        }}
                    >
                        {children}
                    <Copyright sx={{ mt: 2 }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AuthLayout