import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
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
                    { deadline &&
                        <Box 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            variant="contained"
                            sx={{
                                backgroundColor: '#52CD9F',
                                padding: '0.2rem 0.3rem',
                                borderRadius: '0.3rem',
                                height: '2rem',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    color: 'white',
                                }}

                            >
                            Due: {-dayjs().diff(dayjs(deadline), 'day') === 1 ? "Tomorrow" : new Date(deadline).toISOString().slice(0,10) } </Typography>
                        </Box>
                    }
                </Stack>
                <LinearProgress 
                    color={ colorPicker(100 * completed_tasks / total_tasks) } 
                    variant="determinate" value={ 100 * completed_tasks / total_tasks } 
                    sx ={
                    {
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#E0E0E0',
                        [`& .${linearProgressClasses.bar}`]: {
                            borderRadius: 5,
                        },
                    }
                }/>
                
            </CardContent>
        </Card>
    )
}

export default ProgressBarCard;