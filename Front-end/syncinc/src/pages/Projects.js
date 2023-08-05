import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid } from '@mui/material';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <Box 
                display= 'flex'
                justifyContent= 'end'
                
                alignItems='center'
            >
                <Button variant='contained' onSubmit={() => navigate('/addProject')}><AddRoundedIcon />project</Button>
            </Box>
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 12, sm: 6, md: 3 }}
            >
            </Grid>
        </MainLayout>

    )
}

export default Projects;