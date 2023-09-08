import React, { useState, useEffect } from 'react';
import { Grid, Stack, Typography, Paper, Collapse, IconButton } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ProjectCard from './ProjectCard';
import { useNavigate } from 'react-router-dom';

const ProjectsStack = ({title, projects}) => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    
    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '0.5rem',
                }}
            >
            <Typography variant='h6' sx={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    { open 
                        ? <KeyboardArrowDownRoundedIcon /> 
                        : <KeyboardArrowRightRoundedIcon />
                    }
                </IconButton>
                    {title}
            </Typography>
            </Paper>
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
            >
                <Stack justifyContent="center" spacing={2} mt={2}>
                    {projects?.map((project, idx) => (
                        <ProjectCard
                            key={`project-${idx}`}
                            name={project?.name}
                            client={project?.client}
                            description={project?.description}
                            roles={project?.roles}
                            task_count={project?.task_count}
                            onClick={() => navigate(`/project/${project.id}`)}
                        />
                        
                    ))}
                </Stack>
            </Collapse>
        </>
    )
}

export default ProjectsStack;