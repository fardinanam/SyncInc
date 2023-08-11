import { useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AuthContext from '../context/AuthContext';
import { Toolbar } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


const ProfileMenu = () => {
    let {user, logoutUser} = useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = useState(null);

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

    const handleAccountSettings = () => {
        handleCloseUserMenu();
        window.location.href = "/profile";
    }

    return (
        <Toolbar sx={{ flexGrow: 0 }}>
            <Avatar alt={user.first_name + ' ' + user.last_name} src="/static/images/avatar/2.jpg" />
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
                    key="account-settings" 
                    onClick={handleAccountSettings}
                >
                    <AccountCircleIcon />
                    <Typography textAlign="center" ml={1}>Account</Typography>
                </MenuItem>
                <MenuItem 
                    key="logout" 
                    onClick={handleLogout}
                >
                    <LogoutRoundedIcon />
                    <Typography textAlign="center" ml={1}>Logout</Typography>
                </MenuItem>
            </Menu>
        </Toolbar>
    )
}

export default ProfileMenu;