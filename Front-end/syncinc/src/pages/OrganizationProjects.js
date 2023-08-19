import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import axios from "axios";

import { Box, Typography, Button, Grid, Icon, Menu } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import OrganizationDetails from "./OrganizationDetails";
import TitleBar from "../components/TitleBar";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";
import NavMenu from "../components/NavMenu";

import ProjectCard from '../components/ProjectCard';
import ProjectsStack from '../components/ProjectsStack';

const OrganizationProjects = () => {
    const  { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);;
    const navigate = useNavigate();
    
    const menuItems = ["projects", "employees", "vendors"];
    const handleMenuSelect = (menu) => {
        if(menu === "employees")
            navigate(`/organization/${id}/employees`);
        else if(menu === "vendors")
            navigate(`/organization/${id}/vendors`);
    }

    const [organizationName, setOrganizationName] = useState();
    const [role, setRole] = useState();
    const [newProjects, setNewProjects] = useState([]);
    const [projectsInProgress, setProjectsInProgress] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
   
    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
        console.log("sth")
        setLoading(true);
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

            console.log(response.data.data);
            setOrganizationName(response.data.data.name);
            setRole(response.data.data.role)
            setNewProjects(response.data.data.projects)
            console.log(organizationName)
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    return (
        <>  
            <TitleBar 
                title={organizationName}
                subtitle="Employees"
            >
                <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
            </TitleBar>
            <Box 
                display= 'flex'
                flexGrow={1}
                marginBottom={2}
            >
                    <Typography 
                        variant='h5'
                        sx={{ fontWeight: 'bold' }}
                    >
                        Your Projects
                    </Typography>
            </Box>
            <Grid  
                container 
                spacing={3}
            >
                <Grid item xs={12} md={4}>
                    <ProjectsStack title="New Projects" projects={newProjects} />
                </Grid>
                <Grid item xs={12} md={4}>
                    {/* <ProjectsStack title="Projects in Progress" projects={projectsInProgress} /> */}
                </Grid>
                <Grid item xs={12} md={4}>
                    {/* <ProjectsStack title="Completed Projects" projects={completedProjects} /> */}
                </Grid>
            </Grid>
        </>
          
    );
};

export default OrganizationProjects;