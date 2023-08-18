import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const SummaryCard = (props) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    let {title, name, count, children} = props;
    return (
        <Card 
            sx={{ 
                borderRadius: 2,
                width: 200,
                '&:hover': {
                    cursor: 'pointer',
                },
                backgroundColor: backgroundColor,
            }}
            onClick={props.onClick}
            elevation={0}
        >
            <CardContent>
                {children}
                
                <Typography 
                    sx={{ 
                        fontSize: 14,
                        fontWeight: 'bold'
                    }} 
                    color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography
                    variant='h4'    
                >
                    {count}
                </Typography>
                <Typography 
                    sx={{
                        fontSize: 14
                    }}
                    color="text.secondary" gutterBottom
                >
                    {name}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default SummaryCard;