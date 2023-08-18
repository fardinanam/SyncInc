import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid, Stack, Typography } from '@mui/material';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';


import SummaryCard from '../components/SummaryCard';
import ProjectCard from '../components/ProjectCard';
import ProjectsStack from '../components/ProjectsStack';
import WorkIcon from '@mui/icons-material/Work';

const columnStackStyle = {
    direction: "column",
    justifyContent: "flex-start",
    width: 300,
}

const newProjects = [ {name: "Project 1", client: "Client 1", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
                {name: "Project 2", client: "Client 2", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            ]

const projectsInProgress = [ {name: "Project 3", client: "Client 3", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
                {name: "Project 4", client: "Client 4", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            ]
const completedProjects = [ {name: "Project 5", client: "Client 5", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
                {name: "Project 6", client: "Client 6", description: "This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
            ]
const Projects = () => {
    const navigate = useNavigate();
    // const [newProjects, setNewProjects] = useState([]);

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