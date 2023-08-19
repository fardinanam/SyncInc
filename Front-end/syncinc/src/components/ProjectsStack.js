import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid, Stack, Typography, Paper } from '@mui/material';
import ProjectCard from './ProjectCard';
import { useNavigate } from 'react-router-dom';

const ProjectsStack = ({title, projects}) => {

    const navigate = useNavigate()
    console.log(projects)

    return (
            <Stack justifyContent="center" spacing={2} mt={2}>
                <Paper elevation={0}
                    sx={{
                        p: '1rem',
                        borderRadius: '0.5rem',
                    }}
                >
                <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold' }}           
                >
                    {title}
                </Typography>
                </Paper>
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