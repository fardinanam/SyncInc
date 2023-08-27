import { Box, Paper, Typography } from "@mui/material"

const TitleBar = ({title, subtitle, children}) => {
    return (
        <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: "0.5rem",
                    mb: 2,
                }}
                elevation={0}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'left',
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        {title}
                    </Typography>
                    <Typography 
                        variant="h6"
                        color="primary"
                    >
                        {subtitle}
                    </Typography>
                </Box>
                {children}
            </Paper>
    )
}

export default TitleBar