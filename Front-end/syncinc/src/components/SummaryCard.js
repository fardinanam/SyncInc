import { Icon } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FormatListNumberedRtlRoundedIcon from '@mui/icons-material/FormatListNumberedRtlRounded';

const SummaryCard = (props) => {
    let {title, name, count} = props;
    return (
        <Card 
            sx={{ 
                width: 200,
                borderRadius: 2,
                boxShadow: 0,
            }}
        >
            <CardContent>
                
                <FormatListNumberedRtlRoundedIcon 
                    fontSize='large'
                    color='primary'    
                />
                
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