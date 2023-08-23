import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useLayoutEffect } from 'react';
import SummaryCard from '../components/SummaryCard';
import { Grid } from '@mui/material';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';
import DashboardCard from '../components/DashboardCard';
import AuthContext from '../context/AuthContext';
import { baseUrl } from '../utils/config';
import axios from 'axios';
import { useLoading } from '../context/LoadingContext';
import { Work } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

export default function ClippedDrawer() {
    const navigate = useNavigate();
    const {authTokens} = useContext(AuthContext);
    const [numOrganizations, setNumOrganizations] = useState([]);
    const [numProjects, setNumProjects] = useState([]);
    const [numTasks, setNumTasks] = useState([]);
    const {setLoading} = useLoading();
    useLayoutEffect(() => {
        fetchNumberItems();
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
            console.log(error.response.data?.message);
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
            <Grid  
                container 
                spacing={3}
                paddingTop={2}
                columns={{ xs: 12, sm: 6, md: 3 }}
            >
                <Grid 
                    item
                >
                <DashboardCard
                    title="Your Organizations"
                    count={numOrganizations}
                    name="Organizations Managed"  
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
                    title="Your Projects"
                    count={numProjects}
                    name="Projects Led"
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
                    title="Your Tasks"
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
        </>
        // </MainLayout>
    );
}