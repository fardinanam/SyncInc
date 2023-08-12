import { useContext } from 'react';
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
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';
import {ColorModeContext} from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;

const selectedStyle = {
    "&.Mui-selected": {
        color: "primary",
        bgcolor: "main",
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
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const mainColor = theme.palette.main[theme.palette.mode]

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderWidth: 0 },
                backgroundColor:{mainColor}
            }}
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
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    p: 3,
                }}
                >
                {theme.palette.mode[0].toUpperCase() + theme.palette.mode.slice(1).toLowerCase()} Mode
                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>
            </Box>
        </Drawer>
    )
}   

export default SideBar;