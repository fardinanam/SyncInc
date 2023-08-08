import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const selectedStyle = {
    "&.Mui-selected": {
    color: "primary.main",
    bgcolor: "main.main",
    },
    "&.Mui-selected:after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "2px",
    backgroundColor: "primary.main",
    },
}

const SideBar = (props) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderWidth: 0 },
            }}
            color='background'
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem 
                    key="dashboard" 
                    disablePadding
                >
                    <ListItemButton 
                        onClick={() => navigate('/dashboard')}
                        selected={location.pathname.startsWith('/dashboard')}
                        sx={selectedStyle}
                    >
                        <ListItemIcon color='primary'>
                            <DashboardIcon fontSize='small' 
                                color={location.pathname.startsWith('/dashboard') ? 'primary' : ''}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem 
                    key="projects" 
                    disablePadding
                >
                    <ListItemButton 
                        onClick={() => navigate('/projects')}
                        selected={location.pathname.startsWith('/project')}
                        sx={selectedStyle}
                    >
                        <ListItemIcon>
                            <DescriptionIcon fontSize='small' 
                                color={location.pathname.startsWith('/project') ? 'primary' : ''}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItemButton>
                </ListItem>

                <ListItem key="tasks" disablePadding>
                    <ListItemButton
                        // onClick={() => navigate('/tasks')}
                        selected={location.pathname.startsWith('/task')}
                        sx={selectedStyle}
                    >
                        <ListItemIcon>
                            <AssignmentRoundedIcon fontSize='small' 
                                color={location.pathname.startsWith('/task') ? 'primary' : ''}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                </ListItem>

                <ListItem key="organizations" disablePadding>
                    <ListItemButton 
                        onClick={() => navigate('/organizations')}
                        selected={location.pathname.startsWith('/organization')}
                        sx={selectedStyle}
                    >
                        <ListItemIcon>
                            <WorkIcon fontSize='small' 
                                color={location.pathname.startsWith('/organization') ? 'primary' : ''}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Organizations" />
                    </ListItemButton>
                </ListItem>
            </List>
            </Box>
        </Drawer>
    )
}   

export default SideBar;