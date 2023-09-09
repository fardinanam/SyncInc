import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import ProjectsStack from '../components/ProjectsStack';

const OrganizationProjects = ({projects, search}) => {
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

    const handleSearch = (searchValue) => {
        const filteredProjects = projects?.filter(project => {
            return project.name?.toLowerCase().includes(searchValue) || project.client?.toLowerCase().includes(searchValue);
        });

        categorizeProjects(filteredProjects);
    }

    useEffect(() => {
        if (projects?.length > 0)
            categorizeProjects(projects);
    }, [projects]);

    useEffect(() => {
        handleSearch(search);
    }, [search]);


    return (
        <>  
            <Box display="flex" 
                justifyContent="flex-end" 
                mb={1}
                rowGap={1}
                columnGap={1}
            >
                {/* <SearchBar 
                    placeholder="Search by project or client name..."
                    onChange={handleSearch}
                /> */}
            </Box>
            {/* {
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
            } */}
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