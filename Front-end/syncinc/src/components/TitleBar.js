import { Box, Paper, Typography } from "@mui/material"

const TitleBar = ({title, subtitleElement, children}) => {
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
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                    <Box 
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                    {subtitleElement}
                    </Box>
                </Box>
                {children}
            </Paper>
    )
}

export default TitleBar