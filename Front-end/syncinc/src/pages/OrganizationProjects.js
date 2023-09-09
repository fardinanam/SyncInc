import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import axios, { all } from "axios";

import { Box, Button, Fab, Grid, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import TitleBar from "../components/TitleBar";
import ProjectsStack from '../components/ProjectsStack';
import OrganizationNavMenu from "../components/OrganizationNavMenu";
import notifyWithToast from "../utils/toast";
import SearchBar from "../components/SearchBar";
import { fabStyle } from "../styles/styles";

const OrganizationProjects = () => {
    const  { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const [organizationName, setOrganizationName] = useState();
    const [role, setRole] = useState();
    const [projects, setProjects] = useState([]);
    const [newProjects, setNewProjects] = useState([]);
    const [projectsInProgress, setProjectsInProgress] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);

    const categorizeProjects = (projects) => {
        //projects that have no tasks is assigned to newProjects
        const today = new Date();
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
            setOrganizationName(response.data?.data?.name);
            setRole(response.data?.data?.role)
            setProjects(response.data?.data?.projects);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);
    }

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredProjects = projects?.filter(project => {
            return project.name?.toLowerCase().includes(searchValue) || project.client?.toLowerCase().includes(searchValue);
        });

        categorizeProjects(filteredProjects);
    }

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    useEffect(() => {
        categorizeProjects(projects);
    }, [projects]);

    return (
        <>  
            <TitleBar 
                title={organizationName}
                subtitleElement={
                    <Typography variant="h7"
                        fontWeight="bold"
                        color="text.secondary"
                    >
                        Projects
                    </Typography>
                }
            >   
                <Box 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <OrganizationNavMenu organization_id={id}/>
                </Box>
            </TitleBar>
            <Box display="flex" 
                justifyContent="flex-end" 
                mb={1}
                rowGap={1}
                columnGap={1}
            >
                <SearchBar 
                    placeholder="Search by project or client name..."
                    onChange={handleSearch}
                />
            {
                role === 'Admin' &&
                    <Fab
                        color="primary"
                        aria-label="add"
                        size="medium"
                        onClick={() => {navigate(`/organization/${id}/add-project`)}}
                        sx={fabStyle}
                    >
                        <AddRoundedIcon />
                    </Fab>
            }
            </Box>
            <Grid  
                container 
                spacing={2}
            >
                <Grid item xs={12} lg={4}>
                    <ProjectsStack title="New Projects" projects={newProjects} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ProjectsStack title="Projects in Progress" projects={projectsInProgress} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ProjectsStack title="Completed Projects" projects={completedProjects} />
                </Grid>
            </Grid>
        </>
    );
};

export default OrganizationProjects;