import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import SummaryCard from '../components/SummaryCard';
import { Grid } from '@mui/material';

export default function ClippedDrawer() {
    return (
        <Box 
            sx={{ display: 'flex', 
            backgroundColor: '#000000',}}
        >
        <CssBaseline />
        <Header />
        <SideBar />
        <Box 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                p: 3,
                backgroundColor: 'background.main',
                overflow: 'auto',
                height: '100vh',
            }}
        >
        <Toolbar />
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 2, sm: 4, md: 12 }}
            
            >
                <Grid item>
                <SummaryCard
                    title="Ongoing Tasks"
                    count={3}
                    name="Tasks"  
                />
                </Grid>
                <Grid item>
                <SummaryCard
                    title="Ongoing Projects"
                    count={2}
                    name="Projects"
                />
                </Grid>
            </Grid>
        </Box>
        </Box>
    );
}