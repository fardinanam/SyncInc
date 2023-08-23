import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import notifyWithToast from '../utils/toast';
import ListChips from './ListChips';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

const ProjectCard = (props) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    const {name, client, description, children, disabled, roles} = props;
    return (
        <Card
            elevation={0}
            sx={ disabled ?{
                borderRadius: 2,
                backgroundColor: backgroundColor,
            }:{
                borderRadius: 2,
                '&:hover': {
                    cursor: 'pointer',
                },
                backgroundColor: backgroundColor,
            }}
            onClick={disabled ? () => {
                notifyWithToast("error", "You are not allowed to view this project")
            }
                : props.onClick}
        >
            <CardContent>
                {children}
                <Box 
                    display='flex'
                    justifyContent='space-between'
                    flexDirection='row'
                >
                <Typography
                    variant="h5"
                    fontWeight={'bold'}
                >
                    {name}
                </Typography>
                {roles.length > 0 ? 
                    roles.includes("Project Leader") ?
                    <Chip color='success' label="Leader" size='small' /> :
                    <Chip color='primary' label="Member" size='small' /> :
                    <LockRoundedIcon color='disabled'/>
                }
                </Box>
                <Typography
                    sx={{
                        fontSize: 16,
                    }}
                    color="text.secondary" gutterBottom
                >
                    {client}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 14
                    }}
                    color="text.secondary" gutterBottom
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProjectCard;