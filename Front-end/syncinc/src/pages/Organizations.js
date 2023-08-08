import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CreateOrgModal from '../components/CreateOrgModal';
import { Grid, Typography } from '@mui/material';
import SummaryCard from '../components/SummaryCard';
import WorkIcon from '@mui/icons-material/Work';
import MainLayout from '../components/MainLayout';

import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';

const Organizations = () => {
    const navigate = useNavigate();
    const {authTokens} = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // TODO: Use Toasts instead of alerts
    let [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = (organization) => {
        if (organization) {
            setOrganizations([...organizations, organization]);
        }
        setIsOpen(false);
    }

    // call the api to get the list of organizations
    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}get_organizations/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            console.log(response);
            console.log(response.data);
            console.log(response.data.data);
            setOrganizations(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    return (
        <>
            <Box 
                display= 'flex'
                alignItems='center'
            >
                <Box flexGrow={1}>
                    <Typography 
                        variant='h5'
                        sx={{ fontWeight: 'bold' }}
                    >Your Organizations</Typography>
                </Box>
                <Button variant='contained' onClick={handleOpen}><AddRoundedIcon /> Organization</Button>
                <CreateOrgModal open={isOpen} handleClose={handleClose} handleOpen={handleOpen} />
            </Box>
            <Grid  
                container 
                spacing={3}
                paddingTop={2}
                columns={{ xs: 12, sm: 6, md: 3 }}
            >
                {
                    organizations?.map((organization, idx) => (
                        <Grid 
                            item 
                            key={`organization-${idx}`}
                        >
                        <SummaryCard
                            title={organization.name}
                            count={organization.num_projects}
                            name="Projects"
                            onClick={() => navigate(`/organization/${organization.id}/projects`)}  
                        >
                            <WorkIcon fontSize='large' color='primary' />
                        </SummaryCard>
                        </Grid>
                    ))
                }
            </Grid>

        </>
    )
}

export default Organizations;