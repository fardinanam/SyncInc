import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Grid, Stack, Typography } from '@mui/material';
import MainLayout from '../components/MainLayout';
import { useNavigate } from 'react-router-dom';


import SummaryCard from '../components/SummaryCard';
import ProjectCard from '../components/ProjectCard';
import WorkIcon from '@mui/icons-material/Work';

const columnStackStyle = {
    direction: "column",
    justifyContent: "flex-start",
    width: 300,
}


const Projects = () => {
    const navigate = useNavigate();

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
            <Stack
                direction = {"row"}
                spacing = {12}
                justifyContent={"flex-start"}
            >
                <Grid item>
                    <Stack
                        spacing = {2}
                        sx = {columnStackStyle}
                    >
                        <Grid item>
                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 'bold' }}
                                flexGrow={1}
                            >
                                New Projects
                            </Typography>
                        </Grid >
                        <Grid item>
                            <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid >
                        <Grid item>
                        <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid >
                    </Stack>
                </Grid >
                <Grid item>
                    <Stack
                        spacing = {2}
                        sx = {columnStackStyle}
                    >
                        <Grid item>
                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 'bold' }}
                                flexGrow={1}
                            >
                                Projects In Progress
                            </Typography>
                        </Grid >
                        {/* <Grid item>
                            <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid > */}
                        {/* <Grid item>
                            <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid >  */}
                    </Stack>
                </Grid >
                <Grid item>
                    <Stack
                        spacing = {2}
                        sx = {columnStackStyle}
                    >
                        <Grid item>
                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 'bold' }}
                                flexGrow={1}
                            >
                                Completed Projects
                            </Typography>
                        </Grid >
                        <Grid item>
                            <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid >
                        {/* <Grid item>
                            <ProjectCard
                                name="Advertisement"
                                client="Client Name"
                                description="This is a description of the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                onClick={() => navigate(`/` ) }
                            >
                            </ProjectCard>
                        </Grid > */}
                    </Stack>
                </Grid >
            </Stack>

        </>

    )
        // <>
        //     <Box 
        //         display= 'flex'                
        //         alignGrid items='center'
        //     >
        //         <Typography
        //             variant='h5'
        //             sx={{ fontWeight: 'bold' }}
        //             flexGrow={1}
        //         >
        //             Your Projects
        //         </Typography>
        //         <Button variant='contained' onClick={() => navigate('/add_project')}><AddRoundedIcon />project</Button>
        //     </Box>
        //     <Grid  
        //         container 
        //         spacing={3}
        //         columns={{ xs: 12, sm: 6, md: 3 }}
        //     >
        //     </Grid>
        // </>
        
}

export default Projects;