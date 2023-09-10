import { Avatar, Stack, Typography, Box } from '@mui/material';

const NotificationCard = (props) => {
    const {notification} = props;
    
    return (
        <Stack direction="row" spacing={1}
            width="inherit"
        >
            <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Avatar
                    alt={notification.sender.name}
                    src={notification.sender.profile_picture && notification.sender.profile_picture}
                />
            </Box>
            <Box
                display="flex"
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                flexWrap="wrap"
                width="inherit"
            >
                <Typography
                    variant="body1"
                    width="15rem"
                    sx={{
                        'overflow-wrap': 'break-word',
                    }}
                >
                    {notification.message}
                </Typography>
            </Box>
        </Stack>  
    );
}

export default NotificationCard;