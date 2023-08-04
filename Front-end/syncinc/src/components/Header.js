import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Logo from "../assets/logo.svg"
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import { AppBar, Box, Button, Icon, Toolbar, Typography } from "@mui/material";

const Header = () => {
    let {user} = useContext(AuthContext)
    
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
                <SearchBar />
                <ProfileMenu />
            </Toolbar>
        </AppBar>
    )
}

export default Header;