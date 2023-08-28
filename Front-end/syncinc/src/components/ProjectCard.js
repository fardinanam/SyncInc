import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Box, Chip, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import notifyWithToast from '../utils/toast';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const ProjectCard = (props) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    const {name, client, description, children, roles} = props;
    const [disabled, setDisabled] = useState(true);

    
    useEffect(() => {
        console.log(roles);
        if (roles?.includes("Project Leader") || roles?.includes("Assignee") || roles?.includes("Admin")) {
            setDisabled(false);
        }
    }, [roles])
        

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
                    {name && name}
                </Typography>
                {roles?.length > 0 ? 
                    <Stack 
                        display='flex'
                        direction='row'
                        justifyContent='flex-start'
                        spacing={0.5}
                    >
                        {roles?.includes("Admin") && <Tooltip title="Admin"> 
                                <AdminPanelSettingsIcon size="small" color='success'/>
                            </Tooltip>
                        }
                        {roles?.includes("Project Leader") && <Tooltip title="Leader"> 
                                <ManageAccountsIcon size="small" color='primary'/>
                            </Tooltip>
                        }
                        {roles?.includes("Assignee") && <Tooltip title="Assignee">
                                <SupervisedUserCircleIcon size="small" color='secondary'/>
                            </Tooltip>
                        }
                    </Stack>
                    : <Tooltip title="Private"> 
                        <LockRoundedIcon size="small" color='disabled'/>
                    </Tooltip>
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
                    {description && description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProjectCard;