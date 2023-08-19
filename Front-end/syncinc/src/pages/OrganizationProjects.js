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

    const categorizeProjects = (projects) => {
   
        //projects that have no tasks is assigned to newProjects
        const today = new Date();
        console.log(today);
        console.log(projects);
        setNewProjects(projects.filter(project => project.task_count === 0));

        //projects that have tasks and if its end_time exists it is smaller than current date is assigned to projectsInProgress
        setProjectsInProgress(projects.filter(project => project.task_count > 0 && (project.end_time === null || new Date(project.end_time) > today)));

        //projects that have end_time lower than current time is assigned to completedProjects
        setCompletedProjects(projects.filter(project => project.end_time !== null && new Date(project.end_time) < today));
    }
    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
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
            setOrganizationName(response.data.data.name);
            setRole(response.data.data.role)
            categorizeProjects(response.data.data.projects);
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
                subtitle="Projects"
            >
                <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
            </TitleBar>
            {
                role === 'Admin' &&
                <Box display="flex" justifyContent="flex-end" m={1}>
                    <Button variant="contained" onClick={() => {navigate(`/organization/${id}/add-project`)}}>Add New Project</Button>
                </Box>
            }
            <Grid  
                container 
                spacing={3}
            >
                <Grid item xs={12} md={4}>
                    <ProjectsStack title="New Projects" projects={newProjects} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectsStack title="Projects in Progress" projects={projectsInProgress} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectsStack title="Completed Projects" projects={completedProjects} />
                </Grid>
            </Grid>
        </>
          
    );
};

export default OrganizationProjects;