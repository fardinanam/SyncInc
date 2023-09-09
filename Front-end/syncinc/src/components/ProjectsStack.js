import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Paper, Collapse, IconButton } from '@mui/material';
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
            <Typography variant='h7' sx={{ fontWeight: 'bold', paddingTop: '1rem', paddingBottom: '1rem'}}>
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
                <Stack justifyContent="center" spacing={1} mt={1}>
                    {   projects?.length > 0 ?
                        projects?.map((project, idx) => (
                        <ProjectCard
                            key={`project-${idx}`}
                            name={project?.name}
                            client={project?.client}
                            description={project?.description}
                            roles={project?.roles}
                            task_count={project?.task_count}
                            onClick={() => navigate(`/project/${project.id}`)}
                        />
                        
                    ))
                    :
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            height='5rem'
                            backgroundColor='background.default'
                            borderRadius="0.5rem"
                        >
                            <Typography variant='h7' color='text.secondary'
                                fontWeight="bold"
                            >
                                No projects to show
                            </Typography>
                        </Box>
                    }
                </Stack>
            </Collapse>
        </>
    )
}

export default ProjectsStack;