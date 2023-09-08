import { useTheme, styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';
import { LinearProgress } from '@mui/material';

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
                {/* <DescriptionIcon 
                        color='primary'
                        fontSize='large'
                /> */}
                <Typography
                    sx={{
                        fontSize: 14
                    }}
                    color="text.primary" gutterBottom
                >
                    {client}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 26,
                        fontWeight: 'bold'
                    }}
                    color="text.primary" gutterBottom
                >
                    {name}
                </Typography>
                {/* <Typography
                    sx={{
                        fontSize: 14
                    }}
                    color="text.secondary" gutterBottom
                >
                    Deadline: {deadline ? deadline : "Unspecified"}
                </Typography> */}
                <LinearProgress 
                    color={ colorPicker(100 * completed_tasks / total_tasks) } 
                    variant="determinate" value={ 100 * completed_tasks / total_tasks } 
                    sx ={
                    {
                        height: 10,
                        borderRadius: 5,
                        // different color for dark and light mode
                        backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#E0E0E0',
                    }
                }/>
                
            </CardContent>
        </Card>
    )
}

export default ProgressBarCard;