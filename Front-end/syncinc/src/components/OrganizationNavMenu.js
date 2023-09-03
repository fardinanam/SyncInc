import NavMenu from './NavMenu';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const OrganizationNavMenu = ({organization_id}) => {
    const navigate = useNavigate();
    const icons = [<DescriptionIcon />, <SupervisedUserCircleIcon />];
    const menuItems = ["Projects", "Employees"];
    const handleMenuSelect = (menu) => {
        if(menu.toLowerCase() === "projects")
            navigate(`/organization/${organization_id}/projects`);
        else if(menu.toLowerCase() === "employees")
            navigate(`/organization/${organization_id}/employees`);
    }

    return (
        <Box 
            diplay="flex" 
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect} icons={icons}
            />
        </Box>
    );
}

export default OrganizationNavMenu;