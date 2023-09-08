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

    const handleOpenNotificationMenu = (event) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const handleNotification = (link) => {
        handleCloseNotificationMenu();
        navigate(link);
    };

    // dummy notifications
    let notifications = [
        {
            id: 1,
            type: "Linked",
            description: user?.username + " has invited you to join SyncInc.",
            sender: user,
            link: "/invites",
        }
    ]

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
                    {notifications?.map((notification, idx) => (
                        <MenuItem
                            key={`notification-${idx}`}
                            onClick={handleNotification.bind(this, notification.link)}
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