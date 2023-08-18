
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { menuItems, handleMenuSelect } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (name) => {
    handleClose();
    handleMenuSelect(name);
  }

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems?.map((item, index) => (
                    <MenuItem key={index} onClick={() => handleMenuClick(item)}>
                        {item}
                    </MenuItem>
          ))}
        {/* <MenuItem onClick={() => handleMenuClick("Projects")}>Projects</MenuItem>
        <MenuItem onClick={() => handleMenuClick("Employees")}>Employees</MenuItem>
        <MenuItem onClick={() => handleMenuClick("Vendors")}>Vendors</MenuItem> */}
      </Menu>
    </div>
  );
}
