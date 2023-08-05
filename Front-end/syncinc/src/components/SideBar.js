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
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const SideBar = () => {
    let navigate = useNavigate();

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
                <ListItem key="dashboard" disablePadding>
                    <ListItemButton onClick={() => navigate('/')}>
                        <ListItemIcon>
                            <DashboardIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="projects" disablePadding>
                    <ListItemButton onClick={() => navigate('/projects')}>
                        <ListItemIcon>
                            <DescriptionIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItemButton>
                </ListItem>

                <ListItem key="tasks" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AssignmentRoundedIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                </ListItem>

                <ListItem key="organizations" disablePadding>
                    <ListItemButton onClick={() => navigate('/organizations')}>
                        <ListItemIcon>
                            <WorkIcon fontSize='small' />
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