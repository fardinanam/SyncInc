import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AuthContext from '../context/AuthContext';
import NotificationCard from './NotificationCard';
import { Stack } from '@mui/material';

import SocketContext from '../context/SocketContext';

import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 1,
        top: 3,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));



const NotificationMenu = () => {
    let {user} = useContext(AuthContext);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    
    const navigate = useNavigate();
    const {chatSocket, notifications, setNotifications} = useContext(SocketContext)
    const [showNotifications, setShowNotifications] = useState(notifications);
    console.log('chatSocket:', chatSocket)
    const handleOpenNotificationMenu = (event) => {
        if (notifications.length > 0) {
            setShowNotifications(notifications);
            const notificationData = notifications.map(notification => ({
                id: notification.id,
                status: 'read'
            }));
            console.log(notificationData)
            chatSocket.send(JSON.stringify(notificationData));
            setNotifications([]);
            console.log('handleOpenNotificationMenu')
            setAnchorElNotification(event.currentTarget);
            
        }
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
        console.log('handleCloseNotificationMenu')
    };

    const handleNotification = (type) => {
        handleCloseNotificationMenu();
        if(type === 'org_invite') {
            navigate('/invites');
        } else if(type === 'org_invite_accept') {
            navigate('/organizations');
        }
    };


    // dummy notifications
    // let notifications = [
    //     {
    //         id: 1,
    //         type: "Linked",
    //         description: user?.username + " has invited you to join SyncInc.",
    //         sender: user,
    //         link: "/invites",
    //     }
    // ]
    console.log('Notifications:', notifications)

    return (
        <>
            <IconButton onClick={handleOpenNotificationMenu} color="inherit">
            <StyledBadge color="primary" 
                badgeContent={notifications.length} max={9}>
                <NotificationsIcon
                    fontSize="medium"
                />
            </StyledBadge>
            </IconButton>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElNotification}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotificationMenu}
            >
                <Stack justifyContent="center" spacing={1}>
                    {showNotifications?.map((notification, idx) => (
                        <MenuItem
                            key={`notification-${idx}`}
                            onClick={ () => {handleNotification(notification.type)} }
                        >
                            <NotificationCard notification={ notification } />
                        </MenuItem>
                    ))}
                </Stack>
            </Menu>
        </>
    )
}

export default NotificationMenu;