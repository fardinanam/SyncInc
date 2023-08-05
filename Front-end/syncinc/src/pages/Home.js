import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import SummaryCard from '../components/SummaryCard';
import { Grid } from '@mui/material';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';

export default function ClippedDrawer() {
    return (
        <Box 
            sx={{ display: 'flex', 
            backgroundColor: 'main',}}
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
                >
                    <FormatListNumberedRtlRoundedIcon 
                        color='primary'
                        fontSize='large'
                    />
                </SummaryCard>
                </Grid>
                <Grid item>
                <SummaryCard
                    title="Ongoing Projects"
                    count={2}
                    name="Projects"
                >
                    <FormatListNumberedRtlRoundedIcon 
                        color='secondary'
                        fontSize='large'
                    />
                </SummaryCard>
                </Grid>
            </Grid>
        </Box>
        </Box>
    );
}