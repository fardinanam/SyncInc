import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Logo from "../assets/logo.svg"
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import { AppBar, Button, Icon, Toolbar, Typography } from "@mui/material";

const Header = () => {
    let {user} = useContext(AuthContext)
    
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Icon sx={{
                    width: '3rem',
                }} >
                    <img src={Logo} alt="SyncInc Logo" />
                </Icon>
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