import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SummaryCard from '../components/SummaryCard';
import { Grid } from '@mui/material';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';

export default function ClippedDrawer() {
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
                <Grid 
                    item
                >
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
        </>
        // </MainLayout>
    );
}