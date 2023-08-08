import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid, Typography } from '@mui/material';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const navigate = useNavigate();

    return (
        <>
            <Box 
                display= 'flex'                
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}
                    flexGrow={1}
                >
                    Your Projects
                </Typography>
                <Button variant='contained' onClick={() => navigate('/add_project')}><AddRoundedIcon />project</Button>
            </Box>
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 12, sm: 6, md: 3 }}
            >
            </Grid>
        </>

    )
}

export default Projects;