import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const OrganizationProjects = (props) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [organization, setOrganization] = useState({});
    const [selectedValue, setSelectedValue] = useState('projects');

    const handleToggleChange = (event, newValue) => {
        console.log(id);
        console.log(newValue);
        if(newValue != null) {
            setSelectedValue(newValue);
            navigate(`/organization/${id}/${newValue}`);
        }
    }

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
        console.log(selectedValue);

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
                        onChange={handleToggleChange}
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
                    <Button variant='contained' onClick={() => navigate('add-project') }>
                        <AddRoundedIcon />
                        Project
                    </Button>

                </Grid>
            
            </Grid>
            
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 12, sm: 6, md: 3 }}
                paddingTop={2}
            >
            {organization?.projects?.map((project, idx) => (
                <Grid 
                    item
                    key={`project-${idx}`}
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <SummaryCard
                        title={project.name}
                        count={0}
                        name="Tasks"
                    >
                        <WorkIcon fontSize='large' color='primary' />
                        {/* <ListItemIcon fontSize='small' color='primary' /> */}
                    </SummaryCard>
                </Grid>
            ))}
            </Grid>
        </>
        
        
    );
};

export default OrganizationProjects;