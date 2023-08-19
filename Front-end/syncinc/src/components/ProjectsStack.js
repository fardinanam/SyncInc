import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid, Stack, Typography } from '@mui/material';
import ProjectCard from './ProjectCard';
import { useNavigate } from 'react-router-dom';

const ProjectsStack = ({title, projects}) => {
    
    const navigate = useNavigate()
    console.log(projects)

    return (
            <Stack justifyContent="center" spacing={2}>
                <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold' }}           
                >
                    {title}
                </Typography>
                {projects?.map((project, idx) => (
                    <ProjectCard
                        key={`project-${idx}`}
                        name={project.name}
                        client={project.client}
                        description={project.description}
                        onClick={() => navigate(`/project/${project.id}`)}
                    />
                    
                ))}
            </Stack>

    )
}

export default ProjectsStack;