import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid } from "@mui/material";
import MainLayout from "../components/MainLayout";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import WorkIcon from '@mui/icons-material/Work';

import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";


const OrganizationProjects = (props) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

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
        <MainLayout>
            <Box 
                display= 'flex'                
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}
                    flexGrow={1}
                >
                    {organization?.name} Projects
                </Typography>
                <Button variant='contained' onClick={() => navigate('/add_project')}><AddRoundedIcon />project</Button>
            </Box>
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
        </MainLayout>
    );
};

export default OrganizationProjects;