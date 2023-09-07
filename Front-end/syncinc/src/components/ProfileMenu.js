import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AuthContext from '../context/AuthContext';
import { Divider, Toolbar } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import TelegramIcon from '@mui/icons-material/Telegram';
import { baseUrl } from '../utils/config';


const ProfileMenu = () => {
    let {user, logoutUser} = useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logoutUser();
        handleCloseUserMenu();
    };

    const handleAccount = () => {
        handleCloseUserMenu();
        navigate('/profile');
    }

    const handleInvites = () => {
        handleCloseUserMenu();
        navigate('/invites');
    }

    return (
        <Toolbar sx={{ flexGrow: 0 }}>
            <Avatar alt={user.first_name + ' ' + user.last_name} src={user.profile_picture && user.profile_picture} />
            <Typography ml={1}>
                {user.first_name + " " + user.last_name}
            </Typography>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ fontSize: "large" }}>
                    <ExpandMoreIcon />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem 
                    key="account" 
                    onClick={handleAccount}
                >
                    <AccountCircleIcon />
                    <Typography textAlign="center" ml={1}>Profile</Typography>
                </MenuItem>
                <MenuItem 
                    key="invites" 
                    onClick={handleInvites}
                >
                    <TelegramIcon />
                    <Typography textAlign="center" ml={1}>Invitations</Typography>
                </MenuItem>
                <Divider />
                <MenuItem 
                    key="logout" 
                    onClick={handleLogout}
                >
                    <ExitToAppRoundedIcon />
                    <Typography textAlign="center" ml={1}>Logout</Typography>
                </MenuItem>
                
            </Menu>
        </Toolbar>
    )
}

export default ProfileMenu;