import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid } from "@mui/material";
import MainLayout from "../components/MainLayout";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import WorkIcon from '@mui/icons-material/Work';


import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import OrganizationMembers from "./OrganizationEmployees";
import OrganizationProjects from "./OrganizationProjects";
import { AddMemberModal } from "../components/Modals";

const OrganizationDetails = (props) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectedValue, setSelectedValue] = useState('projects');
    const [organization, setOrganization] = useState();

    const fetchOrganizationData = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}get_organizations/${id}`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            
            setOrganization(response.data?.data);
            
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    }

    useEffect(() => {
        fetchOrganizationData();
    }, []);

    const handleToggleChange = (event, newValue) => {
        console.log("Something is happening")
        if(newValue != null) {
            setSelectedValue(newValue);
        }
    }

    let [memberModalOpen, setMemberModalOpen] = useState(false);
    const handleAddMemberModalOpen = () => {
        console.log("handle Member modal open")
        setMemberModalOpen(true);
    }
    const handleAddMemberModalClose = () => {
        setMemberModalOpen(false);
    }
    return (
        <>
            <Grid 
                container
            >
                <Grid 
                    item
                    display={'flex'}
                    xs={12} md={4}
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
                    xs={12} md={4}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <ToggleButtonGroup  
                        value={selectedValue}
                        exclusive
                        fullWidth
                        size="small"
                        onChange = {handleToggleChange}
                        
                    >
                        <ToggleButton value="projects">
                            <Typography
                                variant='button'
                                flexGrow={1}
                            >
                                projects
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value="members">
                            <Typography
                                variant='button'
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
                    xs={12} md={4}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                >
                    <Button variant='contained' 
                        onClick={() => selectedValue === 'projects'? 
                        navigate(`/organization/${organization?.id}/add-project`) 
                        : 
                        handleAddMemberModalOpen()} >
                        <AddRoundedIcon />             
                        {selectedValue === 'projects'? 'Project' : 'Member'}
                    </Button>
                    <AddMemberModal
                        open={memberModalOpen}
                        id={id}
                        handleClose={handleAddMemberModalClose}
                    />

                </Grid>
            
            </Grid>
            
        </>
    );
};

export default OrganizationDetails;