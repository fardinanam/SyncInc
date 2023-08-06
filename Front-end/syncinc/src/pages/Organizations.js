import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CreateOrgModal from '../components/CreateOrgModal';
import { Grid } from '@mui/material';
import SummaryCard from '../components/SummaryCard';
import WorkIcon from '@mui/icons-material/Work';
import MainLayout from '../components/MainLayout';

const Organizations = () => {
    // TODO: Use Toasts instead of alerts
    let [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <MainLayout>
            <Box 
                display= 'flex'
                justifyContent= 'end'
                
                alignItems='center'
            >
                <Button variant='contained' onClick={handleOpen}><AddRoundedIcon />Organization</Button>
                <CreateOrgModal open={isOpen} handleClose={handleClose} handleOpen={handleOpen} />
            </Box>
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 2, sm: 4, md: 12 }}
            
            >
                
                <Grid item>
                <SummaryCard
                    title="Robi Axiata Ltd."
                    count={3}
                    name="Projects"  
                >
                    <WorkIcon fontSize='large' color='primary' />
                </SummaryCard>
                </Grid>
                <Grid item>
                <SummaryCard
                    title="Sumon and Co."
                    count={2}
                    name="Projects"
                >
                    <WorkIcon fontSize='large' color='secondary' />
                </SummaryCard>
                </Grid>
            </Grid>

        </MainLayout>
    )
}

export default Organizations;