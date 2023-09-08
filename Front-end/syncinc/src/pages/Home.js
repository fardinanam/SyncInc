import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useLayoutEffect } from 'react';
import { Grid } from '@mui/material';
import DashboardCard from '../components/DashboardCard';
import AuthContext from '../context/AuthContext';
import { baseUrl } from '../utils/config';
import axios from 'axios';
import { useLoading } from '../context/LoadingContext';
import { Work } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import ContributionGraph from '../components/ContributionGraph';
import ProgressBarCard from '../components/ProgressBarCard';
import { Stack } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function ClippedDrawer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const {authTokens} = useContext(AuthContext);
    const [numOrganizations, setNumOrganizations] = useState([]);
    const [numProjects, setNumProjects] = useState([]);
    const [numTasks, setNumTasks] = useState([]);
    const [contributions, setContributions] = useState([]);

    const {setLoading} = useLoading();
    const [percentProjectTasks, setPercentProjectTasks] = useState([]);
    useLayoutEffect(() => {
        fetchNumberItems();
        fetchContributions();
        fetchPercentProjectTasks();
    }, []);

    const fetchNumberItems = async () => {
        setLoading(true);
        try {
            let response = await axios.get(
                `${baseUrl}get_user_items_count/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            
            setNumOrganizations(response.data?.data?.numOrganizations);
            setNumProjects(response.data?.data?.numProjects);
            setNumTasks(response.data?.data?.numTasks);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
        setLoading(false);
    }

    const fetchContributions = async () => {
        setLoading(true);
        try {
            let response = await axios.get(
                `${baseUrl}get_user_contributions/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )
            setContributions(response.data?.data);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
        setLoading(false);
    }
    
    const fetchPercentProjectTasks = async () => {
        setLoading(true);
        try {
            let response = await axios.get(
                `${baseUrl}get_user_projects_completed_task_percentage/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )

            console.log(response.data?.data);
            setPercentProjectTasks(response.data?.data);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
        setLoading(false);
    }

    return (
        // <MainLayout selected='dashboard'>
        <>
            <Box>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
            </Box>
            <Box
                display='flex'
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                rowGap={2}
                columnGap={2}
            >
                <Grid  
                    container 
                    spacing={2}
                    paddingTop={2}
                    columns={{ xs: 12, sm: 6, md: 3 }}
                >
                    <Grid 
                        item
                    >
                    <DashboardCard
                        title="My Organizations"
                        count={numOrganizations}
                        name="Organizations Affiliated"  
                        onClick={() => navigate('/organizations')}
                    >
                        <Work 
                            color='primary'
                            fontSize='large'
                        />
                    </DashboardCard>
                    </Grid>
                    <Grid 
                        item
                    >
                    <DashboardCard
                        title="My Projects"
                        count={numProjects}
                        name="Projects Joined"
                        onClick={() => navigate('/projects')}   
                    >
                        <DescriptionIcon 
                            color='primary'
                            fontSize='large'
                        />
                    </DashboardCard>
                    </Grid>
                    <Grid 
                        item
                    >
                    <DashboardCard
                        title="My Tasks"
                        count={numTasks}
                        name="Tasks Assigned"
                        onClick={() => navigate('/tasks')}
                    >
                        <AssignmentRoundedIcon 
                            color='primary'
                            fontSize='large'
                        />
                    </DashboardCard>
                    </Grid>
                    
                </Grid>
                { !isMobile &&
                <Stack 
                    justifyContent='flex-start'
                    alignItems='flex-start'
                >
                    <Typography 
                        variant='h6' 
                        sx={{ fontWeight: 'bold' }}
                        mb={1}
                    >
                        Contributions In Last Year
                    </Typography>
                    <ContributionGraph 
                        contributions={contributions}
                    />
                </Stack>
                }
                { percentProjectTasks?.length > 0 &&
                    <Grid
                        container
                        spacing={2}
                        columns={{ xs: 12, sm: 6, md: 3 }}
                    >
                        <Grid
                            item
                        >
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                Projects Progress
                            </Typography>
                            <Stack 
                                justifyContent="flex-start" 
                                rowGap={2}
                                columnGap={2}
                                mt={1} direction="row"
                                flexWrap='wrap'
                            >
                                {percentProjectTasks?.map((project, idx) => (
                                        <ProgressBarCard
                                            key={`project-${idx}`}
                                            name={project?.name}
                                            client={project?.client}
                                            completed_tasks={project?.completed_tasks}
                                            total_tasks={project?.total_tasks}
                                            deadline={project?.deadline}
                                            onClick={() => navigate(`/project/${project.id}`)}
                                        />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                }
            </Box>
        </>
        // </MainLayout>
    );
}