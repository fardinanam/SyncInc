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

const ProjectCard = ({name, client, description, children, roles, onClick, task_count}) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    const [disabled, setDisabled] = useState(true);

    
    useEffect(() => {
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
                : onClick}
        >
            <CardContent
                sx={{
                    padding: '1rem !important',
                }}
            >
                {children}
                <Box 
                    display='flex'
                    justifyContent='space-between'
                    flexDirection='row'
                >
                <Typography
                    variant="h7"
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
                                <AdminPanelSettingsIcon size="small" color='disabled'/>
                            </Tooltip>
                        }
                        {roles?.includes("Project Leader") && <Tooltip title="Leader"> 
                                <ManageAccountsIcon size="small" color='disabled'/>
                            </Tooltip>
                        }
                        {roles?.includes("Assignee") && <Tooltip title="Assignee">
                                <SupervisedUserCircleIcon size="small" color='disabled'/>
                            </Tooltip>
                        }
                    </Stack>
                    : <Tooltip title="Private"> 
                        <LockRoundedIcon size="small" color='disabled'/>
                    </Tooltip>
                }
                </Box>
                <Typography
                    color="text.secondary"
                    sx={{
                        fontSize: '0.9rem',
                    }}
                >
                    Client: {client}
                </Typography>
                <Typography
                    fontWeight="bold"
                    color="text.secondary"
                >
                    {task_count} {task_count === 1 ? "task" : "tasks"} 
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProjectCard;