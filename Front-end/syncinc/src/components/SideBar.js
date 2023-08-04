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
import ListIcon from '@mui/icons-material/List';

const drawerWidth = 240;

const SideBar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem key="dashboard" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <DashboardIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem key="projects" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <DescriptionIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItemButton>
                </ListItem>

                <ListItem key="tasks" disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ListIcon fontSize='small' />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                </ListItem>
            </List>
            </Box>
        </Drawer>
    )
}   

export default SideBar;