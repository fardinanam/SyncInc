import { Box, Typography } from "@mui/material"

const Tasks = () => {
    return (
        <>
            <Box 
                display= 'flex'                
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}
                    flexGrow={1}
                >
                    Your Tasks
                </Typography>
            </Box>
        </>
    )

}

export default Tasks;