import { useContext, useState, useEffect } from 'react';
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
    const [newNotifications, setNewNotifications] = useState([]);
    console.log('chatSocket:', chatSocket)

    useEffect(() => {
        console.log('notifications:', notifications)
        const unreadNotifications = notifications.filter(notification => notification.read === false);
        console.log('unreadNotifications:', unreadNotifications)
        setNewNotifications(unreadNotifications);
    }, [notifications]);
    const handleOpenNotificationMenu = (event) => {
        if (notifications.length > 0) {
            const notificationData = notifications.map(notification => ({
                id: notification.id,
                status: 'read'
            }));
            console.log(notificationData)
            chatSocket.send(JSON.stringify(notificationData));
            notifications.forEach(notification => {
                notification.read = true;
            });
            setNewNotifications([]);
            console.log('handleOpenNotificationMenu')
            setAnchorElNotification(event.currentTarget);
        }
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
        console.log('handleCloseNotificationMenu')
    };

    const handleNotification = (attribute) => {
        handleCloseNotificationMenu();
        console.log(attribute)
        if(attribute === 'org_invite') {
            console.log('org_invite')
            navigate('/invites');
            navigate(0)
        } else if(attribute.startsWith('org_invite_ac')) {
            const orgId = attribute.split('_')[2];
            navigate('/organization/' + orgId + '/employees');
            navigate(0);
        } else if(attribute.startsWith('task_assigned')) {
            const taskId = attribute.split('_')[2];
            navigate('/task/' + taskId);
            navigate(0);
        }
    };

    return (
        <>
            <IconButton onClick={handleOpenNotificationMenu} color="inherit">
            <StyledBadge color="primary" 
                badgeContent={newNotifications.length} max={9}>
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
                            onClick={ () => {handleNotification(notification.attribute)} }
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