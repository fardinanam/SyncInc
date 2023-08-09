import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid } from "@mui/material";
import MainLayout from "./MainLayout";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import WorkIcon from '@mui/icons-material/Work';


import SummaryCard from "./SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import OrganizationMembers from "../pages/OrganizationMembers";
import OrganizationProjects from "../pages/OrganizationProjects";

const OrganizationDetails = (props) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("id=",id);

    const [selectedValue, setSelectedValue] = useState('projects');
    const [organization, setOrganization] = useState({});

    useEffect(() => {
        fetchOrganizationDetails();
    }, []);
    

    // use axios to get organization details
    const fetchOrganizationDetails = async () => {
        try {
            const response = await axios.get(
               
                `${baseUrl}organization_details/${id}/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )

            console.log(response);
            setOrganization(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }
    }

    return (
        <>
            <Grid 
                container
            >
                <Grid 
                    item
                    display={'flex'}
                    xs={12} md={3}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                >
                    <Typography
                        variant='h5'
                        sx={{ fontWeight: 'bold' }}
                        flexGrow={1}
                        >
                        {organization?.name}
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    display={'flex'}
                    xs={12} md={6}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <ToggleButtonGroup  
                        value={selectedValue}
                        exclusive
                        onChange ={(event, newValue) => {setSelectedValue(newValue)}}
                        aria-label="text alignment"
                        sx={{ height: '80%' }}
                    >
                        <ToggleButton value="projects" aria-label="left aligned">
                            <Typography
                                variant='h6'
                                flexGrow={1}
                            >
                                projects
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value="members" aria-label="right aligned">
                            <Typography
                                variant='h6'
                                flexGrow={1}
                            >
                                members
                            </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid 
                    item
                    display={'flex'}
                    xs={12} md={3}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                >
                    <Button variant='contained' onClick={() => selectedValue === 'projects'? navigate('/add_projects') : navigate('/add_members')}>
                        <AddRoundedIcon />
                        {selectedValue}
                    </Button>

                </Grid>
            
            </Grid>
            {selectedValue === 'projects'? <OrganizationProjects /> : <OrganizationMembers />}
        </>
    );
};

export default OrganizationDetails;