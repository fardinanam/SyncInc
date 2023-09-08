// import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Avatar, Stack, Typography, Box } from '@mui/material';

const NotificationCard = (props) => {
    const {notification} = props;

    const getNotificationMessage = (notification) => {
        let message = "";
        switch(notification.type) {
            case "General":
                message = `${notification.description}`;
                break;
            case "Linked":
                message = `${notification.description}`;
                break;
            default:
                message = `Some notification ${notification.description}`;
                break;
        }
        return message;
    };



    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 1,
                '&:hover': {
                    cursor: "pointer",
                },
                backgroundColor: "transparent",
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2}>
                    <Box 
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={20}
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
                            {getNotificationMessage(notification)}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>        
    );
}

export default NotificationCard;