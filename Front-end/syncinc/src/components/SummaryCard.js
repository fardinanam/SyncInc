import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const SummaryCard = (props) => {
    let {title, name, count, children} = props;
    return (
        <Card 
            sx={{ 
                borderRadius: 2,
                boxShadow: 0,
                width: 200,
                '&:hover': {
                    cursor: 'pointer',
                },
            }}
            onClick={props.onClick}
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