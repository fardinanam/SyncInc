import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { LinearProgress } from '@mui/material';
import dayjs from 'dayjs';

const ProgressBarCard = (props) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    let { name, client, completed_tasks, total_tasks, deadline } = props;

    const colorPicker = (percent) => {
        if (percent < 30) {
            return 'error';
        } else if (percent < 60) {
            return 'info';
        } else if (percent === 100) {
            return 'success';
        }

    }
    return (
        <Card
            sx={{
                borderRadius: '0.5rem',
                width: 275,
                '&:hover': {
                    cursor: 'pointer',
                },
                backgroundColor: backgroundColor,
            }}
            onClick={props.onClick}
            elevation={0}
        >
            <CardContent>
                <Stack 
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Stack
                        flexDirection="column"
                    >
                        <Typography
                            sx={{
                                fontSize: '0.9rem',
                            }}
                            color="text.primary"
                        >
                            {client}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                            color="text.primary" gutterBottom
                        >
                            {name}
                        </Typography>
                    </Stack>
                    {/* { deadline &&
                        <Box 
                            display="block"
                            sx={{
                                height: '2rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '0.5rem',
                                background: '#26C706',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Due: {-dayjs().diff(deadline, 'day')} days 
                        </Box>
                    } */}
                </Stack>
                <LinearProgress 
                    color={ colorPicker(100 * completed_tasks / total_tasks) } 
                    variant="determinate" value={ 100 * completed_tasks / total_tasks } 
                    sx ={
                    {
                        height: 10,
                        borderRadius: 5,
                        // different color for dark and light mode
                        backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#E0E0E0',
                    }
                }/>
                
            </CardContent>
        </Card>
    )
}

export default ProgressBarCard;