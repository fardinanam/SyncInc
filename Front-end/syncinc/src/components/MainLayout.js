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

        return (
        <Box 
            sx={{ display: 'flex', 
            backgroundColor: '#000000',}}
        >
            <CssBaseline />
            <Header />
            <SideBar />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    backgroundColor: 'background.main',
                    overflow: 'auto',
                    height: '100vh',
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}

export default MainLayout;