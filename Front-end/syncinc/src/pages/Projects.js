import React from 'react';
import axios from "axios"
import { useContext, useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import Box from '@mui/material/Box';
import { Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import ProjectsStack from '../components/ProjectsStack';
import notifyWithToast from "../utils/toast";

const columnStackStyle = {
    direction: "column",
    justifyContent: "flex-start",
    width: 300,
}

    
const Projects = () => {
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
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

    const fetchUserProjectDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}get_user_projects/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            console.log(response)
            console.log(response.data?.data?.projects);
            categorizeProjects(response.data?.data?.projects);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUserProjectDetails();
    }, []);

    return (
        <>
            <Box 
                display= 'flex'
                flexGrow={1}
                marginBottom={2}
            >
                    <Typography 
                        variant='h5'
                        sx={{ fontWeight: 'bold' }}
                    >
                        My Projects
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
                    <ProjectsStack title="Projects in Progress" projects={projectsInProgress} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectsStack title="Completed Projects" projects={completedProjects} />
                </Grid>
            </Grid>
        </>
    )
        
}

export default Projects;