import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid } from '@mui/material';

const MainLayout = (props) => {
    const {children} = props;
        const bgColor = props.bgColor ? props.bgColor : 'background.main';
        return (
        <Box 
            sx={{ 
                display: 'flex', 
                backgroundColor: 'main',
            }}
        >
            <CssBaseline />
            <Header />
            <SideBar />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    backgroundColor: bgColor,
                    overflow: 'auto',
                    height: '100vh',
                }}
            >
                <Toolbar position='fixed'/>
                {children}
            </Box>
        </Box>
    )
}

export default MainLayout;