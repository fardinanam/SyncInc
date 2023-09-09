import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { CreateOrgModal } from '../components/Modals';
import { Fab, Grid, Typography } from '@mui/material';
import SummaryCard from '../components/SummaryCard';
import WorkIcon from '@mui/icons-material/Work';
import notifyWithToast from '../utils/toast';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { fabStyle } from '../styles/styles';
import SearchBar from '../components/SearchBar';

const Organizations = () => {
    const navigate = useNavigate();
    const {authTokens} = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);
    const [filteredOrganizations, setFilteredOrganizations] = useState([]);

    const {setLoading} = useLoading();
    useEffect(() => {
        fetchOrganizations();
    }, []);

    let [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = (type, data) => {
        if (type === 'success') {
            setOrganizations([...organizations, data]);
            setIsOpen(false);
            notifyWithToast(type, `${data.name} created successfully`);
        } else if (type === 'error') {
            setIsOpen(false);
            notifyWithToast(type, data.message);
        } else {
            setIsOpen(false);
        }
    }

    // call the api to get the list of organizations
    const fetchOrganizations = async () => {
        setLoading(true);
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
            
            setOrganizations(response.data.data);
            
        } catch (error) {
            console.log(error.response.data.message);
        }
        setLoading(false);
    }

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredOrganizations = organizations?.filter(organization => {
            return organization.name?.toLowerCase().includes(searchValue);
        });

        setFilteredOrganizations(filteredOrganizations);
    }

    useEffect(() => {
        setFilteredOrganizations(organizations);
    }, [organizations]);

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
                    >My Organizations</Typography>
                </Box>  
                <SearchBar
                    placeholder="Search Organizations"
                    onChange={handleSearch}
                />
                <Fab
                    size="medium"
                    color="primary"
                    aria-label="add"
                    sx={fabStyle}
                    onClick={handleOpen}
                >
                    <AddRoundedIcon />
                </Fab>
                <CreateOrgModal open={isOpen} handleClose={handleClose} handleOpen={handleOpen} />
            </Box>
            <Grid  
                container 
                spacing={3}
                paddingTop={2}
                columns={{ xs: 12, sm: 6, md: 3 }}
            >
                {
                    filteredOrganizations?.map((organization, idx) => (
                        <Grid 
                            item 
                            key={`organization-${idx}`}
                        >
                        <SummaryCard
                            title={organization.name}
                            count={organization.num_projects}
                            name= {organization.num_projects === 1 ? "Project" : "Projects"}
                            onClick={() => navigate(`/organization/${organization.id}/projects` ) }  
                        >
                            {organization?.role && organization.role.toLowerCase() === "admin"
                                ? <AdminPanelSettingsRoundedIcon fontSize='large' color='success' />
                                : <WorkIcon fontSize='large' color='primary' />
                            }
                        </SummaryCard>
                        </Grid>
                    ))
                }
            </Grid>

        </>
    )
}

export default Organizations;