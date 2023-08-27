import NavMenu from './NavMenu';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const OrganizationNavMenu = ({organization_id}) => {
    const navigate = useNavigate();

    const menuItems = ["Projects", "Employees", "Vendors"];
    const handleMenuSelect = (menu) => {
        if(menu.toLowerCase() === "projects")
            navigate(`/organization/${organization_id}/projects`);
        else if(menu.toLowerCase() === "vendors")
            navigate(`/organization/${organization_id}/vendors`);
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
            <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
        </Box>
    );
}

export default OrganizationNavMenu;