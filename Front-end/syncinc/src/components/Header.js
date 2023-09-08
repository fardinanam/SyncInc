import React, { useContext } from "react";
import Logo from "../assets/logo.svg"
import ProfileMenu from "./ProfileMenu";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import {ColorModeContext} from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '@mui/material/styles';
import NotificationMenu from "./NotificationMenu";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useMediaQuery } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Header = ({open, onDrawerToggle}) => {   
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const colorMode = useContext(ColorModeContext); 
    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1, 
            }}
            color={"main"}
            elevation={0}
        >
            <Toolbar>
                {isMobile &&
                    <IconButton
                        color="disabled"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                    {   open 
                        ? <CloseRoundedIcon />
                        : <MenuRoundedIcon />
                    }
                    </IconButton>
                }
                <Box 
                    component="img"
                    alt="SyncInc. Logo"
                    src={Logo}
                    sx={{mr: 2, height: 30 }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                    SyncInc.
                </Typography>
                {/* <SearchBar /> */}
                {/* <IconButton sx={{ ml: 1 }} onClick={() => {} } color="inherit">
                    <Badge color="primary" badgeContent={10} max={9}>
                        <NotificationsIcon
                            fontSize="medium"
                        />
                    </Badge>
                </IconButton> */}
                <NotificationMenu />
                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                    {!isExtraSmall &&
                        "SyncInc."
                    }
                    </Typography>
                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <ProfileMenu />
            </Toolbar>
        </AppBar>
    )
}

export default Header;