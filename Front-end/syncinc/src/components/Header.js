import React, { useContext } from "react";
import Logo from "../assets/logo.svg"
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import {ColorModeContext} from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

const Header = () => {   
    const theme = useTheme();
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
                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <ProfileMenu />
            </Toolbar>
        </AppBar>
    )
}

export default Header;