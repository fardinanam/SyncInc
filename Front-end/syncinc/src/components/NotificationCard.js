// import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Avatar, Stack, Typography, Box } from '@mui/material';

const NotificationCard = (props) => {
    const {notification} = props;
    console.log(notification)
    
    return (
        <Card
            elevation={0}
            sx={{
                '&:hover': {
                    cursor: "pointer",
                },
                backgroundColor: "transparent",
            }}
        >
            <CardContent
                sx={{
                    padding: '0 !important',
                }}
            >
                <Stack direction="row" spacing={1}>
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
                    <Stack
                        direction="column"
                        justifyContent="center"
                    >
                        <Typography
                            variant="body1"
                        >
                            {notification.message}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>        
    );
}

export default NotificationCard;