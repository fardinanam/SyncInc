import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

const MainLayout = (props) => {
    const theme = useTheme();
    const background = theme.palette.background[theme.palette.mode]
    const mainColor = theme.palette.main[theme.palette.mode]

    const {children} = props;
        return (
        <Box 
            sx={{ 
                display: 'flex', 
                backgroundColor: {mainColor},
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
                    backgroundColor: background,
                    overflow: 'auto',
                    height: '100vh',
                    borderRadius: '0 3rem 3rem 0',
                }}
            >
                <Toolbar position='fixed'/>
                {children}
            </Box>
        </Box>
    )
}

export default MainLayout;