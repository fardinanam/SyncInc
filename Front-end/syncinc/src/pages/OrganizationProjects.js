import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";


const OrganizationProjects = (props) => {
    const { authTokens } = useContext(AuthContext);
    
    const id = props.id;

    const [organization, setOrganization] = useState({});

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, [id]);

    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}organization_projects/${id}/`,  
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